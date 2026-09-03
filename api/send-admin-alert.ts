import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { error, context, userName, userEmail } = req.body ?? {};

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('Admin alert: RESEND_API_KEY not set');
    return res.status(200).json({ success: false });
  }

  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  const html = `
    <h2 style="color:#c0392b;">⚠️ Contact Form Error — Action Required</h2>
    <p><strong>Time:</strong> ${timestamp} ET</p>
    <p><strong>Error:</strong> ${error}</p>
    <p><strong>Context:</strong> ${context}</p>
    ${userName ? `<p><strong>User name:</strong> ${userName}</p>` : ''}
    ${userEmail ? `<p><strong>User email:</strong> ${userEmail}</p>` : ''}
    <hr/>
    <p style="color:#888;font-size:12px;">This is an automated alert from nicoformddelegate.com. A visitor tried to submit the contact form but encountered an error. Please check the Neon dashboard for more details.</p>
  `;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Campaign Website <notifications@nicoformddelegate.com>',
      to: ['info@nicoformddelegate.com'],
      subject: '⚠️ Contact Form Error on nicoformddelegate.com',
      html,
    }),
  });

  if (!resendRes.ok) {
    const data = await resendRes.json();
    console.error('Admin alert email failed:', data);
  }

  return res.status(200).json({ success: true });
}
