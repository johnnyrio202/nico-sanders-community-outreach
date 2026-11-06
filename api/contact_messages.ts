import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';
import { gate } from './_lib/guard.js';
import { isObj, text, emailAddr } from './_lib/validate.js';
import { notify, alertAdmin } from './_lib/notify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await gate(req, res, 'contact'))) return;

  const b = isObj(req.body) ? req.body : {};
  if (b.website) return res.status(201).json({ success: true }); // honeypot: pretend success

  const name = text(b.name, 100, { required: true });
  const email = emailAddr(b.email);
  const message = text(b.message, 5000, { multiline: true, required: true });
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please check your name, email and message.' });
  }
  const kind = b.kind === 'resource' ? 'resource' : 'contact';

  try {
    await getSql()`INSERT INTO contact_messages (name, email, message) VALUES (${name}, ${email}, ${message})`;
  } catch (err) {
    console.error('contact_messages insert failed:', err);
    await alertAdmin(`${kind} form submission`, err, name, email);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }

  await notify(kind, name, email, message);
  return res.status(201).json({ success: true });
}
