"""Keep the reference's typefaces local so the invitation works without Google Fonts."""
import base64
import re
import sys
from io import BytesIO
from pathlib import Path

root = Path(__file__).resolve().parents[1]
source = (root / 'mẫu.html').read_text(encoding='utf-8')
target = root / 'public' / 'assets' / 'fonts'
target.mkdir(parents=True, exist_ok=True)
families = {
    'Roboto': 'roboto',
    'Playfair Display': 'playfair-display',
    'GreatVibes-Regular.ttf': 'great-vibes',
    'FzManstein.ttf': 'manstein',
}
rules = []
produced = set()
counts = {}
if len(sys.argv) > 1:
    sys.path.insert(0, sys.argv[1])
try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError:
    TTFont = None
for block in re.findall(r'@font-face\s*\{[^}]+\}', source):
    family = re.search(r'font-family:"([^"]+)"', block)
    if not family or family[1] not in families:
        continue
    # Latin + Vietnamese subsets cover the invitation; avoid overlapping extended subsets.
    if 'unicode-range:U+0100-02BA' in block:
        continue
    asset = re.search(r'data:[^;]+;base64,([^\)"\s]+)', block)
    if not asset:
        continue
    extension = 'woff2' if 'woff2' in block else 'ttf'
    font_bytes = base64.b64decode(asset[1])
    if extension == 'ttf' and TTFont:
        font = TTFont(BytesIO(font_bytes))
        subsetter = subset.Subsetter()
        characters = set(range(0x0020, 0x0100)) | set(range(0x1EA0, 0x1F00)) | set(range(0x2000, 0x2070)) | {0x0102, 0x0103, 0x0110, 0x0111, 0x0128, 0x0129, 0x0168, 0x0169, 0x01A0, 0x01A1, 0x01AF, 0x01B0, 0x0300, 0x0301, 0x0303, 0x0304, 0x0308, 0x0309, 0x0323, 0x0329}
        if family[1] == 'FzManstein.ttf':
            characters = set(range(0x0020, 0x0080))
        subsetter.populate(unicodes=characters)
        subsetter.subset(font)
        font.flavor = 'woff2'
        compressed = BytesIO()
        font.save(compressed)
        font_bytes = compressed.getvalue()
        extension = 'woff2'
        block = block.replace('format("truetype")', 'format("woff2")')
    slug = families[family[1]]
    count = counts.get(slug, 0)
    counts[slug] = count + 1
    name = f'{slug}-{count}.{extension}'
    (target / name).write_bytes(font_bytes)
    produced.add(name)
    block = re.sub(r'data:[^\)"\s]+', f'/assets/fonts/{name}', block)
    rules.append(block.replace('@font-face{', '@font-face{font-display:swap;'))
(root / 'src' / 'fonts.css').write_text('\n'.join(rules) + '\n', encoding='utf-8')
for old in target.iterdir():
    if old.name not in produced and old.name.startswith(('eb-garamond-', 'roboto-', 'playfair-display-', 'great-vibes-', 'manstein-')) and old.suffix in ('.woff2', '.ttf'):
        old.unlink()
print(f'Extracted {len(rules)} local font subsets.')
