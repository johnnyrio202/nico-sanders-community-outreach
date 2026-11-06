export const SITE = 'https://nicosanders.net';

export const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export const slugify = (s: string) =>
  s.toLowerCase().replace(/['’]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/, '');

export const eventSlug = (title: string, date: string) => `${slugify(title)}-${date}`;

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const parseDate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)); };
export const longDate = (s: string) => { const d = parseDate(s); return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`; };
export const shortMon = (s: string) => MONTHS[parseDate(s).getUTCMonth()].slice(0, 3);
export const dayNum = (s: string) => parseDate(s).getUTCDate();
export const monthLabel = (s: string) => `${MONTHS[parseDate(s).getUTCMonth()]} ${parseDate(s).getUTCFullYear()}`;
export const todayET = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());

export type PageOpts = {
  title: string;
  description: string;
  path: string;
  heading: string;
  lede?: string;
  crumbs?: [string, string][];
  body: string;
  image?: string;
  jsonld?: object;
  noindex?: boolean;
};

const NAV: [string, string][] = [['/events', 'Events'], ['/funding', 'Funding & jobs'], ['/resources', 'Resources'], ['/#about', 'About']];

export function page(o: PageOpts) {
  const url = SITE + o.path;
  const img = o.image || `${SITE}/og-image.jpg`;
  const crumbs = o.crumbs?.length
    ? `<div class="crumbs"><a href="/">Home</a>${o.crumbs.map(([h, t]) => ` <span>/</span> <a href="${esc(h)}">${esc(t)}</a>`).join('')}</div>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
<link rel="canonical" href="${esc(url)}">
${o.noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="Nico Sanders Community Outreach">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css">
${o.jsonld ? `<script type="application/ld+json">${JSON.stringify(o.jsonld).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body>
<div class="top">
  <div class="bar2">
    <a class="brand" href="/"><span class="mark d">NS</span><span><b class="d">Nico Sanders</b><small>Community Outreach</small></span></a>
    <nav aria-label="Primary">${NAV.map(([h, t]) => `<a class="nl" href="${h}">${esc(t)}</a>`).join('')}
      <button class="menubtn" id="menuBtn" aria-label="Open menu" aria-expanded="false" aria-controls="mnav"><i></i></button>
      <a class="cta-block" href="/#join">Stay connected</a></nav>
  </div>
  <div class="mnav" id="mnav" hidden>${NAV.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join('')}<a href="/#join" class="mcta">Stay connected</a></div>
  <section class="phead"><div class="wrap">${crumbs}<h1 class="d">${esc(o.heading)}</h1>${o.lede ? `<p>${esc(o.lede)}</p>` : ''}</div></section>
</div>
<main class="pg"><div class="wrap">${o.body}</div></main>
<footer><div class="wrap"><span>© Nico Sanders Community Outreach · District 11A</span><span class="fl"><a href="/events">Events</a><a href="/funding">Funding &amp; jobs</a><a href="/resources">Resources</a><a href="mailto:info@nicosanders.net">info@nicosanders.net</a></span></div></footer>
<script src="/assets/menu.js" defer></script>
</body>
</html>`;
}
