async function notifyEmail(type, name, email, message) {
  try {
    const res = await fetch(`/api/send-contact-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message, type })
    });
    if (!res.ok) console.warn("Email notification failed:", await res.text());
  } catch (err) {
    console.warn("Email notification failed:", err);
  }
}

function notifyAdminAlert(errorMessage, context, userName, userEmail) {
  fetch(`/api/send-admin-alert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ error: errorMessage, context, userName, userEmail })
  }).catch(() => {});
}

async function submitTo(table, payload, btn, successEl, emailInfo) {
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = "Sending…";
  try {
    const res = await fetch(`/api/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    successEl.style.display = "block";
    btn.closest("form").reset();
    if (emailInfo) {
      notifyEmail(emailInfo.type, emailInfo.name, emailInfo.email, emailInfo.message);
    }
  } catch (err) {
    alert("Something went wrong. Please try again or email info@nicosanders.net.");
    console.error(err);
    if (emailInfo) {
      notifyAdminAlert(String(err), `${table} form submission`, emailInfo.name, emailInfo.email);
    }
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
}
document.querySelectorAll("form[data-table]").forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const table = form.dataset.table;
    const fd = new FormData(form);
    let payload = {};
    let emailInfo = null;

    if (table === "campaign_joins") {
      const email = fd.get("email");
      payload = { email };
      emailInfo = { type: "join", name: fd.get("name") || "Community Update Signup", email, message: `New community update signup: ${email}` };
    } else if (table === "volunteer_signups") {
      const name = fd.get("name"), email = fd.get("email"), phone = fd.get("phone"), help = fd.get("help");
      payload = { name, email, phone: phone || null, help_details: help || null };
      emailInfo = { type: "volunteer", name, email, message: `Phone: ${phone || "N/A"}\nHow they want to help: ${help || "N/A"}` };
    } else if (table === "contact_messages") {
      const isResource = form.dataset.kind === "resource";
      const name = fd.get("name"), email = fd.get("email");
      const message = isResource ? `Resource suggestion: ${fd.get("resource")}` : fd.get("message");
      payload = { name, email, message };
      emailInfo = { type: isResource ? "resource" : "contact", name, email, message };
    }

    const btn = form.querySelector("button[type=submit]");
    const successEl = form.querySelector(".form-success");
    submitTo(table, payload, btn, successEl, emailInfo);
  });
});
