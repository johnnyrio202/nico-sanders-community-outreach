import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';
import { gate } from './_lib/guard.js';
import { isObj, text, emailAddr } from './_lib/validate.js';
import { notify, alertAdmin } from './_lib/notify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await gate(req, res, 'join'))) return;

  const b = isObj(req.body) ? req.body : {};
  if (b.website) return res.status(201).json({ success: true }); // honeypot: pretend success

  const email = emailAddr(b.email);
  const name = text(b.name, 100);
  if (!email || name === null) return res.status(400).json({ error: 'Please enter a valid email address.' });

  try {
    await getSql()`INSERT INTO campaign_joins (email) VALUES (${email})`;
  } catch (err) {
    console.error('campaign_joins insert failed:', err);
    await alertAdmin('campaign_joins form submission', err, name || undefined, email);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }

  await notify('join', name || 'Community Update Signup', email, `New community update signup: ${email}`);
  return res.status(201).json({ success: true });
}
