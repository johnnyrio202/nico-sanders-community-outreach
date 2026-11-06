import { esc } from './site.js';
import { allow } from './guard.js';

const NOTIFY_TO = ['info@nicosanders.net', 'nicosanders@me.com', 'advisor@globalist.pro'];
const ALERT_TO = ['info@nicosanders.net', 'advisor@globalist.pro'];
const FROM = 'Campaign Website <notifications@nicosanders.net>';

export type NotifyType = 'join' | 'volunteer' | 'resource' | 'contact';

const line = (s: string, max = 120) => s.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
const para = (s: string) => esc(s).replace(/\r?\n/g, '<br>');

/** Pure builder (unit-tested). Every user-supplied value is escaped; subjects are single-line. */
export function buildNotification(type: NotifyType, name: string, email: string, message: string) {
  const label =
    type === 'volunteer' ? 'New Volunteer Signup' : type === 'join' ? 'New Campaign Signup' : type === 'resource' ? 'New Resource Suggestion' : 'New Contact Message';
  const subject = `${label}: ${line(name, 80)}`;
  const html = `
    <h2>${esc(label)}</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Message:</strong></p>
    <p>${para(message)}</p>
    <hr/>
    <p style="color:#888;font-size:12px;">Sent from nicosanders.net</p>`;
  return { subject, html };
}

export function buildAlert(context: string, error: string, name?: string, email?: string) {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const html = `
    <h2 style="color:#c0392b;">Form Error: Action Required</h2>
    <p><strong>Time:</strong> ${esc(timestamp)} ET</p>
    <p><strong>Error:</strong> ${esc(error.slice(0, 500))}</p>
    <p><strong>Context:</strong> ${esc(context)}</p>
    ${name ? `<p><strong>User name:</strong> ${esc(name)}</p>` : ''}
    ${email ? `<p><strong>User email:</strong> ${esc(email)}</p>` : ''}
    <hr/>
    <p style="color:#888;font-size:12px;">Automated alert from nicosanders.net. A visitor tried to submit a form but it failed. Check the Neon dashboard and Vercel logs for details.</p>`;
  return { subject: 'Form error on nicosanders.net', html };
}

async function send(to: string[], subject: string, html: string, replyTo?: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email skipped: no RESEND_API_KEY] ${subject}`);
    return false;
  }
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!r.ok) console.error('Email send failed:', r.status, await r.text());
    return r.ok;
  } catch (err) {
    console.error('Email send error:', err);
    return false;
  }
}

/** Notify the team about a saved submission. Capped site-wide so a flood can never become an inbox flood. Never throws. */
export async function notify(type: NotifyType, name: string, email: string, message: string): Promise<boolean> {
  if (!(await allow('global:notify', 60, 3600))) {
    console.warn('notification suppressed: hourly cap reached');
    return false;
  }
  const { subject, html } = buildNotification(type, name, email, message);
  return send(NOTIFY_TO, subject, html, email);
}

/** Alert on a failed submission. Tighter cap. Never throws. */
export async function alertAdmin(context: string, error: unknown, name?: string, email?: string): Promise<void> {
  if (!(await allow('global:alert', 5, 3600))) return;
  const { subject, html } = buildAlert(context, String(error), name, email);
  await send(ALERT_TO, subject, html);
}
