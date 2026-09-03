import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, help_details } = req.body ?? {};
  if (!name || typeof name !== 'string' || !email || typeof email !== 'string') {
    return res.status(400).json({ error: 'name and email are required' });
  }

  const sql = getSql();
  await sql`
    INSERT INTO volunteer_signups (name, email, phone, help_details)
    VALUES (${name}, ${email}, ${phone ?? null}, ${help_details ?? null})
  `;

  return res.status(201).json({ success: true });
}
