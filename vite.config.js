import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import projects from './src/data/projects.js'
import { SITE_URL } from './src/data/content.js'

// Every route is a real HTML entry (prerendered by scripts/prerender.mjs), so crawlers see per-page titles and
// Open Graph tags without a client-side router.
const home = {
  path: '/',
  title: 'Deeptanshu Banik — AI workflows that hold up after the demo',
  description:
    'Agentic AI, automation and orchestration: deterministic where it can be, a model where it has to be, a person where it matters. Case studies with real architecture and honest evidence.',
}

const pages = [
  home,
  ...projects.map((p) => ({
    path: p.caseStudy,
    title: `${p.title} — case study · Deeptanshu Banik`,
    description: `${p.subtitle}. ${p.summary}`,
  })),
]

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headMeta() {
  return {
    name: 'head-meta',
    transformIndexHtml(html, ctx) {
      const route = ctx.path.replace(/index\.html$/, '')
      const page = pages.find((p) => p.path === route) ?? home
      const url = SITE_URL + page.path
      const image = `${SITE_URL}/og-image.png`
      // Restores a saved theme before first paint; with nothing saved, the CSS follows the OS preference.
      const tags = `
    <script>try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}</script>
    <title>${escape(page.title)}</title>
    <meta name="description" content="${escape(page.description)}" />
    <link rel="canonical" href="${url}" />
    <meta name="theme-color" content="#0f1317" />
    <link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />
    <link rel="preload" href="/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
    <meta property="og:type" content="${page === home ? 'website' : 'article'}" />
    <meta property="og:site_name" content="Deeptanshu Banik" />
    <meta property="og:title" content="${escape(page.title)}" />
    <meta property="og:description" content="${escape(page.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="I build AI workflows that hold up after the demo. A pipeline diagram where a local LLM only fills gaps." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(page.title)}" />
    <meta name="twitter:description" content="${escape(page.description)}" />
    <meta name="twitter:image" content="${image}" />`
      const fallback = `
    <noscript><style>[style*="opacity:0"]{opacity:1!important;transform:none!important}</style></noscript>`
      return html.replace('<!--head-meta-->', tags).replace('<!--noscript-->', fallback)
    },
  }
}

export default defineConfig({
  plugins: [react(), headMeta()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((p) => [
          p.path === '/' ? 'main' : p.path.replace(/^\/|\/$/g, '').replace('/', '-'),
          resolve(import.meta.dirname, `.${p.path}index.html`),
        ]),
      ),
    },
  },
})
