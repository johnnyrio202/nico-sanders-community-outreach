import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './_lib/db.js';
import { gate } from './_lib/guard.js';
import { isObj, text, emailAddr, phone as phoneNum } from './_lib/validate.js';
import { notify, alertAdmin } from './_lib/notify.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!(await gate(req, res, 'volunteer'))) return;

  const b = isObj(req.body) ? req.body : {};
  if (b.website) return res.status(201).json({ success: true }); // honeypot: pretend success

  const name = text(b.name, 100, { required: true });
  const email = emailAddr(b.email);
  const phone = phoneNum(b.phone);
  const help = text(b.help_details, 2000, { multiline: true });
  if (!name || !email || phone === null || help === null) {
    return res.status(400).json({ error: 'Please check your name, email and phone number.' });
  }

  try {
    await getSql()`
      INSERT INTO volunteer_signups (name, email, phone, help_details)
      VALUES (${name}, ${email}, ${phone || null}, ${help || null})
    `;
  } catch (err) {
    console.error('volunteer_signups insert failed:', err);
    await alertAdmin('volunteer_signups form submission', err, name, email);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }

  await notify('volunteer', name, email, `Phone: ${phone || 'N/A'}\nHow they want to help: ${help || 'N/A'}`);
  return res.status(201).json({ success: true });
}
