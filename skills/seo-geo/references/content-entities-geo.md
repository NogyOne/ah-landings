# Content, entities, local SEO, and GEO

## Business facts and entity consistency

Use one approved fact set across visible copy, navigation, footer, contact pages, profiles, feeds, metadata, structured data, `sameAs`, and `llms.txt`. Keep the public name, address, phone, hours, service area, ownership, and URL consistent with the business source of truth. Preserve meaningful local formatting where customers use it, but do not create contradictory variants.

### Local storefronts and service-area businesses

- Claim and verify the correct Google Business Profile; choose the real category, hours, services, phone, website, and photos. Use Bing Webmaster Tools and relevant local profiles where they serve the audience. Treat directory citations as trust and discovery work, not a quantity contest.
- Show a real storefront's NAP and useful directions/accessibility information on its location page. A service-area business must describe only verified service areas and must not expose or invent a customer-facing address.
- Ask for genuine, voluntary reviews and respond helpfully. Never fabricate reviews, gate sentiment, buy reviews, imply guaranteed outcomes, or add aggregate ratings merely because testimonials appear on the site. Self-serving ratings for the business are not a safe rich-result shortcut; use rating markup only when the applicable search and Schema.org policies permit genuine, visible, third-party data.

### Multiple locations

Model the brand as one verified `Organization` and each real branch as its own `LocalBusiness` node, page, and Google Business Profile. Give each node a stable URL-based `@id`, its real address/phone/hours/services, and a relationship to the brand. A location page earns its existence through unique useful information: staff, inventory, services, hours, directions, accessibility, photos, or local proof. Do not publish doorway pages that swap only a city name into duplicated copy, create pages for locations that do not exist, or assign one GBP/entity to several branches. Use `assets/local-business-multi-location.jsonld.template` only as a pattern and remove every unverified field.

## People-first content and GEO

Write for the visitor first: answer the task directly, explain who the business is, what it offers, where/when it operates, how to contact or buy, and what evidence supports the claim. Make important facts explicit in readable headings, paragraphs, tables, lists, and captions so people, search systems, and answer systems can quote them accurately. Add first-party experience, process details, qualifications, ownership, authorship, revision dates, and source attribution when relevant and verifiable. Keep policies, pricing, availability, service coverage, and dates current.

FAQs are useful when they resolve real customer questions; do not create question variants for every keyword or add FAQ structured data without useful visible answers. Avoid keyword stuffing, vague AI-generated filler, unreviewed medical/legal/financial claims, scaled near-duplicates, and pages written only for query permutations. There is no required word count, “AI paragraph,” chunk size, or special GEO syntax.

## AI crawler and training policy

Treat standard SEO—crawlable, indexable, useful, attributable content—as the primary path to search and grounded AI visibility. Google states that no special AI markup or `llms.txt` is required for its AI search features; the workspace nevertheless requires an accurate root `llms.txt` as an explicit quality policy. That file is a curated, human/agent-readable index of verified facts and useful links, not a ranking signal, guarantee, or substitute for HTML, sitemap, or structured data.

Keep three decisions separate:

1. **Search inclusion:** public crawlability, indexability, snippets, and search-engine directives.
2. **On-demand grounding/inference:** whether an agent can read public, useful content; this is not the same as training.
3. **Model-training permission:** business/legal policy for named training crawlers or providers.

Do not blanket-block AI bots, add speculative `noai`/`noimageai` directives, or disallow all crawling without an explicit business/legal decision. If a policy is approved, identify the crawler scope, reason, effective date, owner, and impact on search discovery; place it in the appropriate crawler-control layer and verify it does not block required search resources.
