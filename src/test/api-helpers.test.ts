import { describe, it, expect } from "vitest";
import { text, emailAddr, phone, isObj } from "../../api/_lib/validate";
import { buildNotification, buildAlert } from "../../api/_lib/notify";
import { originOk } from "../../api/_lib/guard";
import { esc } from "../../api/_lib/site";

describe("validate", () => {
  it("accepts normal text, rejects over-long and non-strings", () => {
    expect(text("  Jane   Doe ", 100, { required: true })).toBe("Jane Doe");
    expect(text("x".repeat(101), 100, { required: true })).toBeNull();
    expect(text(123, 100, { required: true })).toBeNull();
    expect(text(undefined, 100)).toBe("");
  });
  it("strips control characters and keeps newlines only when multiline", () => {
    expect(text("a\u0000b\nc", 50, { multiline: true })).toBe("ab\nc");
    expect(text("a\nb", 50)).toBe("a b");
  });
  it("validates email and phone", () => {
    expect(emailAddr("a@b.org")).toBe("a@b.org");
    expect(emailAddr("not-an-email")).toBeNull();
    expect(emailAddr("a@b.org\r\nBcc: x@y.z")).toBeNull();
    expect(emailAddr('"><script>@x.io')).toBeNull();
    expect(phone("(410) 803-5821")).toBe("(410) 803-5821");
    expect(phone("")).toBe("");
    expect(phone("<script>")).toBeNull();
  });
  it("isObj rejects arrays and null", () => {
    expect(isObj({})).toBe(true);
    expect(isObj([])).toBe(false);
    expect(isObj(null)).toBe(false);
  });
});

describe("notification emails", () => {
  const evil = '<img src=x onerror=alert(1)> <a href="https://evil.test">click</a>';
  it("escapes every user-supplied field", () => {
    const { html, subject } = buildNotification("contact", evil, "a@b.org", evil + "\nline2");
    expect(html).not.toContain("<img");
    expect(html).not.toContain('<a href="https://evil.test"');
    expect(html).toContain("&lt;img");
    expect(html).toContain("<br>line2");
    expect(subject).not.toMatch(/[\r\n]/);
  });
  it("keeps the subject on one line", () => {
    const { subject } = buildNotification("volunteer", "Jane\r\nBcc: x@y.z", "a@b.org", "hi");
    expect(subject).not.toMatch(/[\r\n]/);
  });
  it("escapes alerts", () => {
    const { html } = buildAlert(evil, evil, evil, evil);
    expect(html).not.toContain("<img");
  });
});

describe("origin check", () => {
  const req = (origin?: string) => ({ headers: origin ? { origin } : {} }) as never;
  it("allows the site, previews and missing origin; rejects others", () => {
    expect(originOk(req())).toBe(true);
    expect(originOk(req("https://nicosanders.net"))).toBe(true);
    expect(originOk(req("https://www.nicosanders.net"))).toBe(true);
    expect(originOk(req("https://nico-sanders-community-outreach-abc.vercel.app"))).toBe(true);
    expect(originOk(req("https://evil.example"))).toBe(false);
    expect(originOk(req("https://nicosanders.net.evil.example"))).toBe(false);
    expect(originOk(req("not a url"))).toBe(false);
  });
});

describe("esc", () => {
  it("escapes html metacharacters and quotes", () => {
    expect(esc(`<a href="x" onclick='y'>&`)).toBe("&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;");
  });
});
