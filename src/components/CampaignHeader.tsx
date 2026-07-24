import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const navLinks = [
{ label: "About", href: "#about" },
{ label: "Resources", href: "#resources" },
{ label: "Get Involved", href: "#involved" },
{ label: "Contact", href: "#contact" }];


const CampaignHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container flex items-center justify-between py-4">
        <a href="#top" className="flex items-center gap-3.5 group" aria-label="Nico Sanders home">
          <div className="w-10 h-10 rounded-md gradient-gold flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-lg">N</span>
          </div>
          <div className="flex flex-col leading-none">
            <strong className="text-sm tracking-wide font-semibold group-hover:text-primary transition-colors">Nico Sanders</strong>
            <span className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-widest">Community Outreach, District 11A</span>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Site">
          {navLinks.map((l) =>
            l.pulse ? (
              <a key={l.href} href={l.href} className="relative px-4 py-2 rounded-md text-sm font-semibold text-primary">
                <span className="absolute inset-0 rounded-md border border-primary animate-ping opacity-50" />
                <span className="relative">{l.label}</span>
              </a>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground transition-colors relative group">
                {l.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] gradient-gold group-hover:w-3/4 transition-all duration-300" />
              </a>
            )
          )}
          <div className="w-px h-5 bg-border mx-2" />
          <a
            className="px-4 py-2 text-sm font-bold gradient-gold text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
            href="#resources"
          >
            Find Resources
          </a>
          <a href="#involved" className="ml-1 px-5 py-2.5 rounded-md text-sm font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-colors flex items-center gap-2">
            Get Involved <ArrowRight size={14} />
          </a>
        </nav>

        <button
          className="lg:hidden p-2 rounded-md border border-border hover:bg-secondary transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu">

          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open &&
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden border-t border-border"
          aria-label="Mobile site">

            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((l) =>
                l.pulse ? (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                    className="relative px-4 py-3 rounded-md text-sm font-semibold text-primary">
                    <span className="absolute inset-0 rounded-md border border-primary animate-ping opacity-50" />
                    <span className="relative">{l.label}</span>
                  </a>
                ) : (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                    {l.label}
                  </a>
                )
              )}
              <div className="flex gap-3 mt-3 pt-3 border-t border-border">
                <a
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center py-3 rounded-md text-sm font-bold gradient-gold text-primary-foreground hover:opacity-90 transition-opacity"
                  href="#resources"
                >
                  Find Resources
                </a>
                <a href="#involved" onClick={() => setOpen(false)} className="flex-1 text-center py-3 rounded-md text-sm font-semibold border border-primary/30 text-primary">
                  Get Involved
                </a>
              </div>
            </div>
          </motion.nav>
        }
      </AnimatePresence>
    </header>);

};

export default CampaignHeader;