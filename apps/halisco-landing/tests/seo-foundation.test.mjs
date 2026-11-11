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
        if tag == 'script': self.scripts.append(attrs)
        if tag in ('script', 'style'): self.hidden += 1

    def handle_endtag(self, tag):
        if tag == 'head': self.in_head = False
        if tag == 'title':
            self.titles.append(''.join(self.title_parts))
            self.in_title = False
        if tag in ('script', 'style'): self.hidden -= 1

    def handle_data(self, data):
        if self.in_title: self.title_parts.append(data)
        if not self.in_head and not self.hidden: self.text.append(data)

p = Page()
p.feed(sys.stdin.read())
print(json.dumps(dict(titles=p.titles, metas=p.metas, links=p.links, ids=p.ids,
    hrefs=p.hrefs, text=' '.join(' '.join(p.text).split()), scripts=p.scripts)))
`, html);

test("built homepage has approved metadata and exactly one clean absolute canonical", () => {
  assert.deepEqual(page.titles, ["Joyería Halisco en Guasave | Oro, plata y reparaciones"]);
  const descriptions = page.metas.filter((meta) => meta.name === "description");
  assert.deepEqual(descriptions.map((meta) => meta.content), [
    "Joyería Halisco en Guasave, Sinaloa: joyas de oro y plata, hechuras propias, reparaciones y servicios de relojería. Visítanos en Vicente Guerrero 575, Centro.",
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

test("schema, social cards, and meta keywords remain deliberately absent", () => {
  assert.ok(!page.scripts.some((script) => script.type === "application/ld+json"));
  assert.ok(!page.metas.some((meta) => /^(og:|twitter:)/i.test(meta.property ?? meta.name ?? "")));
  assert.ok(!page.metas.some((meta) => meta.name === "keywords"));
});
