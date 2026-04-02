# System Design

This repository is moving from hand-edited full HTML pages to a small static-site source system.

## Goals

- reduce copy-paste across English and Arabic pages
- keep shared layout in one place
- keep page content in source fragments
- generate final HTML files from templates

## Source Layout

```text
site-src/
  templates/
    common.js
    home.js
    docs.js
  content/
    home/
      extra-head.html
      main.html
    inventory-purchasing/
      extra-head.html
      main.html
scripts/
  build-site.js
```

## What Is Generated

Currently the build script generates:

- `index.html`
- `index-ar.html`
- `inventory-purchasing.html`
- `inventory-purchasing-ar.html`

## Build Command

```bash
npm run build
```

No external packages are required.

## How To Extend

To migrate another page:

1. Create a new folder under `site-src/content/<page-slug>/`
2. Add:
   - `extra-head.html`
   - `main.html`
3. Add two entries in `scripts/build-site.js`
   - English output
   - Arabic output
4. Point `data-lang-en` and `data-lang-ar` to the page pair

## Why This Helps

- Header, footer, scripts, and language behavior now live in shared templates.
- Page content can be updated without touching the whole HTML shell.
- Arabic and English output pages can stay paired consistently.

## Current Limitation

The migrated pages still reuse body fragments that contain both `.lang-en` and `.lang-ar` content blocks.
That is already cleaner than duplicating the full page shell, but the next cleanup step is to split those fragments into truly separate English and Arabic source content files.
