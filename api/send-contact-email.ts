import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, type } = req.body ?? {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  // If no email API key configured, log and return success (form data is still saved to DB)
  if (!RESEND_API_KEY) {
    console.log(`[${type || 'contact'}] from ${name} <${email}>: ${message}`);
    return res.status(200).json({ success: true, emailSent: false, reason: 'Email service not configured' });
  }

  const subject =
    type === 'volunteer'
      ? `New Volunteer Signup: ${name}`
      : type === 'join'
        ? `New Campaign Signup: ${name}`
        : `New Contact Message: ${name}`;

  const htmlBody = `
    <h2>${subject}</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
    <hr/>
    <p style="color:#888;font-size:12px;">Sent from nicosanders.net</p>
  `;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Campaign Website <notifications@nicosanders.net>',
      to: ['info@nicosanders.net', 'nicosanders@me.com', 'advisor@globalist.pro'],
      subject,
      html: htmlBody,
      reply_to: email,
    }),
  });

  const data = await resendRes.json();

  if (!resendRes.ok) {
    console.error('Email send failed:', data);
    return res.status(200).json({ success: true, emailSent: false, reason: data });
  }

  return res.status(200).json({ success: true, emailSent: true });
}
