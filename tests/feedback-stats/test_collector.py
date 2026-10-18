"""Synthetic responses only: never contact production or send votes."""
import importlib.util
import io
import json
import tempfile
import unittest
from email.message import Message
from pathlib import Path
from unittest.mock import patch
from urllib.error import HTTPError, URLError

spec = importlib.util.spec_from_file_location('collector', Path(__file__).resolve().parents[2] / 'scripts/collect-feedback-stats.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def headers(**values):
    result = Message()
    for key, value in values.items():
        result[key.replace('_', '-')] = value
    return result


class Response(io.BytesIO):
    def __init__(self, body, status=200, **values):
        super().__init__(body)
        self.code = status
        self.headers = headers(content_type='application/json', **values)
        self.url = ''
    def geturl(self):
        return self.url


def good(resolved=2):
    return Response(json.dumps({'rows': [{'topic': 'launch', 'resolved': resolved, 'struggling': 3}], 'methods': [{'methodId': 'step-1', 'responses': resolved, 'notResolved': 4}], 'stepResultsAvailable': True}).encode())


class Opener:
    def __init__(self, values):
        self.values = iter(values)
        self.calls = []
    def open(self, request, timeout):
        self.calls.append((request, timeout))
        response = next(self.values)
        if isinstance(response, Exception):
            raise response
        response.url = request.full_url
        return response


class Tests(unittest.TestCase):
    def test_unique_contexts_and_separate_dimensions(self):
        opener = Opener([good(), good(5)])
        sleeps = []
        result = m.collect(['valorant', 'valorant', 'guide-low-fps'], opener, sleeps.append)
        self.assertTrue(result['complete'])
        self.assertEqual(len(opener.calls), 2)
        self.assertEqual(sleeps, [1])
        self.assertEqual(result['totals_for_fetched_contexts_only'], {'resolved': 7, 'struggling': 6})
        self.assertFalse(result['methods_add_to_rows'])
        for request, timeout in opener.calls:
            self.assertEqual(request.method, 'GET')
            self.assertEqual(request.get_header('User-agent'), 'gemnao-stats/1.0')
            self.assertEqual(timeout, 15)
            self.assertIsNone(request.data)
    def test_denials_stop_without_retry_or_later_requests(self):
        for status in [401, 403, 429, 302, 503]:
            with self.subTest(status=status):
                secret = b'Forbidden cloudflare envoy secret-cookie private@example.com'
                error = HTTPError('https://gemnao.pages.dev/api/feedback?game=valorant', status, 'message secret', headers(server='cloudflare', cf_ray='0123456789abcdef-NRT', set_cookie='secret-cookie', location='https://secret.invalid/token', retry_after='3600'), io.BytesIO(secret))
                opener = Opener([error, good()])
                result = m.collect(['valorant', 'guide-low-fps'], opener, lambda _: None)
                self.assertEqual(len(opener.calls), 1)
                self.assertFalse(result['complete'])
                self.assertEqual(result['unfetched'], ['valorant', 'guide-low-fps'])
                self.assertEqual(result['errors'][0]['status'], status)
                self.assertEqual(result['errors'][0]['attribution'], 'unconfirmed')
                encoded = json.dumps(result)
                for private in ['secret-cookie', 'private@example.com', 'secret.invalid']:
                    self.assertNotIn(private, encoded)
                self.assertIn('body_sha256', encoded)
                self.assertIn('cf-ray', encoded)
    def test_partial_does_not_mean_full_zero(self):
        opener = Opener([good(), URLError('proxy://name:password@private-host')])
        result = m.collect(['valorant', 'guide-low-fps', 'guide-vram-shortage'], opener, lambda _: None)
        self.assertEqual(list(result['snapshots']), ['valorant'])
        self.assertEqual(result['totals_for_fetched_contexts_only']['resolved'], 2)
        self.assertFalse(result['complete'])
        self.assertNotIn('password', json.dumps(result))
    def test_timeout_no_retry(self):
        opener = Opener([TimeoutError('private'), good()])
        result = m.collect(['valorant'], opener)
        self.assertEqual(result['errors'][0]['error_type'], 'TimeoutError')
        self.assertEqual(len(opener.calls), 1)
    def test_malformed_counts_duplicates_and_oversize(self):
        values = [b'<html>challenge secret</html>', b'{bad', b'x' * (m.LIMIT+1)]
        for count in [True, -1, 1.5, '2']:
            values.append(json.dumps({'rows':[{'topic':'launch','resolved':count,'struggling':0}], 'methods':[], 'stepResultsAvailable':True}).encode())
        values.append(json.dumps({'rows':[{'topic':'launch','resolved':1,'struggling':0}]*2, 'methods':[], 'stepResultsAvailable':True}).encode())
        for body in values:
            result = m.collect(['valorant'], Opener([Response(body)]))
            self.assertFalse(result['complete'])
            self.assertEqual(result['snapshots'], {})
    def test_empty_is_valid_only_for_requested_context(self):
        body=json.dumps({'rows':[], 'methods':[], 'stepResultsAvailable':True}).encode()
        result=m.collect(['valorant'], Opener([Response(body)]))
        self.assertTrue(result['complete'])
        self.assertEqual(result['scope'], 'explicit_contexts_only')
    def test_redirect_handler_never_follows(self):
        self.assertIsNone(m.NoRedirect().redirect_request(None,None,302,'',{},'https://elsewhere.invalid'))
    def test_invalid_contexts_rejected_before_network(self):
        for values in [[], ['valorant?x=y'], ['https://gemnao.pages.dev'], ['valorant', ' x']]:
            opener=Opener([])
            with self.assertRaises(ValueError): m.collect(values,opener)
            self.assertEqual(opener.calls, [])
    def test_output_directory_created_and_no_overwrite_or_repeat(self):
        with tempfile.TemporaryDirectory() as temp:
            root=Path(temp); context=root/'contexts.json'; context.write_text('["valorant"]'); output=root/'new'/'snapshot.json'
            with patch('sys.argv',['collector','--contexts',str(context),'--output',str(output)]), patch.object(m,'collect',return_value={'complete':True,'snapshots':{},'requested':['valorant'],'errors':[]}) as call:
                self.assertEqual(m.main(),0)
                self.assertEqual(output.stat().st_mode & 0o777, 0o600)
                with self.assertRaises(FileExistsError): m.main()
                self.assertEqual(call.call_count,1)


if __name__ == '__main__':
    unittest.main()
