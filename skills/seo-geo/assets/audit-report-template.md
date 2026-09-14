# SEO/GEO audit report template

> **TEMPLATE ONLY:** Replace every `{{PLACEHOLDER}}` with observed evidence. Do not ship this template as a completed audit, and do not convert `unknown` into `pass`.

## Scope

- Mode: `{{AUDIT_APPLY_OR_VERIFY}}`
- Origin/build revision: `{{ORIGIN_AND_REVISION}}`
- Business branch: `{{LOCAL_STOREFRONT_SERVICE_AREA_ECOMMERCE_EDITORIAL_SAAS_MIXED}}`
- Audited routes/locales: `{{ROUTES_AND_LOCALES}}`
- Evidence window: `{{TIMESTAMP_AND_TOOL_VERSIONS}}`

## Executive summary

`{{ONE_PARAGRAPH_SUMMARY_WITHOUT_RANKING_PROMISES}}`

## Findings

| ID | Severity | URL/file/evidence | Expected | Observed | Source | Owner/status |
| --- | --- | --- | --- | --- | --- | --- |
| `{{SEO-001}}` | `{{Blocker/High/Medium/Low/Note}}` | `{{EXACT_SELECTOR_COMMAND_OR_SCREENSHOT}}` | `{{EXPECTED}}` | `{{OBSERVED}}` | `{{LOCAL_REFERENCE_OR_SOURCE_URL}}` | `{{OWNER}} / {{pass/fail/unknown/blocked}}` |

## Release basics checklist

- [ ] `/robots.txt` is present, conservative, accurate, and names the absolute sitemap.
- [ ] XML sitemap is valid and contains only intended canonical URLs.
- [ ] Every indexable page has an absolute canonical.
- [ ] Open Graph and Twitter/X card metadata is complete and truthful.
- [ ] Suitable structured data describes visible content and passes relevant validation.
- [ ] Applicable favicon/icon/apple-touch-icon/manifest/theme-color assets resolve.
- [ ] Root `llms.txt` is accurate, curated, linked, and free of placeholders.

## Validation evidence

- Build: `{{COMMAND_AND_RESULT}}`
- HTTP/crawl: `{{COMMAND_AND_RESULT}}`
- Schema/Rich Results: `{{COMMAND_AND_RESULT}}`
- Search Console/Bing: `{{ACCOUNT_OR_UNAVAILABLE_REASON}}`
- Lighthouse/PageSpeed/field data: `{{COMMAND_OR_UNAVAILABLE_REASON}}`

## Unknowns, approvals, residual risks

- Unknown inputs: `{{LIST_WITH_OWNER}}`
- Required approval: `{{BUSINESS_LEGAL_PRIVACY_APPROVAL}}`
- Deferred work: `{{ITEM_AND_REASON}}`
- Residual risk: `{{LIMITATION_AND_NEXT_OBSERVATION}}`
