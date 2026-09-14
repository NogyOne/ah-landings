# Technical SEO and page quality

## Crawlability, indexability, and URL control

Inspect the deployed site and representative generated pages, not only source files. Important indexable HTML should return `200`, contain the intended content in the rendered response, be internally linked with crawlable `<a href>` links, and not be blocked by an accidental `noindex`. Intended redirects should be direct, stable, and free of chains or loops. Diagnose `4xx`, `5xx`, redirect chains, orphan URLs, and soft 404s; a missing page should return a real `404` or `410` with a useful error experience, not a `200` homepage.

Use one HTTPS host and a deliberate trailing-slash/case/path convention. Redirect HTTP, alternate hostnames, and deprecated paths to the preferred URL. Do not use `robots.txt` to choose canonicals or hide sensitive content. Use `robots` meta or `X-Robots-Tag` for deliberate indexing/snippet/media controls and password protection for private content. Check that headers are compatible with the desired crawl and index behavior.

Publish `/robots.txt` at the origin root with conservative rules and an absolute `Sitemap` URL. Publish an XML sitemap (or index) containing only preferred, canonical, reachable URLs that should be indexed; use absolute URLs, valid XML, `200` responses, and locale alternates when applicable. A sitemap helps discovery but guarantees neither crawling nor indexing. See `assets/robots.txt.template`.

Use an absolute, self-referential canonical on every indexable page unless a verified duplicate strategy requires another canonical. Align redirects, internal links, sitemap URLs, hreflang targets, Open Graph `og:url`, and structured-data URLs to the same normalized origin. Never canonicalize by fragment, use conflicting canonicals, canonicalize a page to an unrelated language, or use `noindex` as a canonical-selection shortcut.

## Document and social head

Separate **global layout concerns** from **per-page data**. The shell owns valid charset, viewport, default site identity, icons, manifest, theme color, and safe defaults. Each page owns a unique title, description, canonical, locale, robots decision, social copy/image, and page-specific structured data. Never let a global default silently erase a page's identity.

For indexable pages, verify a valid `<head>` with early `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, one meaningful title, and a useful unique description. Add an absolute canonical and deliberate robots directives. Where valuable, provide `favicon`, `icon`, `apple-touch-icon`, `manifest`, and `theme-color` with real paths.

Provide complete Open Graph basics: `og:title`, `og:description`, `og:type`, `og:url`, `og:site_name`, `og:image`, `og:image:secure_url` when useful, `og:image:type`, `og:image:width`, `og:image:height`, and `og:image:alt`; use an absolute crawlable image and a locale such as `en_US` plus verified `og:locale:alternate` values. Add the corresponding X/Twitter card fields (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`, and verified site/creator handles only when applicable). Social cards do not replace search metadata and their previews are consumer-dependent. See `assets/head-metadata-matrix.md`.

## Internationalization

Choose a stable directory, subdomain, or domain strategy based on operational ownership. Give each locale a real URL, accurate `lang`, localized title/description/body/structured-data text, a self-canonical in that locale, and a complete bidirectional `hreflang` cluster. Each page lists itself and every equivalent locale with fully qualified HTTPS URLs plus an `x-default` fallback when a selector/fallback exists. Use valid language and optional region codes; do not use country-only values.

Keep the same annotation set on every alternate page. If implemented in XML, use the XHTML namespace and repeat each alternate on every `<url>` entry; validate sitemap output. Do not rely on IP or cookie-only automatic redirects to expose locales: provide crawlable links and a stable fallback. Do not label untranslated or materially non-equivalent pages as alternates. See `assets/i18n-hreflang-checklist.md`.

## Structured data and entity graph

Select the most specific valid Schema.org type supported by the visible page purpose. Prefer JSON-LD, use stable URL-based `@id` values, connect `Organization`, real location, `WebSite`, `WebPage`, `BreadcrumbList`, `Product`, `Service`, `Article`, `Person`, `VideoObject`, or `SoftwareApplication` only where each item is visible and true. Keep one coherent graph rather than disconnected guessed entities. Translate locale-specific values and URLs.

Never mark up hidden, stale, irrelevant, unsupported, or misleading content; fake reviews, self-serving ratings, invented prices/availability, and unsupported claims are release blockers. FAQ markup is not a ranking shortcut. Validate syntax with Schema.org Validator and eligibility with Google's Rich Results Test where relevant, then inspect the rendered page and Search Console; valid markup still does not guarantee a rich result or ranking.

## Images, video, accessibility, and performance

Use descriptive filenames, nearby text/captions, truthful alt text, intrinsic `width`/`height`, responsive formats/sizes, and crawlable URLs. Use empty alt for decorative images; describe informative images concisely; describe the destination/action for linked images. Lazy-load below-the-fold media; prioritize only the actual LCP image with appropriate eager/preload behavior. For video, provide a meaningful poster, captions/transcript where needed, visible context, and VideoObject data only when the page visibly describes that video.

Keep important content and links in server-rendered or otherwise crawlable HTML; do not require clicks, hover, or fragile client JavaScript to reveal core facts. Use semantic landmarks/headings, keyboard focus, readable contrast, mobile-first responsive layout, and accessible forms. Measure field and lab performance: target good Core Web Vitals (LCP within 2.5s, INP under 200ms, CLS under 0.1 at the recommended percentile) while remembering that page experience is broader than a score and no score guarantees ranking. Avoid layout shifts, render-blocking waste, oversized media, and unnecessary client JavaScript.
