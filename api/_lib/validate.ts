// Input validation for public form endpoints. Everything returns a cleaned
// string or null (invalid). Never trust req.body shapes.

export const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Trimmed text up to `max` chars. Single-line unless `multiline`. Returns null if empty/invalid and required. */
export function text(v: unknown, max: number, opts: { multiline?: boolean; required?: boolean } = {}): string | null {
  if (typeof v !== 'string') return opts.required ? null : '';
  let s = v.replace(CONTROL, '').trim();
  if (!opts.multiline) s = s.replace(/\s+/g, ' ');
  if (s.length > max) return null;
  if (opts.required && !s) return null;
  return s;
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
export function emailAddr(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return s.length <= 254 && EMAIL.test(s) ? s : null;
}

const PHONE = /^[0-9+()\-.\sx]{3,40}$/;
export function phone(v: unknown): string | null {
  if (v == null || v === '') return '';
  if (typeof v !== 'string') return null;
  const s = v.trim();
  return PHONE.test(s) ? s : null;
}
