import { createHash } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSql } from './db.js';

const ALLOWED_HOSTS = new Set(['nicosanders.net', 'www.nicosanders.net', 'localhost', '127.0.0.1']);

export function clientIp(req: VercelRequest): string {
  const xff = req.headers['x-forwarded-for'];
  const v = (Array.isArray(xff) ? xff[0] : xff) || (req.headers['x-real-ip'] as string) || '';
  return v.split(',')[0].trim() || 'unknown';
}

/** Browsers send Origin on cross-site POSTs. Reject ones from other sites; allow missing Origin (non-browser clients are rate limited instead). */
export function originOk(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOSTS.has(host) || /^nico-sanders-community-outreach[a-z0-9-]*\.vercel\.app$/.test(host);
  } catch {
    return false;
  }
}

/**
 * Fixed-window counter in Postgres. Returns true if the call is within `limit`.
 * Fails open if the counter store is unavailable (a form should not die because of the limiter).
 */
export async function allow(key: string, limit: number, windowSec: number): Promise<boolean> {
  try {
    const bucket = Math.floor(Date.now() / 1000 / windowSec);
    const k = `${key}:${bucket}`;
    const sql = getSql();
    const rows = (await sql`
      INSERT INTO rate_limits (key, count, expires_at)
      VALUES (${k}, 1, now() + make_interval(secs => ${windowSec * 2}))
      ON CONFLICT (key) DO UPDATE SET count = rate_limits.count + 1
      RETURNING count
    `) as { count: number }[];
    if (Math.random() < 0.02) await sql`DELETE FROM rate_limits WHERE expires_at < now()`;
    return rows[0].count <= limit;
  } catch (err) {
    console.error('rate limit check failed (allowing):', err);
    return true;
  }
}

export const ipKey = (req: VercelRequest, scope: string) =>
  `ip:${scope}:${createHash('sha256').update(clientIp(req) + ':nico-rl').digest('hex').slice(0, 24)}`;

/** Common gate for public POST endpoints. Returns true if the request may proceed; otherwise it has already responded. */
export async function gate(req: VercelRequest, res: VercelResponse, scope: string): Promise<boolean> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return false;
  }
  if (!originOk(req)) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  // 5 submissions per 10 minutes per visitor per form.
  if (!(await allow(ipKey(req, scope), 5, 600))) {
    res.setHeader('Retry-After', '600');
    res.status(429).json({ error: 'Too many submissions. Please try again in a few minutes.' });
    return false;
  }
  return true;
}
