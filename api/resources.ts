import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sql = getSql();
  const rows = await sql`
    SELECT id, category, title, description, url, phone, sort_order, created_at
    FROM resources
    ORDER BY sort_order ASC
  `;

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(rows);
}
