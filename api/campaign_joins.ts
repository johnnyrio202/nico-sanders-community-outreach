import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body ?? {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'email is required' });
  }

  const sql = getSql();
  await sql`INSERT INTO campaign_joins (email) VALUES (${email})`;

  return res.status(201).json({ success: true });
}
