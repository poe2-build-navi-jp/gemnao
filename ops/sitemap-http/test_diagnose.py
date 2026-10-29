import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import diagnose as d

XML = b'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://gemnao.pages.dev/</loc></url></urlset>'

class DiagnosticTests(unittest.TestCase):
    def test_xml_and_header_safety(self):
        self.assertEqual(d.body_info(XML, '/sitemap.xml')['urlCount'], 1)
        self.assertTrue(d.body_info(b'<!DOCTYPE x><x/>', '/sitemap.xml')['bodyValidationError'])
        self.assertTrue(d.body_info(b'\xff', '/sitemap.xml')['bodyValidationError'])
        self.assertTrue(d.body_info(b'<broken', '/sitemap.xml')['bodyValidationError'])
        self.assertFalse(d.body_info(b'<html/>', '/sitemap.xml')['xmlValid'])
        parsed = d.headers('HTTP/2 200\r\nETag: "test"\r\nSet-Cookie: private\r\nAuthorization: private\r\n\r\n')
        self.assertEqual(parsed[0]['headers'], {'etag': '"test"'})

    def test_boundaries(self):
        self.assertEqual(len(d.matrix()) + 2, 19)
        for args in [('https://other.test',), ('/admin',), ('/sitemap.xml', 'unknown')]:
            with self.assertRaises(ValueError):
                d.observe(*args)
        with self.assertRaises(ValueError):
            d.observe('/sitemap.xml', etag='"x"\r\nAuthorization: bad')

    def test_command_no_credentials_or_redirect_following(self):
        def fake(cmd, **kwargs):
            self.assertNotIn('--location', cmd)
            self.assertEqual(cmd[1], '--disable')
            self.assertEqual(set(kwargs['env']), {'PATH', 'LANG'})
            self.assertEqual(cmd[-1], d.ORIGIN + '/sitemap.xml')
            Path(cmd[cmd.index('--dump-header') + 1]).write_text('HTTP/2 200\r\nETag: "x"\r\n\r\n')
            Path(cmd[cmd.index('--output') + 1]).write_bytes(XML)
            return type('Result', (), {'returncode': 0})()
        with patch.object(d.subprocess, 'run', side_effect=fake):
            self.assertTrue(d.observe('/sitemap.xml')['xmlValid'])

    def test_denial_stops_matrix(self):
        row = {'path': '/sitemap.xml', 'headers': {}, 'status': 403, 'curlExit': 0}
        with tempfile.TemporaryDirectory() as tmp:
            previous = os.getcwd()
            try:
                os.chdir(tmp)
                with patch.dict(os.environ, GITHUB_ACTIONS='true', GITHUB_REPOSITORY='poe2-build-navi-jp/gemnao'), patch.object(d, 'observe', return_value=row) as observe:
                    self.assertEqual(d.main(), 1)
                    self.assertEqual(observe.call_count, 1)
                    self.assertEqual(json.loads(Path('sitemap-http-result.json').read_text())['requestsMade'], 1)
            finally:
                os.chdir(previous)
