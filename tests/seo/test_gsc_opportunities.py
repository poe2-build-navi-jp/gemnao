import importlib.util
import io
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location('gsc', Path(__file__).parents[2] / 'scripts/gsc-opportunities.py')
gsc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gsc)

class Opportunities(unittest.TestCase):
    def test_page_selection_uses_real_click_ratio_and_sample_floor(self):
        source = io.StringIO('Top pages,Clicks,Impressions,CTR,Position\nhttps://example.com/games/a,1,100,90%,4\nhttps://example.com/guide/b,2,80,2.5%,17\nhttps://example.com/guide/small,0,2,0%,2\nhttps://example.com/about,0,300,0%,1\nhttps://example.com/guide/high,20,100,20%,5\n')
        rows = gsc.candidates(source)
        self.assertEqual([r['reason'] for r in rows], ['low_ctr', 'content_11_30'])
        self.assertEqual(rows[0]['ctr'], .01)
    def test_japanese_export_and_thousands_separator(self):
        rows = gsc.candidates(io.StringIO('上位のページ,クリック数,表示回数,掲載順位\nhttps://example.com/games/a,1,"1,000",6.8\n'))
        self.assertEqual(rows[0]['impressions'], 1000)
    def test_boundary_not_rounded_into_another_bucket(self):
        rows = gsc.candidates(io.StringIO('Top pages,Clicks,Impressions,Position\nhttps://example.com/guide/a,0,50,10.9\nhttps://example.com/guide/b,0,50,11\nhttps://example.com/guide/c,0,50,30\nhttps://example.com/guide/d,0,50,30.1\n'))
        self.assertEqual([r['url'].split('/')[-1] for r in rows], ['b', 'c'])
    def test_rejects_wrong_dimension_duplicates_and_bad_numbers(self):
        for source in [
            'Query,Clicks,Impressions,Position\ntest,0,30,1\n',
            'Top pages,Clicks,Impressions,Position\nhttps://example.com/a,0,30,1\nhttps://example.com/a,0,30,1\n',
            'Top pages,Clicks,Impressions,Position\nhttps://example.com/a,0,NaN,1\n',
            'Top pages,Clicks,Impressions,Position\nhttps://example.com/a,40,30,1\n',
        ]:
            with self.assertRaises(ValueError): gsc.candidates(io.StringIO(source))

if __name__ == '__main__': unittest.main()
