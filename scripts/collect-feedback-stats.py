#!/usr/bin/env python3
"""Read-only cumulative snapshots. No retries, redirects, cookies or vote writes."""
import argparse
import hashlib
import json
import re
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import HTTPRedirectHandler, Request, build_opener

ORIGIN = 'https://gemnao.pages.dev'
USER_AGENT = 'gemnao-stats/1.0'
LIMIT = 262144


def utc():
    return datetime.now(timezone.utc).isoformat()


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def evidence(status, headers, body):
    """Never persist raw error pages, cookies, locations, proxy addresses or tokens."""
    safe = {}
    patterns = {
        'cf-ray': r'[0-9a-fA-F]{8,32}-[A-Za-z]{3}',
        'cf-mitigated': r'challenge',
        'x-mitmproxy-blocked-reason': r'(?:ROBOTS_DENIED|BLOCK_LIST|PERMISSION_DENIED|HTTPS_ONLY)',
        'retry-after': r'[0-9]{1,8}',
        'content-type': r'(?:application/json|text/html|text/plain)(?:;\s*charset=[A-Za-z0-9-]+)?',
    }
    for key, pattern in patterns.items():
        value = headers.get(key, '')
        if re.fullmatch(pattern, value, re.I):
            safe[key] = value
    server = headers.get('server', '').lower()
    if server in ('cloudflare', 'envoy', 'nginx'):
        safe['server'] = server
    lower = body.lower()
    return {
        'status': status, 'headers': safe,
        'body_bytes_sampled': len(body), 'body_sha256': hashlib.sha256(body).hexdigest(),
        'body_truncated': len(body) > LIMIT,
        'signals': [name for name, marker in (
            ('cloudflare_text', b'cloudflare'), ('challenge_text', b'cf-chl-'),
            ('envoy_text', b'envoy'), ('access_denied_text', b'access denied'),
            ('forbidden_text', b'forbidden')) if marker in lower],
        'attribution': 'unconfirmed',
    }


def validate(data):
    if not isinstance(data, dict) or type(data.get('stepResultsAvailable')) is not bool:
        raise ValueError('invalid_schema')
    rows, methods = data.get('rows'), data.get('methods')
    if not isinstance(rows, list) or not isinstance(methods, list):
        raise ValueError('invalid_schema')
    def count(v):
        if type(v) is not int or not 0 <= v <= 9007199254740991:
            raise ValueError('invalid_count')
        return v
    def key(v):
        if not isinstance(v, str) or not re.fullmatch(r'[a-z0-9-]{1,200}', v):
            raise ValueError('invalid_key')
        return v
    cleaned_rows, cleaned_methods, seen = [], [], set()
    for row in rows:
        if not isinstance(row, dict):
            raise ValueError('invalid_schema')
        topic = key(row.get('topic'))
        if topic in seen:
            raise ValueError('duplicate_topic')
        seen.add(topic)
        cleaned_rows.append({'topic': topic, 'struggling': count(row.get('struggling')), 'resolved': count(row.get('resolved'))})
    # Method IDs can recur across legacy topics: API omits that dimension.
    # Preserve each row; deliberately never calculate an additive methods total.
    for row in methods:
        if not isinstance(row, dict):
            raise ValueError('invalid_schema')
        item = {'methodId': key(row.get('methodId')), 'responses': count(row.get('responses'))}
        if data['stepResultsAvailable']:
            item['notResolved'] = count(row.get('notResolved'))
        cleaned_methods.append(item)
    return {'rows': cleaned_rows, 'methods': cleaned_methods, 'stepResultsAvailable': data['stepResultsAvailable']}


def collect(contexts, opener=None, pause=time.sleep, timeout=15, interval=1):
    if not contexts or any(not isinstance(x, str) or not re.fullmatch(r'[a-z0-9-]{1,200}', x) for x in contexts):
        raise ValueError('contexts must be a nonempty list of public feedback keys')
    unique = list(dict.fromkeys(contexts))
    opener = opener or build_opener(NoRedirect())
    report = {'schema': 1, 'user_agent': USER_AGENT, 'started_at': utc(), 'finished_at': None,
              'scope': 'explicit_contexts_only', 'measurement': 'cumulative_snapshot_not_daily_votes_or_people',
              'requested': unique, 'duplicate_inputs_removed': len(contexts)-len(unique),
              'snapshots': {}, 'errors': [], 'unfetched': [], 'complete': False,
              'totals_for_fetched_contexts_only': {'resolved': 0, 'struggling': 0},
              'methods_add_to_rows': False}
    for index, context in enumerate(unique):
        if index:
            pause(interval)
        request = Request(ORIGIN + '/api/feedback?' + urlencode({'game': context}),
                          headers={'User-Agent': USER_AGENT, 'Accept': 'application/json'}, method='GET')
        observed = utc()
        meta = {'attribution': 'unconfirmed'}
        try:
            try:
                response = opener.open(request, timeout=timeout)
            except HTTPError as error:
                response = error
            with response:
                status, headers = response.code, response.headers
                meta = evidence(status, headers, b'')
                meta['response_headers_at'] = utc()
                meta['body_read_complete'] = False
                final_url = response.geturl()
                meta['final_url'] = final_url if final_url == request.full_url else '[unexpected URL omitted]'
                body = response.read(LIMIT + 1)
            meta.update(evidence(status, headers, body))
            meta['body_read_complete'] = True
            meta['response_finished_at'] = utc()
            if status != 200:
                report['errors'].append({'context': context, 'request_started_at': observed, 'kind': 'http', **meta})
                break
            if len(body) > LIMIT:
                raise ValueError('response_too_large')
            if headers.get('content-type', '').split(';')[0].strip().lower() != 'application/json':
                raise ValueError('unexpected_content_type')
            snapshot = validate(json.loads(body))
            report['snapshots'][context] = {'request_started_at': observed, 'response_finished_at': meta['response_finished_at'], **snapshot}
            for row in snapshot['rows']:
                for key in ('resolved', 'struggling'):
                    report['totals_for_fetched_contexts_only'][key] += row[key]
        except (ValueError, UnicodeError) as error:
            known = str(error) if str(error) in {'invalid_schema', 'invalid_count', 'invalid_key', 'duplicate_topic', 'response_too_large', 'unexpected_content_type'} else 'invalid_json'
            report['errors'].append({'context': context, 'request_started_at': observed, 'kind': known, **meta})
            break
        except (URLError, OSError, TimeoutError) as error:
            # Exception strings may contain credentials/proxy URLs. Record class only.
            report['errors'].append({'context': context, 'request_started_at': observed, 'kind': 'transport', 'error_type': type(error).__name__, **meta})
            break
    report['unfetched'] = [x for x in unique if x not in report['snapshots']]
    report['complete'] = not report['unfetched']
    report['finished_at'] = utc()
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--contexts', type=Path, required=True, help='JSON array of explicit API context keys; no URL discovery')
    parser.add_argument('--output', type=Path, required=True, help='New snapshot file; never append or overwrite')
    args = parser.parse_args()
    contexts = json.loads(args.contexts.read_text())
    if not isinstance(contexts, list) or not contexts or any(not isinstance(x, str) or not re.fullmatch(r'[a-z0-9-]{1,200}', x) for x in contexts):
        parser.error('contexts must be a nonempty JSON array of public context keys')
    # Reserve output before any network request; repeat invocation cannot overwrite/add totals.
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open('x', encoding='utf-8') as output:
        args.output.chmod(0o600)
        result = collect(contexts)
        json.dump(result, output, ensure_ascii=False, indent=2)
        output.write('\n')
    print(json.dumps({'complete': result['complete'], 'fetched': len(result['snapshots']), 'requested': len(result['requested']), 'errors': len(result['errors'])}))
    return 0 if result['complete'] else 2


if __name__ == '__main__':
    raise SystemExit(main())
