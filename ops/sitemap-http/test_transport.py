import json
from pathlib import Path
import unittest
from unittest.mock import patch
import transport as t

class TransportTests(unittest.TestCase):
    def test_raw_validator_preserved_and_secret_redacted(self):
        raw = 'HTTP/2 304\r\nETag: "abc"\r\nCache-Control: max-age=0\r\nSet-Cookie: secret\r\n continuation\r\n\r\n'
        redacted = t.raw_public_headers(raw)
        self.assertIn('ETag: "abc"\r\n',redacted)
        self.assertIn('Cache-Control: max-age=0\r\n',redacted)
        self.assertNotIn('secret',redacted)
        self.assertNotIn(' continuation\r\n',redacted)
        self.assertEqual(t.headers(redacted)[0]['headers']['etag'],'"abc"')
        self.assertNotIn('etag',t.headers('HTTP/2 304\r\nDate: now\r\n\r\n')[0]['headers'])

    def test_six_fixed_gets_even_if_ipv6_unavailable(self):
        calls=[]
        def fake(f,p,tag=None):
            calls.append((f,p,tag))
            return {'status':None if f==6 else 200,'curlExit':7 if f==6 else 0,
                    'headers':{'etag':'"abc"'},'metrics':{}}
        rows=t.run(fake,lambda _:None)
        self.assertEqual(len(calls),6)
        self.assertEqual(calls[:4],[(4,'1.1',None),(4,'2',None),(6,'1.1',None),(6,'2',None)])
        self.assertEqual(calls[4],(4,'1.1','"abc"'))
        self.assertEqual(rows[-1]['conditionalKind'],'nonmatching')

    def test_denial_stops_without_other_paths(self):
        calls=[]
        def fake(*args):
            calls.append(args)
            return {'status':403,'curlExit':0,'headers':{},'metrics':{}}
        self.assertEqual(len(t.run(fake,lambda _:None)),1)
        self.assertEqual(len(calls),1)

    def test_fixed_command_and_actual_protocol_not_assumed(self):
        def fake(cmd,**kw):
            self.assertEqual(cmd[-1],t.URL)
            self.assertIn('-4',cmd);self.assertIn('--http2',cmd)
            self.assertNotIn('--location',cmd);self.assertNotIn('--insecure',cmd)
            self.assertEqual(set(kw['env']),{'PATH','LANG'})
            Path(cmd[cmd.index('--dump-header')+1]).write_bytes(b'HTTP/1.1 304\r\nETag: "a"\r\n\r\n')
            return type('R',(),{'returncode':0,'stdout':json.dumps({'http_version':'1.1','ssl_verify_result':0,'time_appconnect':.1}).encode()})()
        with patch.object(t.subprocess,'run',side_effect=fake):
            row=t.probe(4,'2')
            self.assertFalse(row['requestedProtocolObserved'])
            self.assertTrue(row['tlsVerified'])
            self.assertIn('ETag',row['rawHeadersRedacted'])

    def test_invalid_input_and_timeout(self):
        with self.assertRaises(ValueError):t.probe(5,'3')
        with self.assertRaises(ValueError):t.probe(4,'2','"a"\r\nInjected: yes')
        with patch.object(t.subprocess,'run',side_effect=t.subprocess.TimeoutExpired('curl',25)):
            row=t.probe(6,'1.1')
            self.assertEqual(row['measurement'],'unavailable')
            self.assertFalse(row['tlsVerified'])
