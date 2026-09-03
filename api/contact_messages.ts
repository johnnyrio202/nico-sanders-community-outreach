import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body ?? {};
  if (!name || typeof name !== 'string' || !email || typeof email !== 'string' || !message || typeof message !== 'string') {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  const sql = getSql();
  await sql`INSERT INTO contact_messages (name, email, message) VALUES (${name}, ${email}, ${message})`;

  return res.status(201).json({ success: true });
}
