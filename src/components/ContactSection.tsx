import { useState } from "react";
import { toast } from "sonner";
import { Mail, Send, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "./ScrollReveal";

const CAMPAIGN_EMAIL = "info@nicosanders.net";

const ContactSection = () => {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const copyEmail = async () => {
    await navigator.clipboard.writeText(CAMPAIGN_EMAIL);
    setCopied(true);
    toast.success("Email address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const { error } = await supabase.from("contact_messages").insert({ name, email, message });
      if (error) {
        console.error("DB insert error:", error);
        throw new Error(error.message);
      }

      const { error: fnError } = await supabase.functions.invoke("send-contact-email", {
        body: { name, email, message, type: "contact" },
      });
      if (fnError) console.warn("Email notification failed:", fnError);

      setSent(true);
      toast.success("Message sent! We'll get back to you.");
      form.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Contact form error:", msg);
      setFormError(`Something went wrong — please try again or email us directly at ${CAMPAIGN_EMAIL}`);
      toast.error("Message failed to send.");
      supabase.functions.invoke("send-admin-alert", {
        body: { error: msg, context: "contact form submission", userName: name, userEmail: email },
      }).catch(() => {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="container">
        <ScrollReveal>
          <div className="bg-card rounded-xl p-8 lg:p-12 glow-blue border border-border shadow-sm">
            <div className="text-center mb-10">
              <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium mb-4 block">Get in Touch</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
                Let's <span className="gradient-blue-text">Connect</span>
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Resource suggestions, event info, media inquiries, or ways to get involved — we'd love to hear from you.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-muted/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail size={18} className="text-secondary" />
                  <h3 className="font-display text-lg font-semibold">Reach Out</h3>
                </div>
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="px-4 py-2 text-sm text-secondary font-medium">{CAMPAIGN_EMAIL}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={copyEmail}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-secondary/20 text-xs text-secondary hover:bg-secondary/5 transition-colors"
                      >
                        {copied ? <Check size={12} /> : <Copy size={12} />}
                        {copied ? "Copied!" : "Copy address"}
                      </button>
                      <a
                        href={`mailto:${CAMPAIGN_EMAIL}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-secondary/20 text-xs text-secondary hover:bg-secondary/5 transition-colors"
                      >
                        <Mail size={12} />
                        Open mail app
                      </a>
                    </div>
                  </div>
                  <a href="tel:+14108035821" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-secondary/20 text-sm text-secondary hover:bg-secondary/5 transition-colors">
                    (410) 803-5821
                  </a>
                </div>
                <p className="text-muted-foreground text-xs mb-3 uppercase tracking-wider">Social</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Facebook", href: "https://www.facebook.com/nicosandersformddelegate" },
                    { label: "Instagram", href: "https://www.instagram.com/nicosandersformddelegate" },
                    { label: "X", href: "https://x.com/nicosandersformddelegate" },
                    { label: "YouTube", href: "https://www.youtube.com/@nicosandersformddelegate" },
                  ].map((s) =>
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-muted-foreground border border-border rounded-md px-3 py-2 hover:text-foreground hover:border-primary/20 transition-all">
                      {s.label}
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Send size={18} className="text-secondary" />
                  <h3 className="font-display text-lg font-semibold">Send a Message</h3>
                </div>
                <form onSubmit={handleContact} className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="cName" className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                      <input id="cName" name="name" autoComplete="name" required
                      className="w-full mt-1.5 px-4 py-2.5 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                    </div>
                    <div>
                      <label htmlFor="cEmail" className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                      <input id="cEmail" name="email" type="email" autoComplete="email" required
                      className="w-full mt-1.5 px-4 py-2.5 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cMsg" className="text-xs text-muted-foreground uppercase tracking-wider">Message</label>
                    <textarea id="cMsg" name="message" required rows={4}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-lg border border-border bg-background/50 text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                  </div>
                  {formError && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive leading-relaxed">
                      {formError}
                    </div>
                  )}
                  <button type="submit" disabled={submitting} className="w-full py-3 rounded-lg text-sm font-semibold gradient-gold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? "Sending…" : "Send Message"}
                  </button>
                  {sent && <p className="text-xs text-primary">✓ Thank you! We'll respond soon.</p>}
                </form>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center mt-8">
              Need content in another format? Email us and we will accommodate.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>);

};

export default ContactSection;