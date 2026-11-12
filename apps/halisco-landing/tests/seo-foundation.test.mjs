import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import test from "node:test";

// Run after pnpm build. Python's standard library parses HTML and XML without dependencies.
const dist = new URL("../dist/", import.meta.url);
const html = readFileSync(new URL("index.html", dist), "utf8");
const robots = readFileSync(new URL("robots.txt", dist), "utf8");
const llms = readFileSync(new URL("llms.txt", dist), "utf8");
const origin = "https://joyeriahalisco.com/";

function python(script, input) {
  const result = spawnSync("python3", ["-c", script], { input, encoding: "utf8" });
  assert.equal(result.error, undefined, result.stderr || "python3 must be available");
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

const page = python(`
import json, sys
from html.parser import HTMLParser

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_head = False
        self.in_title = False
        self.hidden = 0
        self.titles, self.title_parts = [], []
        self.metas, self.links, self.ids, self.hrefs, self.text, self.scripts = [], [], [], [], [], []
        self.current_script = None
        self.coordinates = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'head': self.in_head = True
        if tag == 'title':
            self.in_title = True
            self.title_parts = []
        if self.in_head and tag == 'meta': self.metas.append(attrs)
        if self.in_head and tag == 'link': self.links.append(attrs)
        if 'id' in attrs: self.ids.append(attrs['id'])
        if tag == 'a': self.hrefs.append(attrs.get('href', ''))
        if tag == 'script':
            self.current_script = dict(attrs, content='')
            self.scripts.append(self.current_script)
        if 'data-latitude' in attrs:
            self.coordinates.append([float(attrs['data-latitude']), float(attrs['data-longitude'])])
        if tag in ('script', 'style'): self.hidden += 1

    def handle_endtag(self, tag):
        if tag == 'head': self.in_head = False
        if tag == 'title':
            self.titles.append(''.join(self.title_parts))
            self.in_title = False
        if tag in ('script', 'style'): self.hidden -= 1
        if tag == 'script': self.current_script = None

    def handle_data(self, data):
        if self.in_title: self.title_parts.append(data)
        if self.current_script is not None: self.current_script['content'] += data
        if not self.in_head and not self.hidden: self.text.append(data)

p = Page()
p.feed(sys.stdin.read())
print(json.dumps(dict(titles=p.titles, metas=p.metas, links=p.links, ids=p.ids,
    hrefs=p.hrefs, text=' '.join(' '.join(p.text).split()), scripts=p.scripts, coordinates=p.coordinates)))
`, html);

test("built homepage has approved metadata and exactly one clean absolute canonical", () => {
  assert.deepEqual(page.titles, ["Joyería Halisco en Guasave | Oro y reparaciones"]);
  const descriptions = page.metas.filter((meta) => meta.name === "description");
  assert.deepEqual(descriptions.map((meta) => meta.content), [
    "Venta de prendas de oro, hechuras propias, reparaciones y servicios de relojería en Joyería Halisco, Guasave, Sinaloa. Visítanos o cotiza por WhatsApp.",
  ]);
  const canonicals = page.links.filter((link) => link.rel === "canonical");
  assert.deepEqual(canonicals.map((link) => link.href), [origin]);
  const canonical = new URL(canonicals[0].href);
  assert.equal(canonical.protocol, "https:");
  assert.equal(canonical.search, "");
  assert.equal(canonical.hash, "");
  assert.ok(!page.metas.some((meta) => /noindex|nofollow/i.test(
    /^(robots|googlebot)$/i.test(meta.name ?? "") ? meta.content : "",
  )));
});

test("built robots permits crawling and points to the canonical sitemap without new policy", () => {
  const directives = robots.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  assert.deepEqual(directives, ["User-agent: *", "Allow: /", `Sitemap: ${origin}sitemap.xml`]);
});

test("built sitemap parses as XML and contains only the canonical homepage", () => {
  const sitemap = python(`
import json, sys
import xml.etree.ElementTree as ET
root = ET.fromstring(sys.stdin.read())
ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
assert root.tag == ns + 'urlset'
assert len(root) == 1 and root[0].tag == ns + 'url'
assert len(root[0]) == 1 and root[0][0].tag == ns + 'loc'
print(json.dumps([root[0][0].text]))
`, readFileSync(new URL("sitemap.xml", dist), "utf8"));
  assert.deepEqual(sitemap, [origin]);
});

test("built llms facts match visible business details and its section links resolve", () => {
  for (const fact of ["Joyería Halisco", "Vicente Guerrero 575, Centro, 81000 Guasave, Sin., México", "+52 687 190 8152", "10%"]) {
    assert.ok(llms.includes(fact), `llms missing ${fact}`);
    assert.ok(page.text.includes(fact), `visible page missing ${fact}`);
  }
  assert.match(llms, /lunes a sábado, de 10:00 a\.m\. a 7:00 p\.m\./);
  assert.match(page.text, /Lunes a sábado · 10:00 a\.m\.–7:00 p\.m\./);
  for (const service of ["oro y plata", "hechuras", "reparaciones", "Cambio de batería", "Cambio de cristal", "Revisión de maquinaria"]) {
    assert.ok(llms.toLowerCase().includes(service.toLowerCase()), `llms missing ${service}`);
    assert.ok(page.text.toLowerCase().includes(service.toLowerCase()), `visible page missing ${service}`);
  }
  const links = [...llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => new URL(match[1]));
  assert.equal(links.length, 6);
  for (const link of links) {
    assert.equal(link.origin + link.pathname, origin);
    assert.equal(link.search, "");
    assert.ok(page.ids.includes(link.hash.slice(1)), `missing section ${link.hash}`);
  }
  assert.ok(page.hrefs.includes("https://wa.me/526871908152"));
  assert.doesNotMatch(llms, /TODO|TBD|PLACEHOLDER|example\.com|\{\{|\[INSERT/i);
  assert.doesNotMatch(html + llms, /Halisco Joyería/);
});

test("built JewelryStore JSON-LD matches published identity, contact, hours, and map", () => {
  const scripts = page.scripts.filter((script) => script.type === "application/ld+json");
  assert.equal(scripts.length, 1);
  assert.ok(!scripts[0].src);
  assert.doesNotMatch(scripts[0].content, /</);
  const business = JSON.parse(scripts[0].content);
  assert.equal(business["@context"], "https://schema.org");
  assert.equal(business["@type"], "JewelryStore");
  assert.equal(business["@id"], `${origin}#store`);
  assert.equal(business.url, origin);
  assert.equal(business.name, "Joyería Halisco");
  assert.ok(page.text.includes(business.name));
  assert.deepEqual(business.address, {
    "@type": "PostalAddress", streetAddress: "Vicente Guerrero 575, Centro",
    addressLocality: "Guasave", addressRegion: "Sinaloa", postalCode: "81000", addressCountry: "MX",
  });
  for (const value of [business.address.streetAddress, business.address.addressLocality, business.address.postalCode, "Sin., México"]) {
    assert.ok(page.text.includes(value));
  }
  assert.deepEqual(business.openingHoursSpecification, {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00", closes: "19:00",
  });
  assert.match(page.text, /Lunes a sábado · 10:00 a\.m\.–7:00 p\.m\./);
  assert.deepEqual(business.geo, {
    "@type": "GeoCoordinates", latitude: 25.5611903, longitude: -108.4632454,
  });
  assert.deepEqual(page.coordinates, [[business.geo.latitude, business.geo.longitude]]);
  assert.deepEqual(business.contactPoint, {
    "@type": "ContactPoint", contactType: "WhatsApp",
    telephone: "+526871908152", url: "https://wa.me/526871908152",
  });
  assert.ok(page.hrefs.includes(business.contactPoint.url));
  assert.ok(page.text.includes("WhatsApp: +52 687 190 8152"));
  assert.deepEqual(Object.keys(business).sort(), [
    "@context", "@type", "@id", "name", "url", "address", "openingHoursSpecification", "geo", "contactPoint",
  ].sort());
});

test("manifest and real icons are linked, copied, and consistent with the dark site theme", () => {
  const manifestLinks = page.links.filter((link) => link.rel === "manifest");
  assert.deepEqual(manifestLinks.map((link) => link.href), ["/site.webmanifest"]);
  const manifest = JSON.parse(readFileSync(new URL("site.webmanifest", dist), "utf8"));
  assert.equal(manifest.name, "Joyería Halisco");
  assert.equal(manifest.short_name, "Halisco");
  assert.equal(manifest.theme_color, "#0B0B0A");
  assert.equal(manifest.background_color, manifest.theme_color);
  assert.equal(manifest.display, "browser");
  assert.deepEqual(page.metas.filter((meta) => meta.name === "theme-color").map((meta) => meta.content), [manifest.theme_color]);
  assert.deepEqual(manifest.icons.map((icon) => icon.sizes), ["192x192", "512x512"]);
  const apple = page.links.filter((link) => link.rel === "apple-touch-icon");
  assert.deepEqual(apple.map((link) => link.href), ["/apple-touch-icon.png"]);
  for (const icon of [...manifest.icons, { src: apple[0].href, sizes: apple[0].sizes, type: "image/png" }]) {
    const bytes = readFileSync(new URL(icon.src.slice(1), dist));
    assert.equal(icon.type, "image/png");
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`, icon.sizes);
    assert.deepEqual(bytes, readFileSync(new URL(`../public${icon.src}`, import.meta.url)));
  }
  for (const link of page.links.filter((link) => link.rel === "icon")) {
    assert.ok(readFileSync(new URL(link.href.slice(1), dist)).length > 0);
  }
});

test("social cards share page metadata and reference the real original PNG", () => {
  const content = (attribute, key) => {
    const tags = page.metas.filter((meta) => meta[attribute] === key);
    assert.equal(tags.length, 1, `expected one ${key}`);
    return tags[0].content;
  };
  const og = (key) => content("property", `og:${key}`);
  const twitter = (key) => content("name", `twitter:${key}`);
  assert.equal(og("title"), page.titles[0]);
  assert.equal(twitter("title"), page.titles[0]);
  assert.equal(og("description"), content("name", "description"));
  assert.equal(twitter("description"), og("description"));
  assert.equal(og("type"), "website");
  assert.equal(og("url"), page.links.find((link) => link.rel === "canonical").href);
  assert.equal(og("site_name"), "Joyería Halisco");
  assert.equal(og("locale"), "es_MX");
  assert.equal(twitter("card"), "summary_large_image");
  const image = new URL(og("image"));
  assert.equal(image.href, `${origin}og-card.png`);
  assert.equal(image.protocol, "https:");
  assert.equal(image.search, "");
  assert.equal(image.hash, "");
  assert.equal(og("image:secure_url"), image.href);
  assert.equal(twitter("image"), image.href);
  assert.equal(og("image:type"), "image/png");
  assert.equal(og("image:alt"), "Logotipo de Joyería Halisco junto a una persona con un anillo en la mano.");
  assert.equal(twitter("image:alt"), og("image:alt"));
  const bytes = readFileSync(new URL(image.pathname.slice(1), dist));
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(bytes.subarray(12, 16).toString("ascii"), "IHDR");
  assert.equal(bytes.readUInt32BE(16), Number(og("image:width")));
  assert.equal(bytes.readUInt32BE(20), Number(og("image:height")));
  assert.equal(`${og("image:width")}x${og("image:height")}`, "1672x941");
  assert.ok(bytes.length > 0 && bytes.length < 5_000_000);
  assert.deepEqual(bytes, readFileSync(new URL("../public/og-card.png", import.meta.url)));
  assert.ok(!page.metas.some((meta) => /^(twitter:site|twitter:creator)$/.test(meta.name ?? "")));
  assert.ok(!page.metas.some((meta) => meta.name === "keywords"));
});
