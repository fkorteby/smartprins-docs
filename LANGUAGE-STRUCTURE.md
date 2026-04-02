# Language Structure

This project now uses page pairs for the inventory section and the home page.

## Naming

- English page: `page-name.html`
- Arabic page: `page-name-ar.html`

## Page Pair Metadata

Each paired page should declare both counterparts on the `<html>` tag.

Example:

```html
<html
  lang="en"
  dir="ltr"
  data-lang-en="inventory-purchasing.html"
  data-lang-ar="inventory-purchasing-ar.html"
>
```

Arabic counterpart:

```html
<html
  lang="ar"
  dir="rtl"
  data-lang-en="inventory-purchasing.html"
  data-lang-ar="inventory-purchasing-ar.html"
>
```

## Current Pairs

- `index.html` <-> `index-ar.html`
- `inventory-intro0.html` <-> `inventory-intro0-ar.html`
- `inventory-intro.html` <-> `inventory-intro-ar.html`
- `inventory-ingredients.html` <-> `inventory-ingredients-ar.html`
- `inventory-suppliers-recipies.html` <-> `inventory-suppliers-recipies-ar.html`
- `inventory-live.html` <-> `inventory-live-ar.html`
- `inventory-purchasing.html` <-> `inventory-purchasing-ar.html`
- `inventory-stock-control.html` <-> `inventory-stock-control-ar.html`
- `inventory-transfers-preparation.html` <-> `inventory-transfers-preparation-ar.html`
- `inventory-reports.html` <-> `inventory-reports-ar.html`

## Shared Switch Logic

The language switch is handled in `assets/js/lang.js`.

It:

- saves the chosen language in `localStorage` using `sp_lang`
- applies `lang` and `dir`
- redirects to the paired `-ar.html` or English page when available

## Rule For New Pages

When creating a new page:

1. Create the English file.
2. Copy it to a `-ar.html` file.
3. Translate the Arabic file.
4. Set `lang`, `dir`, `data-lang-en`, and `data-lang-ar` on both files.
5. Include `assets/js/lang.js` before `</body>`.
