# Head metadata matrix template

> **TEMPLATE ONLY:** Replace every `{{PLACEHOLDER}}`, verify values against the evidence ledger, and do not ship this warning or placeholders.

| Layer | Field | Expected value | Evidence/status |
| --- | --- | --- | --- |
| Global layout | `charset` | `utf-8` near the start of `<head>` | `{{VERIFIED_OR_UNKNOWN}}` |
| Global layout | `viewport` | `width=device-width, initial-scale=1` | `{{VERIFIED_OR_UNKNOWN}}` |
| Global layout | icon/manifest/theme | Real paths only when applicable | `{{VERIFIED_ASSET_PATHS_OR_NA}}` |
| Per page | `<title>` | Unique, accurate, human-readable | `{{PAGE_TITLE}}` |
| Per page | `description` | Unique, useful summary of visible content | `{{PAGE_DESCRIPTION}}` |
| Per page | `canonical` | Absolute normalized HTTPS URL | `{{CANONICAL_URL}}` |
| Per page | `robots` | Deliberate directive or omitted | `{{ROBOTS_DECISION}}` |
| Per page | `og:title` / `twitter:title` | Page title or an approved social variant | `{{SOCIAL_TITLE}}` |
| Per page | `og:description` / `twitter:description` | Accurate social summary | `{{SOCIAL_DESCRIPTION}}` |
| Per page | `og:type` / `og:url` | Applicable type and canonical URL | `{{OG_TYPE}}`, `{{CANONICAL_URL}}` |
| Per page | `og:image` | Absolute crawlable image URL | `{{ABSOLUTE_IMAGE_URL}}` |
| Per page | image dimensions/alt | Actual width, height, and truthful alt | `{{IMAGE_WIDTH}}` × `{{IMAGE_HEIGHT}}`, `{{IMAGE_ALT}}` |
| Per page | `og:locale` | Locale of this page, for example `{{LANGUAGE}}_{{REGION}}` | `{{LOCALE_STATUS}}` |
| Per page | `og:locale:alternate` | Other verified equivalents only | `{{ALTERNATE_LOCALES_OR_NONE}}` |
| Per page | X card | `{{TWITTER_CARD_TYPE}}` and matching image metadata | `{{X_CARD_STATUS}}` |

## Acceptance checks

- [ ] Exactly one intended title and canonical are rendered in the initial HTML.
- [ ] All absolute URLs use `{{CANONICAL_ORIGIN}}` and the chosen normalization.
- [ ] Social image is real, relevant, accessible, dimensioned, and not a placeholder.
- [ ] Every locale, handle, icon, and claim is verified or omitted.
