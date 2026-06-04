"use client";

import { motion, useInView, useScroll, useMotionValue, animate, type Variants } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── Easing ───────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Brand tokens ────────────────────────────────────────────────────────────
const P  = "#2A442E";
const PL = "#3D6142";
const PP = "#F3F9F4";
const PB = "#D4E8D8";

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};

const fadeLeft = {
  hidden:  { opacity: 0, x: -48 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.65, ease: EASE } },
};

const fadeRight = {
  hidden:  { opacity: 0, x: 48 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.65, ease: EASE } },
};

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);
  return scrolled;
}

/** Stagger container that triggers once the ref enters the viewport */
function InView({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Splits a heading into words and reveals each one from behind a clip mask,
 * staggered left-to-right as the section scrolls into view.
 */
function AnimatedHeading({ text, className }: { text: string; className?: string }) {
  const wordVariant = {
    hidden:  { y: "105%", opacity: 0 },
    visible: { y: "0%",   opacity: 1, transition: { duration: 0.6, ease: EASE } },
  };
  const containerVariant = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  return (
    <motion.h2 variants={containerVariant} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: "bottom" }}>
          <motion.span variants={wordVariant} className="inline-block mr-[0.28em]">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h2>
  );
}

// ─── Scroll progress bar ──────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] origin-left"
      style={{ scaleX: scrollYProgress, backgroundColor: P }}
    />
  );
}

// ─── Pillar icons ────────────────────────────────────────────────────────────
const LeafIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M7 29C7 29 7 17 18 9C26 4 33 7 33 7C33 7 29 16 22 21C16 26 7 29 7 29Z"
      stroke={P} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 29C10 24 14 21 18 19"
      stroke={P} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const GrowthIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M4 26L12 18L18 22L32 8"
      stroke={P} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 8H32V14"
      stroke={P} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ─── Animated number counter ──────────────────────────────────────────────────
type Direction = "left" | "up" | "right";
const dirVariant: Record<Direction, Variants> = {
  left:  fadeLeft,
  up:    fadeUp,
  right: fadeRight,
};

function AnimatedStat({ value, label, direction = "up" }: { value: string; label: string; direction?: Direction }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
    if (!match) return;
    const target = parseInt(match[2], 10);
    const ctrl = animate(motionVal, target, { duration: 2, ease: "easeOut" });
    const unsub = motionVal.on("change", (v) => {
      setDisplay(`${match[1]}${Math.round(v)}${match[3]}`);
    });
    return () => { ctrl.stop(); unsub(); };
  }, [inView, motionVal, value]);

  return (
    <motion.div
      ref={ref}
      variants={dirVariant[direction]}
      className="rounded-2xl p-8 text-center"
      style={{
        backgroundColor: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.14)",
      }}
    >
      <div className="text-5xl font-extrabold text-white tracking-tight">{display}</div>
      <p className="mt-4 text-green-100 text-sm leading-relaxed">{label}</p>
    </motion.div>
  );
}

// ─── Marquee ticker ───────────────────────────────────────────────────────────
const TICKER = [
  "Sustainable Living", "Pre-loved Goods", "Circular Economy",
  "Earn from Home", "Greener Tomorrow", "Zero Waste",
  "Resell & Upcycle", "Better India", "Less Landfill",
];

function Marquee() {
  const items = [...TICKER, ...TICKER];
  return (
    <div className="overflow-hidden border-y py-4" style={{ borderColor: PB, backgroundColor: PP }}>
      <div className="marquee-track flex whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-5 px-5 text-sm font-medium" style={{ color: PL }}>
            {item}
            <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: PB }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-bold text-xl tracking-tight" style={{ color: P }}>
          Vyntage
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-500">
            <a href="#about"        className="hover:text-gray-900 transition-colors">About</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#impact"       className="hover:text-gray-900 transition-colors">Our Impact</a>
          </div>
          <motion.a
            href="#waitlist"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="rounded-full px-5 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: P }}
          >
            Join Waitlist
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] w-9 h-9"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-[2px] w-6 rounded-full transition-all duration-300 origin-center mx-auto"
            style={{
              backgroundColor: P,
              transform: menuOpen ? "translateY(7px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block h-[2px] w-6 rounded-full transition-all duration-300 mx-auto"
            style={{ backgroundColor: P, opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block h-[2px] w-6 rounded-full transition-all duration-300 origin-center mx-auto"
            style={{
              backgroundColor: P,
              transform: menuOpen ? "translateY(-7px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <motion.div
        initial={false}
        animate={menuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="md:hidden overflow-hidden bg-white border-t"
        style={{ borderColor: PB }}
      >
        <div className="px-6 py-5 flex flex-col gap-4">
          {[
            { id: "about",        label: "About" },
            { id: "how-it-works", label: "How It Works" },
            { id: "impact",       label: "Our Impact" },
            { id: "waitlist",     label: "Join Waitlist", primary: true },
          ].map(({ id, label, primary }) => (
            <button
              key={id}
              onClick={() => {
                setMenuOpen(false);
                setTimeout(() => {
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              }}
              className={
                primary
                  ? "rounded-full px-5 py-3 text-sm font-semibold text-white text-center mt-1"
                  : "text-left text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-1"
              }
              style={primary ? { backgroundColor: P } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">

      <motion.div
        animate={{ y: [0, -28, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${P}1a, transparent 65%)`, filter: "blur(72px)", willChange: "transform" }}
      />
      <motion.div
        animate={{ y: [0, 22, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-0 -left-48 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${PL}14, transparent 65%)`, filter: "blur(90px)", willChange: "transform" }}
      />
      <motion.div
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${P}0d, transparent 65%)`, filter: "blur(60px)", willChange: "transform" }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20 md:pt-36 md:pb-32 relative z-10 w-full">
        <motion.div initial="hidden" animate="visible" variants={stagger}>

          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold"
              style={{ borderColor: PB, color: P, backgroundColor: PP }}
            >
              🌱 India's Sustainable Marketplace
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-heading mt-7 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-gray-900 max-w-3xl"
          >
            Give it a new life.{" "}
            <span style={{ color: P }}>Earn while you do.</span>
          </motion.h1>

          <motion.p
            variants={fadeLeft}
            className="mt-6 text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed"
          >
            Vyntage connects Indian households to buy and sell pre-loved goods — turning everyday
            clutter into extra income while building a greener tomorrow, one item at a time.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <motion.a
              href="#waitlist"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full px-8 py-4 font-semibold text-white"
              style={{ backgroundColor: P }}
            >
              Join the Waitlist
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full px-8 py-4 font-semibold border-2"
              style={{ borderColor: P, color: P }}
            >
              See How It Works ↓
            </motion.a>
          </motion.div>

          <motion.p variants={fadeRight} className="mt-8 text-sm text-gray-400">
            🇮🇳 Launching soon in India — be the first to know
          </motion.p>

        </motion.div>
      </div>
    </section>
  );
}

// ─── Mission pillars ──────────────────────────────────────────────────────────
function Pillars() {
  const pillars: {
    icon: React.ReactNode; tag: string; title: string; body: string; quote: string;
    variant: Variants;
  }[] = [
    {
      icon: <LeafIcon />,
      variant: fadeLeft,
      tag: "Sustainability & Recycling",
      title: "A Greener Tomorrow",
      body: "India generates over a million tonnes of waste every year. Every item resold on Vyntage is one less in a landfill. Together we're building a circular economy — better tomorrow, cleaner earth.",
      quote: "Reduce waste, one item at a time.",
    },
    {
      icon: <GrowthIcon />,
      variant: fadeRight,
      tag: "Extra Income for Households",
      title: "Earn From Your Home",
      body: "The average Indian household has thousands of rupees worth of unused goods sitting idle. Vyntage makes it simple to list, connect, and earn — turning clutter into real money.",
      quote: "Your clutter, someone else's treasure.",
    },
  ];

  return (
    <section id="about" className="py-24" style={{ backgroundColor: PP }}>
      <div className="mx-auto max-w-6xl px-6">
        <InView>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: PL }}>
              Our Mission
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
              Two reasons to love Vyntage
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                variants={pillar.variant}
                whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(42,68,46,0.10)", transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="rounded-3xl bg-white border p-10 cursor-default"
                style={{ borderColor: PB }}
              >
                <div className="w-10 h-10 flex items-center justify-center">{pillar.icon}</div>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest" style={{ color: PL }}>
                  {pillar.tag}
                </p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900">{pillar.title}</h3>
                <p className="mt-4 text-gray-500 leading-relaxed">{pillar.body}</p>
                <p className="mt-6 text-sm font-semibold italic" style={{ color: P }}>
                  "{pillar.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: "01",
      variant: fadeLeft,
      title: "List Your Item",
      body: "Snap a photo, add a description, and set your price. Takes under 2 minutes, right from your phone.",
    },
    {
      num: "02",
      variant: fadeUp,
      title: "Chat & Close the Deal",
      body: "Every conversation happens inside the Vyntage app — safe, simple, and fully within our platform. No sharing numbers, no third-party apps.",
    },
    {
      num: "03",
      variant: fadeRight,
      title: "We Handle the Delivery",
      body: "Once a deal is done, our logistics partners take care of pickup and drop-off. You just hand it over — we do the rest.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <InView>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: PL }}>
              Simple & Fast
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">
              How Vyntage works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={step.variant}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 22 } }}
                className="relative cursor-default"
              >
                <div
                  className="text-7xl font-extrabold leading-none select-none"
                  style={{ color: P, opacity: 0.12 }}
                >
                  {step.num}
                </div>
                <h3 className="mt-3 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="mt-3 text-gray-500 leading-relaxed">{step.body}</p>
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-9 -right-5 w-10 h-px"
                    style={{ backgroundColor: PB }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}

// ─── Impact stats ─────────────────────────────────────────────────────────────
function Impact() {
  const stats: { value: string; label: string; direction: Direction }[] = [
    {
      value: "65 Million",
      direction: "left",
      label: "Tonnes of consumer & household waste generated in India every year — from discarded electronics to outgrown baby gear.",
    },
    {
      value: "₹4 Lakh Crore",
      direction: "up",
      label: "Of dead capital sitting frozen in closets, shelves, and storage rooms across urban Indian homes.",
    },
    {
      value: "< 2 min",
      direction: "right",
      label: "Time to list your first item on Vyntage and start earning.",
    },
  ];

  return (
    <section id="impact" className="py-24" style={{ backgroundColor: P }}>
      <div className="mx-auto max-w-6xl px-6">
        <InView>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-green-300">
              The Reality
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white">
              Why India needs Vyntage
            </h2>
            <p className="mt-4 text-green-100 max-w-xl mx-auto leading-relaxed">
              The scale of the problem — and the opportunity — is enormous. Vyntage is built to tackle both.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <AnimatedStat key={i} value={stat.value} label={stat.label} direction={stat.direction} />
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────
function Waitlist() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-24 bg-white">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <InView>

          <AnimatedHeading
            text="Be the first to know"
            className="font-heading text-4xl md:text-5xl font-bold text-gray-900"
          />

          <motion.p variants={fadeUp} className="mt-4 text-lg text-gray-500 leading-relaxed">
            Vyntage is launching soon in India. Drop your email and get early access when we go live.
          </motion.p>

          <motion.form variants={fadeUp} onSubmit={handleSubmit} className="mt-10">
            {submitted ? (
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="rounded-full px-8 py-4 font-semibold text-white text-lg mx-auto inline-block"
                style={{ backgroundColor: P }}
              >
                🎉 You're on the list! We'll be in touch.
              </motion.div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={loading}
                    className="flex-1 rounded-full px-6 py-4 border text-sm outline-none transition-all disabled:opacity-50"
                    style={{ borderColor: PB }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = P)}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = PB)}
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={loading ? {} : { scale: 1.04 }}
                    whileTap={loading ? {} : { scale: 0.96 }}
                    className="rounded-full px-7 py-4 text-sm font-semibold text-white whitespace-nowrap disabled:opacity-60"
                    style={{ backgroundColor: P }}
                  >
                    {loading ? "Saving…" : "Notify Me"}
                  </motion.button>
                </div>
                {error && (
                  <p className="mt-3 text-sm text-red-500">{error}</p>
                )}
              </>
            )}
          </motion.form>

          <motion.p variants={fadeUp} className="mt-5 text-sm text-gray-400">
            No spam. Just a ping when we go live. 🌱
          </motion.p>

        </InView>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText("team@vyntage.shop");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
      title="Click to copy"
    >
      {copied ? <span style={{ color: P }}>Copied!</span> : "team@vyntage.shop"}
    </button>
  );
}

function Footer() {
  return (
    <footer className="border-t py-10" style={{ borderColor: PB }}>
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-center md:text-left">
        <div>
          <p className="font-bold text-lg" style={{ color: P }}>Vyntage</p>
          <p className="text-gray-400 mt-0.5">Better tomorrow, cleaner earth.</p>
        </div>
        <CopyEmail />
        <p className="text-gray-400">© 2026 Vyntage. Made with 🌱 in India.</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Marquee />
      <Pillars />
      <HowItWorks />
      <Impact />
      <Waitlist />
      <Footer />
    </main>
  );
}
