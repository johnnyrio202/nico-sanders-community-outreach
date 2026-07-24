import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import nicoDailyRecord from "@/assets/nico-daily-record.jpeg";
import nicoFamily from "@/assets/nico-family.jpeg";
import nicoCommunity from "@/assets/nico-community.jpeg";
import nicoEvent from "@/assets/nico-event.jpeg";
import nicoRavens from "@/assets/nico-ravens.png";
import ScrollReveal from "./ScrollReveal";

const carouselImages = [
  { src: nicoDailyRecord, alt: "Nico Sanders receiving an award from The Daily Record" },
  { src: nicoFamily, alt: "Nico Sanders with his family" },
  { src: nicoCommunity, alt: "Nico Sanders with community supporters" },
  { src: nicoEvent, alt: "Nico Sanders at a community event" },
  { src: nicoRavens, alt: "Nico Sanders at a Ravens game" },
];

const AboutSection = () => {
  const [signupDone, setSignupDone] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);

  const nextImg = useCallback(() => {
    setCurrentImg((i) => (i + 1) % carouselImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextImg, 4000);
    return () => clearInterval(timer);
  }, [nextImg]);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;

    try {
      const { error } = await supabase.from("campaign_joins").insert({ email });
      if (error) throw error;

      // Trigger email notification
      supabase.functions.invoke("send-contact-email", {
        body: { name: "Campaign Signup", email, message: `New campaign email signup: ${email}`, type: "join" },
      });

      setSignupDone(true);
      toast.success("Thank you for signing up!");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="about" className="py-24 relative">
      <div className="section-divider mb-24" />
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-12 lg:gap-16">
          <ScrollReveal>
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4 block">About</span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-8">
              Building coalitions that{" "}
              <span className="gradient-gold-text">serve our community</span>
            </h2>

            {/* Carousel */}
            <div className="relative mx-auto lg:mx-0 mb-8 w-full max-w-md lg:max-w-full">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden border border-border relative">
                {carouselImages.map((img, i) => (
                  <img
                    key={img.alt}
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    style={{ opacity: i === currentImg ? 1 : 0 }}
                  />
                ))}
              </div>
              <div className="flex justify-center gap-1.5 mt-3">
                {carouselImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === currentImg ? "bg-primary w-4" : "bg-muted-foreground/30"}`}
                    aria-label={`View photo ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Text below carousel */}
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground leading-relaxed">
                I have worked at the intersection of housing, health, and community safety. I have helped organizations serve people with complex needs,
                and I have partnered with residents, service providers, and public agencies to deliver real outcomes.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This hub is where that work continues. It's a place to find real resources, hear what's happening around District 11A,
                and connect with the organizations already doing good work here.
              </p>
            </div>

            <ul className="space-y-3 mt-8">
              {[
                "Show up consistently in District 11A and communicate clearly.",
                "Point neighbors toward real housing, health, and safety resources.",
                "Highlight local organizations and events worth knowing about.",
                "Give residents an easy way to ask questions and get connected.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full gradient-gold mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="bg-card rounded-xl p-8 glow-amber border border-border shadow-sm" id="updates">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4 block">Stay Connected</span>
              <h3 className="font-display text-2xl font-bold mb-2">Community Updates</h3>
              <p className="text-muted-foreground text-sm mb-6">Sign up for emails about resources, events, and community news.</p>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label htmlFor="signupName" className="text-xs text-muted-foreground uppercase tracking-wider">Name</label>
                  <input id="signupName" name="name" autoComplete="name" required
                    className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                </div>
                <div>
                  <label htmlFor="signupEmail" className="text-xs text-muted-foreground uppercase tracking-wider">Email</label>
                  <input id="signupEmail" name="email" type="email" autoComplete="email" required
                    className="w-full mt-1.5 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all" />
                </div>
                <button type="submit" className="w-full py-3 rounded-lg text-sm font-semibold gradient-gold text-primary-foreground hover:opacity-90 transition-opacity">
                  Sign Up for Updates
                </button>
                {signupDone && <p className="text-xs text-primary">✓ Thank you! You're signed up.</p>}
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  By signing up, you agree to receive community updates. Unsubscribe at any time.
                </p>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
