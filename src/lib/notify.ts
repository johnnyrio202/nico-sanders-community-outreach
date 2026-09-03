// Email notifications run through api/send-contact-email and
// api/send-admin-alert (Vercel Functions using Resend).
export async function notifyEmail(type: string, name: string, email: string, message: string) {
  try {
    const res = await fetch(`/api/send-contact-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message, type }),
    });
    if (!res.ok) console.warn("Email notification failed:", await res.text());
  } catch (err) {
    console.warn("Email notification failed:", err);
  }
}

export function notifyAdminAlert(errorMessage: string, context: string, userName: string, userEmail: string) {
  fetch(`/api/send-admin-alert`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: errorMessage, context, userName, userEmail }),
  }).catch(() => {});
}
