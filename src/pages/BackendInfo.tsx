import { Link } from "react-router-dom";
import { ArrowLeft, Database, Mail, Shield, Server } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const BackendInfo = () => {
  return (
    <main className="min-h-screen py-20">
      <div className="container max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <ScrollReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4 block">
            Technical Overview
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Backend <span className="gradient-gold-text">Configuration</span>
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-12 max-w-2xl">
            This site is powered by <strong>Lovable Cloud</strong>, an integrated backend that
            handles the database, authentication, file storage, and serverless functions. There is
            no separately-managed external account—Lovable Cloud provisions and operates the
            backend automatically as part of the project.
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
                Stores submissions from the site's forms. Three tables are configured with
                public-insert row-level security policies so visitors can submit without an
                account, while reads stay restricted.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex gap-2"><span className="text-primary">•</span> campaign_joins — email signups</li>
                <li className="flex gap-2"><span className="text-primary">•</span> contact_messages — contact form</li>
                <li className="flex gap-2"><span className="text-primary">•</span> volunteer_signups — volunteer form</li>
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
                Row-level security is enabled on every table. Public visitors can only insert
                rows—nothing is publicly readable. Sensitive credentials (Resend, service-role
                keys) live in encrypted secret storage and are never exposed to the browser.
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
                The backend is fully managed by Lovable Cloud—no separate Supabase, AWS, or
                hosting account is linked. The only third-party services used are:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li className="flex gap-2"><span className="text-secondary">•</span> Resend (transactional email)</li>
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.3}>
          <div className="bg-muted/40 border border-border rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold mb-2">Managing the Backend</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Database tables, user records, and stored secrets can be reviewed and edited from
              the Lovable editor under the <strong>Cloud</strong> view. No external dashboard
              login is required.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
};

export default BackendInfo;
