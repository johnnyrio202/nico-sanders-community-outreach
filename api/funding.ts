import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';
import { slugify } from './_lib/site.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = getSql();
  const rows = (await sql`
    SELECT type, title, summary, audience, to_char(deadline, 'YYYY-MM-DD') AS deadline, note, url, source
    FROM funding
    WHERE deadline IS NULL OR deadline >= CURRENT_DATE
    ORDER BY deadline ASC NULLS LAST, sort_order ASC
  `) as Record<string, string>[];

  const out = rows.map((r) => ({ ...r, slug: slugify(r.title) }));
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(out);
}
