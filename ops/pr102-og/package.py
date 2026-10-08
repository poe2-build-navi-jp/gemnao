"""Verify and package PR 102's exact generated files; never commit or deploy."""
import hashlib
import json
import os
import re
import shutil
import subprocess
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from PIL import Image

SOURCE = "512c9dd1abf8e699418e01bb8c907143319617e8"
BRANCH = "content/three-game-guides-20261008"
BASE = "https://gemnao.pages.dev"
GAMES = {
    "arc-raiders": ["matchmaking", "voice-chat"],
    "elden-ring-nightreign": ["dlc-not-working", "deep-of-night-not-appearing"],
    "marvel-rivals": ["login-error", "high-ping"],
}
ROUTES = [
    f"{prefix}/games/{game}{suffix}"
    for prefix in ["", "/en", "/zh", "/es"]
    for game, articles in GAMES.items()
    for suffix in [""] + ["/" + slug for slug in articles]
]
OUT = Path("../artifact")
MANIFEST = "lib/og-image-manifest.ts"
EXPECTED = {MANIFEST} | {"public/images/og" + route + ".png" for route in ROUTES}


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def git(*args):
    return subprocess.check_output(["git", *args], text=True)


def hashes(text):
    return dict(re.findall(r"""['"]([^'"]+)['"]\s*:\s*['"]([0-9a-f]+)['"]""", text))


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.head = False
        self.meta = []
        self.links = []
        self.assets = []
        self.lang = ""
        self.h1 = 0
        self.title = False
        self.schemas = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "head":
            self.head = True
        if tag == "html":
            self.lang = attrs.get("lang", "")
        if tag == "h1":
            self.h1 += 1
        if tag == "title" and self.head:
            self.title = True
        if tag == "meta" and self.head:
            self.meta.append(attrs)
        if tag == "link" and self.head:
            self.links.append(attrs)
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.assets.append(attrs.get("href", ""))
        if tag == "script" and attrs.get("src"):
            self.assets.append(attrs["src"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.schemas += 1

    def handle_endtag(self, tag):
        if tag == "head":
            self.head = False


require(git("rev-parse", "HEAD").strip() == SOURCE, "Wrong checkout SHA")
require(not git("diff", "--name-only", "--diff-filter=D").strip(), "Unexpected deletion")
changed = set(git("diff", "--name-only", "-z", "HEAD").strip("\0").split("\0")) - {""}
changed |= set(git("ls-files", "--others", "--exclude-standard", "-z").strip("\0").split("\0")) - {""}
require(changed == EXPECTED, f"Generated path allowlist mismatch: extra={sorted(changed-EXPECTED)}, missing={sorted(EXPECTED-changed)}")
before = hashes(git("show", f"{SOURCE}:{MANIFEST}"))
after = hashes(Path(MANIFEST).read_text())
require(all(after.get(k) == v for k, v in before.items()), "Existing OG hashes changed")
require(set(after) - set(before) == set(ROUTES), "Manifest additions must be exactly 36 routes")
snapshot_map = json.loads(Path("dist/editorial-snapshots.json").read_text())
sitemap = Path("dist/client/sitemap.xml").read_text()
report = []
for route in ROUTES:
    filename = "public/images/og" + route + ".png"
    file = Path(filename)
    require(file.is_file() and not file.is_symlink(), f"Missing or unsafe PNG: {filename}")
    with Image.open(file) as img:
        require(img.format == "PNG" and img.size == (1200, 630), f"Invalid card: {filename}")
        img.verify()
    require(route in snapshot_map, f"Missing static route: {route}")
    snapshot = Path("dist/client") / snapshot_map[route].lstrip("/")
    require(snapshot.is_relative_to(Path("dist/client/_gemnao-snapshots")), "Unsafe snapshot path")
    html = snapshot.read_text()
    page = Page()
    page.feed(html)
    prefix = next((p for p in ["/en", "/zh", "/es"] if route.startswith(p + "/")), "")
    original = route[len(prefix):]
    language = {"/en": "en", "/zh": "zh-Hans", "/es": "es", "": "ja"}[prefix]
    require(page.lang == language and page.h1 == 1 and page.title and page.schemas, f"Incomplete HTML: {route}")
    canonical = [x.get("href") for x in page.links if x.get("rel") == "canonical"]
    require(canonical == [BASE + route], f"Incorrect canonical: {route}")
    alternates = {x.get("hreflang"): x.get("href") for x in page.links if x.get("rel") == "alternate" and x.get("hreflang")}
    expected_alternates = {"ja": BASE + original, "x-default": BASE + original,
                           "en": BASE + "/en" + original, "zh-Hans": BASE + "/zh" + original,
                           "es": BASE + "/es" + original}
    require(alternates == expected_alternates, f"Incorrect hreflang: {route}")
    og = [x.get("content") for x in page.meta if x.get("property") == "og:image"]
    require(og == [BASE + "/images/og" + route + ".png?v=" + after[route]], f"Missing generated OG metadata: {route}")
    require(any(x.get("name") == "description" and x.get("content") for x in page.meta), f"Missing description: {route}")
    require(not any(x.get("name") == "robots" and "noindex" in x.get("content", "") for x in page.meta), f"Unexpected noindex: {route}")
    require("<loc>" + BASE + route + "</loc>" in sitemap, f"Missing sitemap URL: {route}")
    require(page.assets, f"No CSS/JS assets: {route}")
    for asset in page.assets:
        parsed = urlparse(asset)
        if not parsed.netloc or parsed.netloc == "gemnao.pages.dev":
            require((Path("dist/client") / parsed.path.lstrip("/")).is_file(), f"Missing CSS/JS file: {asset}")
    report.append({"route": route, "lang": language, "canonical": canonical[0], "og": og[0], "snapshot": snapshot_map[route]})
    destination = OUT / "html" / (route.strip("/") + ".html")
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(snapshot, destination)

checksums = {}
for filename in sorted(EXPECTED):
    source = Path(filename)
    require(source.is_file() and not source.is_symlink(), f"Unsafe source: {filename}")
    destination = OUT / "commit-files" / filename
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)
    checksums[filename] = hashlib.sha256(source.read_bytes()).hexdigest()
(OUT / "reports").mkdir(parents=True, exist_ok=True)
(OUT / "reports" / "verified.json").write_text(json.dumps({
    "source_sha": SOURCE, "target_branch": BRANCH,
    "run_id": os.environ.get("GITHUB_RUN_ID"),
    "workflow_sha": os.environ.get("GITHUB_SHA"),
    "files_sha256": checksums, "pages": report,
    "note": "Artifact only. Review all cards before connector commit; this workflow cannot push or deploy."
}, ensure_ascii=False, indent=2) + "\n")
print(f"PASS: {len(ROUTES)} generated PNGs and static pages; {len(EXPECTED)} exact commit files")
