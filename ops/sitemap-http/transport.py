"""Six fixed Desktop GETs; no credentials, proxy overrides, retries or redirects."""
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import time
from diagnose import ORIGIN, UAS, LIMIT, headers, body_info

URL = ORIGIN + '/sitemap.xml'
ETAG = r'(?:W/)?"[\x21\x23-\x7e]{0,256}"'
METRICS = ('http_code', 'http_connect', 'http_version', 'remote_ip', 'remote_port',
           'ssl_verify_result', 'num_redirects', 'time_namelookup',
           'time_connect', 'time_appconnect', 'time_starttransfer', 'time_total',
           'size_download')


def raw_public_headers(raw):
    # Preserve order, casing, duplicates and status lines; redact sensitive fields
    # and continuations. No cookies are supplied by this diagnostic.
    output, redacted = [], False
    for line in raw.splitlines(keepends=True):
        if line.startswith((' ', '\t')) and redacted:
            output.append('[REDACTED continuation]\r\n')
            continue
        key = line.partition(':')[0].lower()
        redacted = bool(re.search(r'cookie|authorization|token|secret|api[-_]key', key))
        output.append(key + ': [REDACTED]\r\n' if redacted else line)
    return ''.join(output)


def probe(family, protocol, tag=None):
    if family not in (4, 6) or protocol not in ('1.1', '2'):
        raise ValueError('fixed transport only')
    if tag is not None and not re.fullmatch(ETAG, tag):
        raise ValueError('invalid validator')
    with tempfile.TemporaryDirectory() as tmp:
        hp, bp = Path(tmp) / 'headers', Path(tmp) / 'body'
        cmd = ['curl', '--disable', '--silent', '--show-error', '--proto', '=https',
               f'-{family}', '--http1.1' if protocol == '1.1' else '--http2',
               '--connect-timeout', '10', '--max-time', '20', '--max-filesize', str(LIMIT),
               '--compressed', '--header', 'Accept-Encoding: identity',
               '--user-agent', UAS['googlebot-desktop'], '--dump-header', str(hp),
               '--output', str(bp), '--write-out', '%{json}']
        if tag is not None:
            cmd += ['--header', 'If-None-Match: ' + tag]
        cmd.append(URL)
        try:
            result = subprocess.run(cmd, capture_output=True, timeout=25, check=False,
                                    env={'PATH': os.defpath, 'LANG': 'C.UTF-8'})
            code = result.returncode
            try:
                metrics = json.loads(result.stdout)
            except (ValueError, UnicodeError):
                metrics = {}
        except subprocess.TimeoutExpired:
            code, metrics = 28, {}
        raw = hp.read_bytes().decode('latin-1') if hp.exists() else ''
        blocks = headers(raw)
        final = blocks[-1] if blocks else {'status': None, 'headers': {}}
        row = {'atUtc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
               'path': '/sitemap.xml', 'ipFamilyRequested': family, 'httpRequested': protocol,
               'ua': 'googlebot-desktop', 'encodingRequested': 'identity', 'curlExit': code,
               'metrics': {k: metrics.get(k) for k in METRICS},
               'responses': blocks, 'status': final['status'], 'headers': final['headers'],
               'rawHeadersRedacted': raw_public_headers(raw), 'conditional': tag is not None,
               'tlsVerified': code == 0 and metrics.get('ssl_verify_result') == 0 and bool(metrics.get('time_appconnect')),
               'requestedProtocolObserved': metrics.get('http_version') == protocol}
        if code:
            row['measurement'] = 'unavailable'
            row['failureClass'] = {1: 'curl_protocol_unavailable', 2: 'curl_option_unavailable',
                                   4: 'curl_feature_unavailable', 5: 'proxy_dns', 6: 'dns',
                                   7: 'connect', 28: 'timeout', 35: 'tls_handshake',
                                   60: 'tls_certificate'}.get(code, 'transport_or_local_error')
        else:
            row['measurement'] = 'response'
        if code == 0:
            body = bp.read_bytes() if bp.exists() else b''
            row.update({'decodedBytes': len(body), 'decodedSha256': hashlib.sha256(body).hexdigest()})
            if final['status'] == 200:
                row.update(body_info(body, '/sitemap.xml') if len(body) <= LIMIT else {'bodyLimitExceeded': True})
        return row


def ipv6_route_evidence():
    # Local route metadata only; neither a public GET nor proof of Internet reachability.
    try:
        r = subprocess.run(['ip', '-6', 'route', 'show', 'default'],
                           env={'PATH': os.defpath}, capture_output=True, timeout=3)
        return {'commandSucceeded': r.returncode == 0,
                'defaultRoutePresent': bool(r.stdout.strip()) if r.returncode == 0 else None}
    except (OSError, subprocess.TimeoutExpired):
        return {'commandSucceeded': False, 'defaultRoutePresent': None}


def run(observe=probe, pause=time.sleep):
    rows = []
    for family, protocol in ((4, '1.1'), (4, '2'), (6, '1.1'), (6, '2')):
        if rows:
            pause(3)
        row = observe(family, protocol)
        rows.append(row)
        if row['status'] in (401, 403, 429) or row.get('metrics', {}).get('http_connect') == 403:
            return rows
    first = rows[0]
    tag = first['headers'].get('etag', '')
    if first['status'] == 200 and not first['curlExit'] and re.fullmatch(ETAG, tag):
        for kind, validator in [('matching', tag), ('nonmatching', '"gemnao-transport-control-never-matches"')]:
            pause(3)
            row = observe(4, '1.1', validator)
            row['conditionalKind'] = kind
            rows.append(row)
            if row['status'] in (401, 403, 429):
                break
    return rows


def main():
    if os.environ.get('GITHUB_ACTIONS') != 'true' or os.environ.get('GITHUB_REPOSITORY') != 'poe2-build-navi-jp/gemnao':
        raise SystemExit('Authorized repository Actions runner required')
    report = {'sourceSha': os.environ.get('GITHUB_SHA'), 'requestCap': 6,
              'runnerIpv6Route': ipv6_route_evidence(), 'observations': run(),
              'limitations': ['Not real Google network traffic',
                              'HTTP/2 option can fall back: use actual http_version',
                              'No IPv6 default route means runner limitation, not site failure',
                              'No extra control GET, redirects, retries, credentials or configuration changes',
                              'Raw headers preserve validator fields; sensitive headers are redacted']}
    report['requestsMade'] = len(report['observations'])
    Path('sitemap-http-result.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report))
    # Completion is not a health verdict. Missing paths remain unavailable in JSON.
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
