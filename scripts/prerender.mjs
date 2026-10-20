// Injects server-rendered markup into each built HTML page, so content
// paints before JavaScript loads and is readable without it.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const ssrDir = path.join(root, "dist-ssr");
const { render } = await import(pathToFileURL(path.join(ssrDir, "entry-server.js")).href);

const pages = [["index.html", null]];
for (const slug of fs.readdirSync(path.join(root, "dist/work"))) pages.push([`work/${slug}/index.html`, slug]);

for (const [file, slug] of pages) {
    const target = path.join(root, "dist", file);
    const html = fs.readFileSync(target, "utf8");
    const marker = '<div id="root"></div>';
    if (!html.includes(marker)) throw new Error(`No root marker in ${file}`);
    fs.writeFileSync(target, html.replace(marker, `<div id="root">${render(slug)}</div>`));
    console.log(`prerendered ${file}`);
}

fs.rmSync(ssrDir, { recursive: true, force: true });
