# SEO/GEO source register

These sources were checked on 2026-09-13. Re-check volatile documentation before a high-stakes implementation; the source page remains authoritative over this local summary. The register intentionally favors first-party documentation and separates protocol facts from workspace policy.

## Google Search Central

- [Search documentation](https://developers.google.com/search/docs) — current index of SEO, crawling, appearance, international, ecommerce, and monitoring guidance; accessed 2026-09-13.
- [Search Essentials](https://developers.google.com/search/docs/essentials) — technical requirements and spam policies; accessed 2026-09-13.
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — content quality and first-hand experience; accessed 2026-09-13.
- [Optimizing for generative AI features](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — states SEO remains foundational, no special AI markup or llms.txt is required for Google AI features, and visibility is not guaranteed; page showed last updated 2026-07-10.
- [Robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro) — crawl control is not an indexing-removal mechanism; page showed last updated 2025-12-10.
- [Sitemaps overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) — discovery, limitations, and locale/media extensions; page showed last updated 2025-12-10.
- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls) — redirects, canonical links, sitemap signals, absolute URLs, and conflict avoidance; page showed last updated 2026-07-10.
- [Redirects](https://developers.google.com/search/docs/crawling-indexing/301-redirects), [crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), and [robots meta/X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) — implementation and rendering checks; accessed 2026-09-13.
- [Localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) — reciprocal hreflang, absolute URLs, `x-default`, valid language/region codes, and sitemap annotations; page showed last updated 2025-12-22.
- [Business details](https://developers.google.com/search/docs/appearance/establish-business-details) and [ecommerce](https://developers.google.com/search/docs/specialty/ecommerce) — business profiles, merchant data, product structure, and site-specific guidance; accessed 2026-09-13.
- [Structured data introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), [general guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization), [Product](https://developers.google.com/search/docs/appearance/structured-data/product), [Article](https://developers.google.com/search/docs/appearance/structured-data/article), and [Review snippet](https://developers.google.com/search/docs/appearance/structured-data/review-snippet) — JSON-LD preference, visible/relevant content, policy limits, entity types, and validation; structured-data guidelines showed last updated 2026-07-10.
- [Images](https://developers.google.com/search/docs/appearance/google-images), [videos](https://developers.google.com/search/docs/appearance/video), [favicons](https://developers.google.com/search/docs/appearance/favicon-in-search), [page experience](https://developers.google.com/search/docs/appearance/page-experience), and [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals) — media, mobile, security, experience, and metric guidance; accessed 2026-09-13.
- [Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start), [URL Inspection](https://support.google.com/webmasters/answer/9012289), [Rich Results Test](https://search.google.com/test/rich-results), and [PageSpeed Insights](https://pagespeed.web.dev) — launch and diagnostic tools; accessed 2026-09-13.

## Schema.org and protocols

- [Schema.org documentation](https://schema.org/docs/gs.html) — shared vocabulary, JSON-LD/Microdata/RDFa, visible meaning, and testing; the page displayed Schema.org V30.0 dated 2026-03-19.
- [Schema.org validator](https://validator.schema.org) — vocabulary/syntax validation; accessed 2026-09-13.
- [Open Graph protocol](https://ogp.me/) — required `og:title`, `og:type`, `og:image`, `og:url`, locale, and image dimensions/alt; accessed 2026-09-13.
- [X card markup](https://developer.x.com/en/docs/x-for-websites/cards/overview/markup), [X documentation overview](https://docs.x.com/overview), and [X developer documentation index](https://docs.x.com/llms.txt) — current official entry points for X/Twitter card metadata; the legacy URL may render through the current X documentation shell, accessed 2026-09-13.

## Microsoft/Bing and business profiles

- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a), [Bing Webmaster Tools](https://www.bing.com/webmasters/about), and [Microsoft Learn Bing Webmaster API](https://learn.microsoft.com/en-us/bingwebmaster/) — official Bing guidance, tooling, sitemap/URL submission and diagnostics entry points; the API page showed `updated_at` 2026-08-07. The Bing portal pages were JavaScript application shells on 2026-09-13, so verify account-specific behavior in the tool.
- [Google Business Profile](https://www.google.com/business/) — official profile creation and management entry point for Search and Maps; accessed 2026-09-13.

## llms.txt and Astro

- [llms.txt proposal, v2](https://llmstxt.org/) — optional, evolving Markdown proposal for agent-readable site context; page showed modified 2026-08-10. It is not a universal web standard or Google ranking requirement.
- [Astro integrations and adapters](https://docs.astro.build/en/guides/integrations-guide/), [on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/), [configuration reference](https://docs.astro.build/en/reference/configuration-reference/), and [sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — official current framework references. Context7 resolved Astro to `/withastro/docs`; its current adapter guidance confirms static output needs no adapter while on-demand/server routes do.
- [Web.dev Core Web Vitals](https://web.dev/articles/vitals) and [W3C WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) — measurement and accessibility references; accessed 2026-09-13.
