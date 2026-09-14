# Internationalization and hreflang checklist template

> **TEMPLATE ONLY:** Replace every `{{PLACEHOLDER}}` with verified values. Do not ship placeholders, unsupported codes, locale-only redirects, or incomplete clusters.

## Strategy

- Canonical host strategy: `{{DIRECTORIES_SUBDOMAINS_OR_DOMAINS}}`
- Supported locale set: `{{LOCALE_1}}, {{LOCALE_2}}, {{X_DEFAULT_TARGET}}`
- Locale URL map: `{{PAGE_KEY}} → {{LOCALE_1_URL}} | {{LOCALE_2_URL}} | {{X_DEFAULT_URL}}`
- Translation owner and last review: `{{OWNER}} | {{YYYY-MM-DD}}`

## Per-page checks

- [ ] URL is stable, crawlable, and linked without IP/cookie-only discovery.
- [ ] `<html lang="{{VALID_LANGUAGE_OR_LANGUAGE_REGION_CODE}}">` matches the visible language.
- [ ] Main content, title, description, Open Graph locale, and structured-data text are localized.
- [ ] Canonical is an absolute HTTPS URL for this locale and points to the same-language equivalent.
- [ ] The page lists itself and every real equivalent with absolute HTTPS URLs:

```html
<link rel="alternate" hreflang="{{LOCALE_1}}" href="{{ABSOLUTE_LOCALE_1_URL}}">
<link rel="alternate" hreflang="{{LOCALE_2}}" href="{{ABSOLUTE_LOCALE_2_URL}}">
<link rel="alternate" hreflang="x-default" href="{{ABSOLUTE_FALLBACK_URL}}">
```

- [ ] Every alternate returns a valid response and links back to this page with the same cluster.
- [ ] XML sitemap entries repeat the complete alternate set with `xmlns:xhtml="http://www.w3.org/1999/xhtml"`, if sitemap alternates are used.
- [ ] Codes use a valid language and optional region; country-only labels are omitted.
