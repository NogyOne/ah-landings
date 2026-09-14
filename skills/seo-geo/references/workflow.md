# SEO/GEO quality workflow

Use this reference as the execution spine. The other references supply domain rules; they do not replace evidence collection or the mode gates below.

## 1. Discovery and business intake

Start with the repository, deployed origin, route inventory, current build/runtime, analytics and conversion goals, launch date, and the owner-approved source of truth. Ask for or verify:

- legal or public business name, brand relationship, ownership, primary purpose, and target audience;
- business model, products/services, pricing or availability claims, service areas, physical locations, hours, phone, address, and contact channels;
- canonical host, URL conventions, supported languages/regions, translations, redirects, and indexability intent;
- official profiles (Google Business Profile, Bing, social), first-party photos/video, authors, credentials, policies, and citations;
- consent/privacy requirements and the conversions that matter (calls, directions, bookings, leads, purchases, sign-ups).

Maintain an evidence ledger. Each material claim gets `claim`, `source/evidence`, `status`, `owner`, and `last-verified` fields. Use `verified`, `owner-confirmed`, `conflict`, or `unknown`; unknown is not permission to infer from a domain name, image, competitor, placeholder, or common industry pattern. Pause apply work when an unknown would change a canonical, entity, location, locale, offer, rating, or legal claim.

## 2. Select the business branch

| Branch | Optimize for | Do not assume |
| --- | --- | --- |
| Local storefront | Real customer-facing location, NAP, Google Business Profile, directions, hours, local services, reviews, and a useful location page | A service area or address that the business has not confirmed |
| Service-area business | Verified service area, contact/conversion paths, service coverage, and accurate profile settings | A public storefront address or a location page for every target city |
| Ecommerce | Crawlable category/product paths, current price/availability, Product/Offer data where eligible, merchant feeds, returns/shipping facts | Inventory, prices, guarantees, or reviews that are stale or unavailable |
| Editorial/content | Helpful original work, clear authorship/ownership, dates, sources, and Article/Video data when visible | Expertise, publication dates, or first-hand experience not evidenced |
| SaaS/product | Clear product purpose, features, documentation, support, organization ownership, and SoftwareApplication data only when it describes visible software | App-store presence, capabilities, or customer outcomes not evidenced |

Mixed businesses choose a branch per page and may combine compatible entities only when each is visible and true. Do not manufacture a page type merely to obtain a search feature.

## 3. Bounded modes

- **Audit:** read-only inspection. Inventory URLs and rendered HTML, record findings and missing inputs, and propose changes without writing them.
- **Apply:** implement only approved findings whose required facts are verified. Keep one reversible scope, preserve unrelated changes, and mark any intentionally deferred issue.
- **Verify:** re-run the relevant checks against source, build output, and deployed HTTP responses. A tool pass is evidence for that check, not proof of ranking, indexing, rich results, or AI citation.

Do not silently switch modes. If inputs are incomplete, complete the audit and return an apply blocker instead.

## 4. Severity rubric

| Severity | Use for | Typical response |
| --- | --- | --- |
| Blocker | Misleading claims, accidental site-wide noindex/disallow, wrong canonical host, unavailable required release basic, unsafe privacy/crawler policy, or missing owner approval | Stop apply/release until resolved |
| High | Important pages inaccessible, wrong status/redirects, broken locale cluster, duplicate location doorway pages, invalid core metadata, or misleading structured data | Fix before release or document an explicit exception |
| Medium | Material discoverability, content, media, accessibility, performance, or measurement weakness without immediate index risk | Fix in the current work unit when feasible |
| Low | Localized polish or maintainability issue with limited search impact | Record and schedule |
| Note | Verified observation, limitation, or recommendation without a defect | Preserve as context |

## 5. Evidence and report contract

Every finding must identify the exact URL/file/route, selector or response header when relevant, expected behavior, observed behavior, reproduction command/tool and timestamp, source rule, severity, owner, and proposed remediation. Use `pass`, `fail`, `unknown`, `not-applicable`, or `blocked`; never use a guessed pass.

Return an executive summary, business branch, evidence ledger gaps, severity table, changed files (apply), validation results (verify), deferred approvals, residual risks, and next monitoring step. Include source URLs and page access/version notes. Use `assets/audit-report-template.md` when a durable report is requested.
