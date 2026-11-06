#!/usr/bin/env python3
"""Read a Search Console Pages CSV locally; never uploads source analytics."""
import argparse
import csv
import math
from pathlib import Path
from urllib.parse import urlsplit

ALIASES = {
    'url': ('Top pages', '上位のページ', 'Page', 'ページ', 'URL'),
    'clicks': ('Clicks', 'クリック数'),
    'impressions': ('Impressions', '表示回数'),
    'position': ('Position', '掲載順位', '平均掲載順位'),
}
EXCLUDED = {'/about', '/privacy', '/terms', '/contact', '/status'}


def number(value):
    value = float(value.replace(',', '').replace('%', '').strip())
    if not math.isfinite(value) or value < 0:
        raise ValueError('negative or non-finite metric')
    return value


def candidates(source, min_impressions=30, target_ctr=0.03):
    reader = csv.DictReader(source)
    headers = {h.strip(): h for h in reader.fieldnames or []}
    columns = {}
    for key, aliases in ALIASES.items():
        columns[key] = next((headers[a] for a in aliases if a in headers), None)
        if columns[key] is None:
            raise ValueError(f'Missing Pages CSV column: {key}')
    result, seen = [], set()
    for line, row in enumerate(reader, 2):
        try:
            url = row[columns['url']].strip()
            parsed = urlsplit(url)
            if parsed.scheme not in ('https', 'http') or not parsed.netloc:
                raise ValueError('invalid URL')
            if url in seen:
                raise ValueError('duplicate page; export a page-only table')
            seen.add(url)
            clicks = number(row[columns['clicks']])
            impressions = number(row[columns['impressions']])
            position = number(row[columns['position']])
            if clicks > impressions or position < 1:
                raise ValueError('inconsistent metrics')
        except (ValueError, AttributeError, TypeError) as error:
            raise ValueError(f'CSV line {line}: {error}') from error
        if impressions < min_impressions or parsed.path.rstrip('/') in EXCLUDED:
            continue
        ctr = clicks / impressions if impressions else 0
        reason = ('low_ctr' if position <= 10 and ctr < target_ctr else
                  'content_11_30' if 11 <= position <= 30 else None)
        if not reason:
            continue
        result.append({'url': url, 'reason': reason, 'clicks': clicks,
                       'impressions': impressions, 'ctr': round(ctr, 5),
                       'position': position,
                       # Scenario for prioritization, never a traffic forecast.
                       'click_gap_at_target': round(max(0, impressions * target_ctr - clicks), 2)})
    return sorted(result, key=lambda x: (-x['click_gap_at_target'], -x['impressions'], x['url']))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv', type=Path)
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--min-impressions', type=int, default=30)
    parser.add_argument('--target-ctr', type=float, default=0.03)
    args = parser.parse_args()
    if args.min_impressions < 1 or not 0 < args.target_ctr <= 1:
        parser.error('Use positive impressions and a target CTR between 0 and 1')
    if args.output.resolve() == args.csv.resolve():
        parser.error('Output must differ from the source CSV')
    with args.csv.open(encoding='utf-8-sig', newline='') as source:
        rows = candidates(source, args.min_impressions, args.target_ctr)
    fields = ['url', 'reason', 'clicks', 'impressions', 'ctr', 'position', 'click_gap_at_target']
    with args.output.open('w', encoding='utf-8-sig', newline='') as target:
        writer = csv.DictWriter(target, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)
    print(f'{len(rows)} candidates. Target CTR is an editorial threshold, not a forecast.')


if __name__ == '__main__':
    main()
