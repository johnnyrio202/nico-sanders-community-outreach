import { Home, Heart, GraduationCap, Landmark, Briefcase, TreePine } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const priorities = [
  { icon: Home, title: "Housing & Cost of Living", desc: "Find help with affordable housing, renter protections, energy bill assistance, and workforce housing near jobs." },
  { icon: Heart, title: "Mental Health & Safety", desc: "Connect to treatment access, crisis response lines, and local violence-prevention programs." },
  { icon: GraduationCap, title: "Schools & Opportunity", desc: "Resources for families and educators, plus career-connected learning and apprenticeship programs." },
  { icon: Landmark, title: "Good Government", desc: "Guides to state resources, constituent services, and getting help navigating local government." },
  { icon: Briefcase, title: "Small Business & Economy", desc: "Support and resources for entrepreneurs — procurement help, technical assistance, and more." },
  { icon: TreePine, title: "Environment & Infrastructure", desc: "Severe weather prep, stormwater resources, and information on protecting local green spaces." },
];

const PrioritiesSection = () => (
  <section id="resources" className="py-24 relative">
    <div className="section-divider mb-24" />
    <div className="container">
      <ScrollReveal>
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-4 block">Resources</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Resources for{" "}
            <span className="gradient-gold-text">Our Community</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Starting points for residents of District 11A. More will be added as we connect with neighbors and local organizations.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {priorities.map((p, i) => (
          <ScrollReveal key={p.title} delay={i * 0.08}>
            <div className="group bg-card rounded-xl p-6 border border-border hover:border-glow hover:glow-amber transition-all duration-500 h-full shadow-sm">
              <div className="w-10 h-10 rounded-lg gradient-blue flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <p.icon size={18} className="text-secondary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default PrioritiesSection;
