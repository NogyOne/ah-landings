---
name: seo-geo
description: "Trigger: SEO audit, GEO audit, technical SEO, local SEO, structured data, hreflang, robots.txt, sitemap, metadata, AI search. Audit, apply, and verify evidence-based search quality without invented facts or ranking promises."
license: Apache-2.0
metadata:
  author: "ah-ecosystem"
  version: "1.0"
  scope: [root, halisco-landing]
  auto_invoke:
    - "Auditing or implementing comprehensive SEO or GEO quality"
    - "Adding search metadata, crawl controls, sitemaps, structured data, or locale signals"
    - "Preparing a site for launch or post-launch search monitoring"
---

## Activation Contract

Load for a search-quality audit, implementation, or verification pass covering technical SEO, entities, content, local visibility, internationalization, performance, or AI-search readiness.

## Hard Rules

- Read `references/workflow.md` first; load only the needed domain references and assets.
- Treat business facts, locations, locales, offers, ratings, authorship, and ownership as verified only with evidence or owner confirmation. Record unknowns; never infer them.
- Make standard SEO and people-first content the foundation. Do not promise rankings or add misleading, hidden, unsupported, or self-serving structured data.
- Workspace release policy requires `robots.txt`, XML sitemap, canonical URLs, complete Open Graph and Twitter/X cards, suitable structured data, applicable icons/manifest, and accurate `llms.txt`. These are project-quality requirements, not universal ranking requirements; `llms.txt` is not a Google signal or universal standard.
- Preserve framework boundaries, unrelated user changes, and privacy choices; keep the workflow framework-agnostic.

## Decision Gates

| Situation | Required action |
| --- | --- |
| Business model, facts, locations, locales, or canonical host are unknown | Audit and report a blocker; do not apply claims or publish templates |
| Audit, apply, or verify requested | Follow the matching bounded mode in `references/workflow.md` |
| Local, multi-location, ecommerce, editorial, or SaaS behavior exists | Select the corresponding business branch before choosing schema or pages |
| Astro is present | Read `references/astro-and-operations.md`; keep static output unless on-demand rendering is proven necessary |
| Search indexing and model-training crawler policy are conflated | Separate them and obtain business/legal approval before restrictive directives |

## Execution Steps

1. Build an evidence ledger; classify business model, URLs, locales, entities, conversions, and ownership constraints.
2. Audit crawlability, rendered head, content truth, structured data, media, accessibility, performance, and GEO readiness.
3. Apply only approved, evidence-backed changes; replace every template placeholder before shipping.
4. Verify source/build output, HTTP behavior, validators, and launch tools; distinguish unavailable checks from passes.
5. Return the checklist, findings, evidence, unknowns, changes, residual risks, and monitoring plan.

## Output Contract

Return mode, business branch, changed files, pass/fail/unknown checklist, severity findings, exact evidence, source URLs with access/version notes, validation results, unresolved approvals, and residual risks. Never guarantee indexing, rich results, AI citations, traffic, or rankings.

## References

- `references/workflow.md` - intake, modes, severity, evidence, and report contract.
- `references/content-entities-geo.md` - business branches, local/entity strategy, content quality, and crawler policy.
- `references/technical-quality.md` - indexability, head metadata, i18n, structured data, media, accessibility, and performance.
- `references/astro-and-operations.md` - static Astro boundaries, launch validation, and post-launch operations.
- `references/sources.md` - authoritative source register and access notes.
- `assets/` - safe placeholder-marked robots, llms, metadata, multi-location JSON-LD, i18n, and audit templates.
