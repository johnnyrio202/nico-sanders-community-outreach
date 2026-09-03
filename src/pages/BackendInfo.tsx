import { ArrowLeft, Database, Mail, Shield, Server } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const BackendInfo = () => {
  return (
    <main className="min-h-screen py-20">
      <div className="container max-w-4xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to home
        </a>

        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4 block">
            Technical Overview
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Backend <span className="gradient-gold-text">Configuration</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            This site's data runs on <strong>Neon Postgres</strong> via Vercel, reached through
            a small set of serverless API routes (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">/api/*</code>).
            Event thumbnails and email notifications still run through an independently-owned{" "}
            <strong>Supabase</strong> project (storage bucket + edge functions). Nothing here is
            tied to a third-party app builder or shared account.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <ScrollReveal delay={0.1}>
            <div className="bg-card border border-border rounded-xl p-6 h-full shadow-sm">
              <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center mb-4">
                <Database size={18} className="text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Database</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Neon Postgres stores submissions from the site's forms and the content behind
                the Resources and Events sections. It's only ever reached from server-side
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded mx-1">/api</code>
                routes — access control lives in that code, not in public database policies.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex gap-2"><span className="text-primary">•</span> campaign_joins — email signups (insert-only)</li>
                <li className="flex gap-2"><span className="text-primary">•</span> contact_messages — contact &amp; resource suggestions (insert-only)</li>
                <li className="flex gap-2"><span className="text-primary">•</span> volunteer_signups — volunteer form (insert-only)</li>
                <li className="flex gap-2"><span className="text-primary">•</span> resources — Resources section content (public read-only)</li>
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="bg-card border border-border rounded-xl p-6 h-full shadow-sm">
              <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center mb-4">
                <Mail size={18} className="text-secondary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Email Notifications</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A serverless edge function (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">send-contact-email</code>)
                sends notifications whenever someone signs up, volunteers, or
                submits the contact form. Email delivery uses <strong>Resend</strong> via a
                stored API key.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-card border border-border rounded-xl p-6 h-full shadow-sm">
              <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center mb-4">
                <Shield size={18} className="text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Security</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The database connection string is a server-only environment variable, never
                exposed to the browser. Each API route only performs the one operation it's
                meant to — form routes only insert, and nothing submitted by a visitor is
                publicly readable back out. The Resend API key lives in Supabase's encrypted
                secret storage.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.25}>
            <div className="bg-card border border-border rounded-xl p-6 h-full shadow-sm">
              <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center mb-4">
                <Server size={18} className="text-secondary-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">External Accounts</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Three accounts power the backend, all owned directly rather than through a
                third-party app builder:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex gap-2"><span className="text-secondary">•</span> Neon via Vercel Marketplace (database)</li>
                <li className="flex gap-2"><span className="text-secondary">•</span> Supabase (event-media storage, edge functions)</li>
                <li className="flex gap-2"><span className="text-secondary">•</span> Resend (transactional email)</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.3}>
          <div className="bg-muted/40 border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold mb-2">Managing the Backend</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Database tables, form submissions, and resource entries are managed via the Neon
              dashboard (through Vercel) or directly with SQL. Event thumbnails and the Resend
              secret are still managed from the Supabase dashboard for this project.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
};

export default BackendInfo;
