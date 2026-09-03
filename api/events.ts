import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = getSql();
  const rows = await sql`
    SELECT title, event_date, event_time, location, media_type, source, url, image_url
    FROM community_events
    WHERE event_date >= CURRENT_DATE
    ORDER BY event_date ASC
  `;

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(rows);
}
