import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Users, Lightbulb } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const GetInvolvedSection = () => {
  const [volDone, setVolDone] = useState(false);
  const [resourceDone, setResourceDone] = useState(false);

  const handleVolunteer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const help = formData.get("help") as string;

    try {
      const { error } = await supabase.from("volunteer_signups").insert({
        name,
        email,
        phone: phone || null,
        help_details: help || null,
      });
      if (error) throw error;

      // Trigger email notification
      supabase.functions.invoke("send-contact-email", {
        body: {
          name,
          email,
          message: `Phone: ${phone || "N/A"}\nHow they want to help: ${help || "N/A"}`,
          type: "volunteer",
        },
      });

      setVolDone(true);
      toast.success("Thank you for volunteering!");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const resource = formData.get("resource") as string;

    try {
      const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        message: `Resource suggestion: ${resource}`,
      });
      if (error) throw error;

      supabase.functions.invoke("send-contact-email", {
        body: { name, email, message: `Resource suggestion: ${resource}`, type: "resource" },
      });

      setResourceDone(true);
      toast.success("Thanks for the suggestion!");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="involved" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-8">
          <ScrollReveal>
            <div className="bg-card rounded-xl p-8 h-full border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
                  <Users size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Get Involved</h2>
                  <p className="text-xs text-muted-foreground">Neighbors helping neighbors</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                If you can spare an hour, you can help. Tell us how you want to plug in.
              </p>
              <form onSubmit={handleVolunteer} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="vName" className="text-xs text-muted-foreground uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      id="vName"
                      name="name"
                      autoComplete="name"
                      required
                      className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="vPhone" className="text-xs text-muted-foreground uppercase tracking-wider">
                      Phone
                    </label>
                    <input
                      id="vPhone"
                      name="phone"
                      autoComplete="tel"
                      className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="vEmail" className="text-xs text-muted-foreground uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    id="vEmail"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="vHelp" className="text-xs text-muted-foreground uppercase tracking-wider">
                    How do you want to help?
                  </label>
                  <textarea
                    id="vHelp"
                    name="help"
                    placeholder="Distributing flyers, tabling events, sharing resources, social media…"
                    rows={3}
                    className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-sm font-semibold gradient-gold text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Sign Up to Help <ArrowRight size={15} />
                </button>
                {volDone && <p className="text-xs text-primary">✓ Thank you! We'll be in touch.</p>}
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="bg-card rounded-xl p-8 h-full border border-border shadow-sm" id="suggest">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center">
                  <Lightbulb size={18} className="text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Suggest a Resource</h2>
                  <p className="text-xs text-muted-foreground">Help this hub grow</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Know an organization, program, or event that belongs here? Let us know and we'll look into adding it.
              </p>
              <form onSubmit={handleResource} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rName" className="text-xs text-muted-foreground uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      id="rName"
                      name="name"
                      autoComplete="name"
                      required
                      className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="rEmail" className="text-xs text-muted-foreground uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      id="rEmail"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="rResource" className="text-xs text-muted-foreground uppercase tracking-wider">
                    What should we add?
                  </label>
                  <textarea
                    id="rResource"
                    name="resource"
                    placeholder="Organization or program name, what it offers, and how to reach it…"
                    rows={3}
                    required
                    className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-sm font-semibold gradient-blue text-secondary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Submit Suggestion <ArrowRight size={15} />
                </button>
                {resourceDone && <p className="text-xs text-primary">✓ Thank you! We'll take a look.</p>}
              </form>

              <div className="bg-muted/50 rounded-xl p-6 mt-6">
                <h3 className="font-display text-lg font-semibold mb-2">Host a Community Meetup</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                  Want to host a small gathering in District 11A? We'll help coordinate.
                </p>
                <a
                  href="#contact"
                  className="text-sm text-primary font-medium hover:underline inline-flex items-center gap-1.5"
                >
                  Get in touch <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedSection;
