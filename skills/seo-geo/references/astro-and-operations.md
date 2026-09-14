# Astro adapter boundaries and SEO operations

## Static Astro guidance

Keep this skill framework-agnostic. When the target is Astro, inspect the installed version, `astro.config.*`, package manifest, layouts, routes, generated output, and deployment host before changing anything.

- Astro's current default `output: 'static'` prerenders the site. Do not add an adapter or change output mode for SEO; adapters are for verified on-demand/server rendering or deployment behavior.
- Use the document layout for global charset, viewport, icons, manifest, theme color, safe defaults, and shared organization/site identity. Pass page data into the layout for title, description, canonical, locale, Open Graph, X/Twitter cards, robots decisions, and page-specific JSON-LD.
- Use the configured canonical site origin for absolute URLs and inspect the built HTML, not just component props. Keep `robots.txt`, `sitemap.xml`, and `llms.txt` at stable root URLs using the existing static asset, page, integration, host, or CDN convention. Do not invent an integration or assume a package is installed.
- Prefer `astro:assets` for local images when it preserves useful dimensions and responsive output. Preserve intrinsic dimensions and verify that important metadata, links, and JSON-LD exist in the initial HTML rather than only after client JavaScript.
- If redirects, response headers, or per-request crawler policy are required, implement them in the hosting/CDN/server layer or prove the need for a server adapter using current Astro documentation. Keep static output when it satisfies the requirement.

Do not duplicate the separate `astro-static-landing` skill's broader component, island, or animation guidance. Load that skill when its trigger applies.

## Launch and post-launch verification

1. Run the repository's documented build and inspect the output for expected routes, head tags, JSON-LD, icons, `robots.txt`, `sitemap.xml`, and `llms.txt`; record commands and versions.
2. Against the deployed HTTPS origin, check representative `GET`/redirect chains, canonical host normalization, content type, status, robots access, sitemap validity, internal links, and locale reciprocity. Use a browser when rendered DOM differs from source.
3. Use Google's Rich Results Test and Schema.org Validator for applicable markup; use URL Inspection and Search Console's indexing/enhancement reports for representative URLs. Use PageSpeed Insights or Lighthouse for page experience, accessibility, and performance when the environment permits.
4. Verify the property in Bing Webmaster Tools, submit or confirm the sitemap, and inspect crawl/indexing diagnostics. Configure privacy-conscious analytics and conversion events with consent and data minimization appropriate to the business.
5. After launch, monitor Search Console coverage/indexing, manual actions, enhancements, query/page performance, 404s/redirects, sitemap processing, Core Web Vitals, Bing reports, analytics conversions, and business-profile accuracy. Recrawling and report propagation are asynchronous; record the request date and wait for observed evidence rather than promising a deadline.

If a tool, account, deployed origin, field data, or owner approval is unavailable, mark the result `blocked` or `unknown` and state exactly what remains to be run.
