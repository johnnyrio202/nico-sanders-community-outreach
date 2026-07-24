import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SHARE_URL = "https://nicosanders.net";
const SHARE_TEXT = "Check out the District 11A Community Hub — resources and updates from Nico Sanders.";

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.884v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const ShareBar = () => {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy — please copy the URL manually.");
    }
  };

  const copyForInstagram = async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      toast.success("Link copied! Paste it in your Instagram bio or story.");
    } catch {
      toast.error("Could not copy — please copy the URL manually.");
    }
  };

  const buttons = [
    {
      label: "Share on Facebook",
      icon: <FacebookIcon />,
      hoverClass: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
      action: () => window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SHARE_URL)}`,
        "_blank", "noopener,noreferrer,width=600,height=500"
      ),
    },
    {
      label: "Share on X",
      icon: <XIcon />,
      hoverClass: "hover:bg-black hover:text-white hover:border-black",
      action: () => window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`,
        "_blank", "noopener,noreferrer,width=600,height=500"
      ),
    },
    {
      label: "Share on Instagram",
      icon: <InstagramIcon />,
      hoverClass: "hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]",
      action: copyForInstagram,
    },
    {
      label: copied ? "Copied!" : "Copy Link",
      icon: copied ? <Check className="w-4 h-4 shrink-0" /> : <Link2 className="w-4 h-4 shrink-0" />,
      hoverClass: copied ? "bg-green-50 border-green-400 text-green-700" : "hover:bg-secondary hover:border-primary/30",
      action: copyLink,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="border-y border-border bg-card/60 backdrop-blur-sm"
    >
      <div className="container">
        <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground shrink-0 pr-1">
            Spread the word
          </span>
          <div className="w-px h-4 bg-border shrink-0" />
          <div className="flex gap-2 shrink-0">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${btn.hoverClass}`}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShareBar;
