// Email notifications still run through the Supabase edge functions
// (send-contact-email, send-admin-alert) — only the relational data
// moved to Neon. See api/*.ts for the Neon-backed insert/read routes.
const SUPABASE_FUNCTIONS_URL = "https://sldlxxcyhgccattpllqm.supabase.co/functions/v1";
const SUPABASE_KEY = "sb_publishable_hy9RJt27sqlLptRPY34sYg_tDoDx7K_";

export async function notifyEmail(type: string, name: string, email: string, message: string) {
  try {
    const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/send-contact-email`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message, type }),
    });
    if (!res.ok) console.warn("Email notification failed:", await res.text());
  } catch (err) {
    console.warn("Email notification failed:", err);
  }
}

export function notifyAdminAlert(errorMessage: string, context: string, userName: string, userEmail: string) {
  fetch(`${SUPABASE_FUNCTIONS_URL}/send-admin-alert`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ error: errorMessage, context, userName, userEmail }),
  }).catch(() => {});
}
