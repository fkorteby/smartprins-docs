"""Inject mobile docs-sidebar toggler into all doc HTML pages that need it."""
from pathlib import Path
import re

ROOT = Path(r"C:\Users\sara.benmansour\smartprins-docs")

TOGGLER = (
    '<button id="docs-sidebar-toggler" class="docs-sidebar-toggler d-xl-none me-2" '
    'type="button" aria-label="Toggle navigation menu" aria-controls="docs-sidebar" '
    'aria-expanded="false">\n'
    "                <span></span>\n"
    "                <span></span>\n"
    "                <span></span>\n"
    "              </button>\n"
    "              "
)

# Insert toggler right before the navbar-brand that sits in the logo column
PATTERNS = [
    # Common pattern in EN/AR docs pages
    (
        re.compile(
            r'(<div class="col-4 col-md-3 col-lg-2 d-flex align-items-center">\s*)'
            r'(<a class="navbar-brand")',
            re.IGNORECASE,
        ),
        r"\1" + TOGGLER + r"\2",
    ),
    # Compact one-liner brand columns
    (
        re.compile(
            r'(<div class="col-4 col-md-3 col-lg-2 d-flex align-items-center">)'
            r'(<a class="navbar-brand")',
            re.IGNORECASE,
        ),
        r"\1" + TOGGLER + r"\2",
    ),
]

patched = []
skipped = []

for path in sorted(ROOT.glob("*.html")):
    text = path.read_text(encoding="utf-8")
    if 'id="docs-sidebar"' not in text and "id='docs-sidebar'" not in text:
        skipped.append(f"{path.name} (no sidebar)")
        continue
    if "docs-sidebar-toggler" in text:
        skipped.append(f"{path.name} (already has toggler)")
        continue

    new_text = text
    for pat, repl in PATTERNS:
        new_text, n = pat.subn(repl, new_text, count=1)
        if n:
            break
    else:
        skipped.append(f"{path.name} (no insert match)")
        continue

    path.write_text(new_text, encoding="utf-8")
    patched.append(path.name)

print(f"patched {len(patched)}")
for n in patched:
    print(" ", n)
print(f"skipped {len(skipped)}")
for n in skipped:
    print(" ", n)
