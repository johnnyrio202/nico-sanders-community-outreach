import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';
import { SITE, esc, slugify, eventSlug, longDate, shortMon, dayNum, monthLabel, todayET, page } from './_lib/site.js';

type Ev = { title: string; event_date: string; event_time: string | null; location: string | null; source: string | null; url: string; image_url: string | null; description: string | null; category: string | null; slug: string };
type Fu = { type: string; title: string; summary: string; audience: string; deadline: string | null; note: string | null; url: string; source: string | null; slug: string };
type Rs = { category: string; title: string; description: string; url: string | null; phone: string | null };

const CAT_BLURB: Record<string, string> = {
  'Housing & Cost of Living': 'Heating and electric bill help, emergency utility assistance and food support.',
  'Mental Health & Safety': '988 Lifeline, 24-hour crisis support and county crisis response. Free and confidential.',
  'Schools & Opportunity': 'Enrollment, job training and apprenticeships.',
  'Small Business & Economy': 'Loans, counseling and local networking.',
  'Grants & Scholarships': 'State and federal funding for people and projects.',
  'Community Organizations': 'Associations, libraries and councils near you.',
  'Environment & Infrastructure': 'Alerts, 311 and road projects.',
  'Good Government': 'Councils, hearings and who represents you.',
  'Local Events': 'Places that post community events and calendars.',
};

async function loadEvents(): Promise<Ev[]> {
  const rows = (await getSql()`
    SELECT title, to_char(event_date,'YYYY-MM-DD') AS event_date, event_time, location, source, url, image_url, description, category
    FROM community_events ORDER BY event_date ASC, sort_order ASC`) as Omit<Ev, 'slug'>[];
  return rows.map((r) => ({ ...r, slug: eventSlug(r.title, r.event_date) }));
}
async function loadFunding(): Promise<Fu[]> {
  const rows = (await getSql()`
    SELECT type, title, summary, audience, to_char(deadline,'YYYY-MM-DD') AS deadline, note, url, source
    FROM funding ORDER BY deadline ASC NULLS LAST, sort_order ASC`) as Omit<Fu, 'slug'>[];
  return rows.map((r) => ({ ...r, slug: slugify(r.title) }));
}
async function loadResources(): Promise<Rs[]> {
  return (await getSql()`SELECT category, title, description, url, phone FROM resources ORDER BY sort_order ASC, title ASC`) as Rs[];
}

const html = (res: VercelResponse, body: string, status = 200) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(status).send(body);
};
const notFound = (res: VercelResponse, what: string) =>
  html(res, page({ title: 'Not found | Nico Sanders Community Outreach', description: 'Page not found.', path: '/', noindex: true, heading: 'We could not find that page', lede: what,
    body: '<p><a class="btn p" href="/">Back to the home page</a></p>' }), 404);

const snip = (s: string | null, n = 170) => { const t = (s || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t; };
const catOf = (e: Ev) => e.category || 'Community';

function evCard(e: Ev, past = false) {
  const thumb = e.image_url
    ? `<div class="dt thumb"><img src="${esc(e.image_url)}" alt="" loading="lazy"></div>`
    : `<div class="dt"><b class="d">${dayNum(e.event_date)}</b><span>${shortMon(e.event_date)}</span></div>`;
  return `<a class="row-card${past ? ' past' : ''}" href="/events/${esc(e.slug)}">${thumb}<div><span class="when">${longDate(e.event_date)}${e.event_time ? ' · ' + esc(e.event_time) : ''}</span><h3 class="d">${esc(e.title)}</h3><p>${esc(e.location || '')}</p><p>${esc(snip(e.description))}</p></div></a>`;
}

function fuBadge(f: Fu, today: string) {
  if (f.deadline) {
    const n = Math.round((Date.parse(f.deadline) - Date.parse(today)) / 864e5);
    if (n < 0) return '<span class="badge roll">Closed</span>';
    return `<span class="badge ${n <= 14 ? 'urgent' : 'open'}">Closes ${esc(longDate(f.deadline))}</span>`;
  }
  return `<span class="badge roll">${esc(f.note || 'Ongoing')}</span>`;
}

async function eventsList(req: VercelRequest, res: VercelResponse) {
  const today = todayET();
  const all = await loadEvents();
  const cat = typeof req.query.category === 'string' ? req.query.category : '';
  const cats = [...new Set(all.map(catOf))];
  const up = all.filter((e) => e.event_date >= today && (!cat || slugify(catOf(e)) === cat));
  const past = all.filter((e) => e.event_date < today && (!cat || slugify(catOf(e)) === cat)).reverse().slice(0, 12);
  const chips = `<div class="chips"><a href="/events" ${!cat ? 'aria-current="true"' : ''}>All types</a>${cats.map((c) => `<a href="/events?category=${slugify(c)}" ${cat === slugify(c) ? 'aria-current="true"' : ''}>${esc(c)}</a>`).join('')}</div>`;
  let body = chips;
  if (up.length) {
    let last = '';
    body += '<div class="list">' + up.map((e) => { const m = monthLabel(e.event_date); const h = m !== last ? `<h2 class="d sec-h">${m}</h2>` : ''; last = m; return h + evCard(e); }).join('') + '</div>';
  } else body += '<p class="empty-pg">No upcoming events in this view yet. Check back soon.</p>';
  if (past.length) body += `<h2 class="d sec-h">Recently past</h2><div class="list">${past.map((e) => evCard(e, true)).join('')}</div>`;
  return html(res, page({
    title: 'Community Events in District 11A | Nico Sanders Community Outreach',
    description: 'Upcoming community events across District 11A, including Owings Mills, Randallstown, Pikesville, Reisterstown, Glyndon and Mays Chapel: fundraisers, food help, meetings, music and more, with links back to each source.',
    path: '/events', heading: 'Community events', lede: 'What is happening around District 11A. Every listing links back to the organizer for the latest details.',
    crumbs: [['/events', 'Events']], body,
  }));
}

async function eventDetail(slug: string, res: VercelResponse) {
  const e = (await loadEvents()).find((x) => x.slug === slug);
  if (!e) return notFound(res, 'That event is not on the calendar.');
  const past = e.event_date < todayET();
  const body = `<div class="cols"><div class="art">
    ${past ? '<p class="note" style="margin:0 0 18px">This event has already happened. Check the source for future dates.</p>' : ''}
    <div class="meta"><div><small>When</small><b>${esc(longDate(e.event_date))}${e.event_time ? ' · ' + esc(e.event_time) : ''}</b></div>
    <div><small>Where</small><b>${esc(e.location || 'See source')}</b></div><div><small>Type</small><b>${esc(catOf(e))}</b></div>
    ${e.source ? `<div><small>Organizer / source</small><b>${esc(e.source)}</b></div>` : ''}</div>
    <h2 class="d">About this event</h2><p>${esc(e.description || 'Details are posted by the organizer.')}</p>
    <div class="acts"><a class="btn p" href="${esc(e.url)}" target="_blank" rel="noopener">Read more at source ↗</a>${past ? '' : `<a class="btn o" href="/events/${esc(e.slug)}/calendar.ics">+ Add to calendar</a>`}</div>
    <p class="note">Summary only. Times, locations and details are set by the organizer; confirm on the source page before you go.</p>
    <p><a href="/events">← All events</a></p></div>
    ${e.image_url ? `<div class="flyer"><img src="${esc(e.image_url)}" alt="Flyer for ${esc(e.title)}"></div>` : ''}</div>`;
  return html(res, page({
    title: `${e.title} | Community Events | Nico Sanders Community Outreach`,
    description: snip(`${longDate(e.event_date)}${e.event_time ? ', ' + e.event_time : ''}. ${e.location || ''}. ${e.description || ''}`, 160),
    path: `/events/${e.slug}`, heading: e.title, lede: `${longDate(e.event_date)}${e.event_time ? ' · ' + e.event_time : ''}`,
    crumbs: [['/events', 'Events']], body, image: e.image_url || undefined,
    jsonld: { '@context': 'https://schema.org', '@type': 'Event', name: e.title, startDate: e.event_date, description: e.description || undefined,
      location: e.location ? { '@type': 'Place', name: e.location } : undefined, image: e.image_url || undefined, url: `${SITE}/events/${e.slug}`,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode' },
  }));
}

async function eventIcs(slug: string, res: VercelResponse) {
  const e = (await loadEvents()).find((x) => x.slug === slug);
  if (!e) return notFound(res, 'That event is not on the calendar.');
  const d = e.event_date.replace(/-/g, '');
  const t = (s: string) => s.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => '\\' + c).replace(/\n/g, '\\n');
  const next = new Date(Date.parse(e.event_date) + 864e5).toISOString().slice(0, 10).replace(/-/g, '');
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Nico Sanders Community Outreach//EN', 'BEGIN:VEVENT', `UID:${e.slug}@nicosanders.net`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`, `DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${next}`, `SUMMARY:${t(e.title)}`,
    `LOCATION:${t(e.location || '')}`, `DESCRIPTION:${t(`${e.event_time || ''} ${e.description || ''} More: ${e.url}`.trim())}`, `URL:${SITE}/events/${e.slug}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${e.slug}.ics"`);
  res.setHeader('Cache-Control', 's-maxage=300');
  return res.status(200).send(ics);
}

function fuCard(f: Fu, today: string) {
  return `<article class="fc"><span class="type">${esc(f.type === 'Jobs' ? 'Jobs & training' : f.type)}</span><h3 class="d"><a href="/funding/${esc(f.slug)}" style="text-decoration:none">${esc(f.title)}</a></h3><p>${esc(snip(f.summary, 190))}</p><span class="who">For: ${esc(f.audience)}</span><a class="src" href="${esc(f.url)}" target="_blank" rel="noopener">Learn more at source ↗</a>${fuBadge(f, today)}</article>`;
}

async function fundingList(req: VercelRequest, res: VercelResponse) {
  const today = todayET();
  const type = typeof req.query.type === 'string' ? req.query.type : '';
  const types: [string, string][] = [['', 'All'], ['grant', 'Grants'], ['scholarship', 'Scholarships'], ['jobs', 'Jobs & training']];
  const items = (await loadFunding()).filter((f) => (!f.deadline || f.deadline >= today) && (!type || f.type.toLowerCase() === type));
  const chips = `<div class="chips">${types.map(([k, l]) => `<a href="${k ? '/funding?type=' + k : '/funding'}" ${type === k ? 'aria-current="true"' : ''}>${l}</a>`).join('')}</div>`;
  const body = chips + (items.length ? `<div class="fgrid">${items.map((f) => fuCard(f, today)).join('')}</div>` : '<p class="empty-pg">Nothing open in this category right now.</p>')
    + '<p class="note art" style="margin-top:26px"><span class="note">Summaries only. Eligibility and deadlines are set by each funder; confirm on the source page.</span></p>';
  return html(res, page({
    title: 'Grants, Scholarships and Jobs | Nico Sanders Community Outreach',
    description: 'Open grants for nonprofits, scholarships for students and job training near Baltimore County, each with a link to the official source.',
    path: '/funding', heading: 'Grants, scholarships and work', lede: 'Opportunities for nonprofits, students and job seekers. Every listing links to the official source.',
    crumbs: [['/funding', 'Funding & jobs']], body,
  }));
}

async function fundingDetail(slug: string, res: VercelResponse) {
  const today = todayET();
  const f = (await loadFunding()).find((x) => x.slug === slug);
  if (!f) return notFound(res, 'That opportunity is not listed.');
  const body = `<div class="art" style="max-width:760px"><div class="meta"><div><small>Type</small><b>${esc(f.type === 'Jobs' ? 'Jobs & training' : f.type)}</b></div>
    <div><small>Who it is for</small><b>${esc(f.audience)}</b></div><div><small>Deadline</small><b>${f.deadline ? esc(longDate(f.deadline)) : esc(f.note || 'Ongoing')}</b></div>
    ${f.source ? `<div><small>Source</small><b>${esc(f.source)}</b></div>` : ''}</div>
    <h2 class="d">Summary</h2><p>${esc(f.summary)}</p>
    <div class="acts"><a class="btn p" href="${esc(f.url)}" target="_blank" rel="noopener">Go to the official page ↗</a></div>
    <p class="note">Summary only. Eligibility, amounts and deadlines are set by ${esc(f.source || 'the funder')}; confirm on their page before applying. ${f.deadline && f.deadline < today ? 'This deadline has passed.' : ''}</p>
    <p><a href="/funding">← All funding and jobs</a></p></div>`;
  return html(res, page({
    title: `${f.title} | Funding & Jobs | Nico Sanders Community Outreach`, description: snip(f.summary, 160),
    path: `/funding/${f.slug}`, heading: f.title, lede: `${f.type === 'Jobs' ? 'Jobs & training' : f.type} · for ${f.audience}`,
    crumbs: [['/funding', 'Funding & jobs']], body,
  }));
}

async function resourcesIndex(res: VercelResponse) {
  const rs = await loadResources();
  const cats = [...new Set(rs.map((r) => r.category))];
  const body = `<div class="rgrid">${cats.map((c) => { const n = rs.filter((r) => r.category === c).length; return `<a class="res" href="/resources/${slugify(c)}"><span class="ic">${esc(c[0])}</span><h3 class="d">${esc(c)}</h3><p>${esc(CAT_BLURB[c] || '')}</p><span class="n">${n} resource${n === 1 ? '' : 's'} →</span></a>`; }).join('')}</div>`;
  return html(res, page({
    title: 'Community Resources for District 11A | Nico Sanders Community Outreach',
    description: 'Housing help, mental health support, schools, small business, grants, local government and more, curated for Owings Mills, Randallstown, Pikesville, Reisterstown, Glyndon and Mays Chapel.',
    path: '/resources', heading: 'Help that is one tap away', lede: 'Curated links and contacts for District 11A, grouped by what you need.',
    crumbs: [['/resources', 'Resources']], body,
  }));
}

async function resourceCategory(slug: string, res: VercelResponse) {
  const rs = await loadResources();
  const cat = [...new Set(rs.map((r) => r.category))].find((c) => slugify(c) === slug);
  if (!cat) return notFound(res, 'That resource category does not exist.');
  const items = rs.filter((r) => r.category === cat);
  const body = `<div class="rl">${items.map((r) => `<div class="it"><h3 class="d">${esc(r.title)}</h3><p>${esc(r.description)}</p><div class="lk">${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">Visit website ↗</a>` : ''}${r.phone ? `<a href="tel:${esc(r.phone.replace(/[^\d+]/g, ''))}">${esc(r.phone)}</a>` : ''}</div></div>`).join('')}</div>
    <p style="margin-top:26px"><a href="/resources">← All resource categories</a></p>`;
  return html(res, page({
    title: `${cat} Resources | Nico Sanders Community Outreach`, description: snip(`${CAT_BLURB[cat] || ''} ${items.map((r) => r.title).join(', ')}.`, 160),
    path: `/resources/${slug}`, heading: cat, lede: CAT_BLURB[cat], crumbs: [['/resources', 'Resources']], body,
  }));
}

async function sitemap(res: VercelResponse) {
  const [ev, fu, rs] = await Promise.all([loadEvents(), loadFunding(), loadResources()]);
  const today = todayET();
  const u = (p: string, f: string, pr: string) => `  <url><loc>${SITE}${esc(p)}</loc><changefreq>${f}</changefreq><priority>${pr}</priority></url>`;
  const lines = [u('/', 'weekly', '1.0'), u('/events', 'daily', '0.9'), u('/funding', 'weekly', '0.9'), u('/resources', 'weekly', '0.8'),
    ...ev.filter((e) => e.event_date >= today).map((e) => u(`/events/${e.slug}`, 'weekly', '0.7')),
    ...fu.filter((f) => !f.deadline || f.deadline >= today).map((f) => u(`/funding/${f.slug}`, 'weekly', '0.6')),
    ...[...new Set(rs.map((r) => r.category))].map((c) => u(`/resources/${slugify(c)}`, 'monthly', '0.6')),
    u('/backend-info', 'monthly', '0.2')];
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join('\n')}\n</urlset>\n`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).send('Method not allowed');
  const r = String(req.query.r || '');
  const slug = String(req.query.slug || '');
  try {
    switch (r) {
      case 'events': return await eventsList(req, res);
      case 'event': return await eventDetail(slug, res);
      case 'ics': return await eventIcs(slug, res);
      case 'funding': return await fundingList(req, res);
      case 'funding-item': return await fundingDetail(slug, res);
      case 'resources': return await resourcesIndex(res);
      case 'resource-cat': return await resourceCategory(slug, res);
      case 'sitemap': return await sitemap(res);
      default: return notFound(res, 'Unknown page.');
    }
  } catch (err) {
    console.error('pages error', err);
    return res.status(500).send('Something went wrong. Please try again shortly.');
  }
}
