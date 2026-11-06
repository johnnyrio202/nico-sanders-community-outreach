// Form handling for the public site. The server (api/*.ts) validates, rate-limits,
// saves and sends the notification email, so the browser only makes one request.
async function submitTo(table, payload, btn, successEl) {
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = "Sending…";
  try {
    const res = await fetch(`/api/${table}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.status === 429) {
      alert("You've sent a few messages already. Please try again in a few minutes, or email info@nicosanders.net.");
      return;
    }
    if (res.status === 400) {
      let msg = "Please check what you entered and try again.";
      try { msg = (await res.json()).error || msg; } catch (e) {}
      alert(msg);
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    successEl.style.display = "block";
    btn.closest("form").reset();
  } catch (err) {
    alert("Something went wrong. Please try again or email info@nicosanders.net.");
    console.error(err);
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
    const website = fd.get("website") || ""; // honeypot, must stay empty
    let payload = {};

    if (table === "campaign_joins") {
      payload = { name: fd.get("name"), email: fd.get("email"), website };
    } else if (table === "volunteer_signups") {
      payload = { name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone") || null, help_details: fd.get("help") || null, website };
    } else if (table === "contact_messages") {
      const isResource = form.dataset.kind === "resource";
      payload = {
        name: fd.get("name"),
        email: fd.get("email"),
        message: isResource ? `Resource suggestion: ${fd.get("resource")}` : fd.get("message"),
        kind: isResource ? "resource" : "contact",
        website
      };
    }

    submitTo(table, payload, form.querySelector("button[type=submit]"), form.querySelector(".form-success"));
  });
});
