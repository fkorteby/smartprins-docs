"""Patch Arabic HTML pages: mobile RTL overrides for docs layout."""
from pathlib import Path
import re

ROOT = Path(r"C:\Users\sara.benmansour\smartprins-docs")

MOBILE_BLOCK = """
      @media (max-width: 1199.98px) {
        html[lang="ar"] .docs-content {
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        html[lang="ar"] .docs-sidebar.sidebar-hidden {
          transform: translateX(300px) !important;
        }
      }
"""

# Match existing AR docs-content rule (multiline or single-line)
CONTENT_RE = re.compile(
    r"(html\[lang=\"ar\"\]\s*\.docs-content\s*\{[^}]*margin-right:\s*300px\s*!important;[^}]*\})",
    re.MULTILINE,
)

patched = []
skipped = []
for path in sorted(ROOT.glob("*-ar.html")):
    text = path.read_text(encoding="utf-8")
    if "transform: translateX(300px)" in text and "@media (max-width: 1199.98px)" in text:
        # Already has mobile RTL fix
        if "html[lang=\"ar\"] .docs-content" in text.split("@media (max-width: 1199.98px)")[1][:500]:
            skipped.append(path.name)
            continue

    m = CONTENT_RE.search(text)
    if not m:
        skipped.append(path.name + " (no match)")
        continue

    # Insert mobile block after the docs-content rule if not already present nearby
    insert_at = m.end()
    after = text[insert_at : insert_at + 400]
    if "translateX(300px)" in after:
        skipped.append(path.name + " (already near)")
        continue

    text = text[:insert_at] + "\n" + MOBILE_BLOCK + text[insert_at:]
    path.write_text(text, encoding="utf-8")
    patched.append(path.name)

print("patched:", len(patched))
for n in patched:
    print(" ", n)
print("skipped:", len(skipped))
for n in skipped:
    print(" ", n)
