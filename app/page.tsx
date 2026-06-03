"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

// ─── Easing ───────────────────────────────────────────────────────────────────
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Brand tokens ────────────────────────────────────────────────────────────
const P  = "#2A442E";   // primary green
const PL = "#3D6142";   // lighter green
const PP = "#F3F9F4";   // pale green tint
const PB = "#D4E8D8";   // border green

// ─── Animation presets ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
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

/** Wraps children in a stagger container that triggers when scrolled into view */
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

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const scrolled = useScrolled();
  return (
    <motion.nav
      initial={{ y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <a href="#" className="font-bold text-xl tracking-tight" style={{ color: P }}>
          Vyntage
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <a href="#about"        className="hover:text-gray-900 transition-colors">About</a>
          <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#impact"       className="hover:text-gray-900 transition-colors">Our Impact</a>
        </div>

        <a
          href="#waitlist"
          className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: P }}
        >
          Join Waitlist
        </a>
      </div>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Soft background blobs */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${P}1a, transparent 65%)`, filter: "blur(72px)" }}
      />
      <div
        className="absolute bottom-0 -left-48 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${PL}12, transparent 65%)`, filter: "blur(90px)" }}
      />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-20 relative z-10 w-full">
        <motion.div initial="hidden" animate="visible" variants={stagger}>

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold"
              style={{ borderColor: PB, color: P, backgroundColor: PP }}
            >
              🌱 India's Sustainable Marketplace
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="font-heading mt-7 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-gray-900 max-w-3xl"
          >
            Give it a new life.{" "}
            <span style={{ color: P }}>Earn while you do.</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed"
          >
            Vyntage connects Indian households to buy and sell pre-loved goods — turning everyday
            clutter into extra income while building a greener tomorrow, one item at a time.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-4">
            <a
              href="#waitlist"
              className="rounded-full px-8 py-4 font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95"
              style={{ backgroundColor: P }}
            >
              Join the Waitlist
            </a>
            <a
              href="#how-it-works"
              className="rounded-full px-8 py-4 font-semibold border-2 transition-all hover:bg-gray-50 active:scale-95"
              style={{ borderColor: P, color: P }}
            >
              See How It Works ↓
            </a>
          </motion.div>

          {/* Launch note */}
          <motion.p variants={fadeUp} className="mt-8 text-sm text-gray-400">
            🇮🇳 Launching soon in India — be the first to know
          </motion.p>

        </motion.div>
      </div>
    </section>
  );
}

// ─── Mission pillars ──────────────────────────────────────────────────────────
function Pillars() {
  const pillars = [
    {
      icon: "🌍",
      tag: "Sustainability & Recycling",
      title: "A Greener Tomorrow",
      body: "India generates over a million tonnes of waste every year. Every item resold on Vyntage is one less in a landfill. Together we're building a circular economy — better tomorrow, cleaner earth.",
      quote: "Reduce waste, one item at a time.",
    },
    {
      icon: "💰",
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
                variants={fadeUp}
                className="rounded-3xl bg-white border p-10 hover:shadow-lg transition-shadow duration-300"
                style={{ borderColor: PB }}
              >
                <span className="text-5xl">{pillar.icon}</span>
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
      title: "List Your Item",
      body: "Snap a photo, add a description, and set your price. Takes under 2 minutes, right from your phone.",
    },
    {
      num: "02",
      title: "Chat & Close the Deal",
      body: "Every conversation happens inside the Vyntage app — safe, simple, and fully within our platform. No sharing numbers, no third-party apps.",
    },
    {
      num: "03",
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
              <motion.div key={i} variants={fadeUp} className="relative">
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
  const stats = [
    { value: "Millions",  label: "Of tonnes of textile & household waste generated in India every year" },
    { value: "Hidden",    label: "Value sitting unused in closets, shelves, and storage rooms across Indian homes" },
    { value: "< 2 min",  label: "Time to list your first item on Vyntage and start earning" },
  ];

  return (
    <section id="impact" className="py-24" style={{ backgroundColor: P }}>
      <div className="mx-auto max-w-6xl px-6">
        <InView>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-3 text-green-300">
              The Reality
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Why India needs Vyntage
            </h2>
            <p className="mt-4 text-green-100 max-w-xl mx-auto leading-relaxed">
              The scale of the problem — and the opportunity — is enormous. Vyntage is built to tackle both.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl p-8 text-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                <div className="text-5xl font-extrabold text-white">{stat.value}</div>
                <p className="mt-4 text-green-100 text-sm leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </InView>
      </div>
    </section>
  );
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────
function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="waitlist" className="py-24 bg-white">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <InView>
          <motion.div variants={fadeUp}>
            <span className="text-5xl">🚀</span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
              Be the first to know
            </h2>
            <p className="mt-4 text-lg text-gray-500 leading-relaxed">
              Vyntage is launching soon in India. Drop your email and get early access when we go live.
            </p>
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="mt-10"
          >
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
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 rounded-full px-6 py-4 border text-sm outline-none transition-all"
                  style={{ borderColor: PB }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = P)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = PB)}
                />
                <button
                  type="submit"
                  className="rounded-full px-7 py-4 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105 active:scale-95 whitespace-nowrap"
                  style={{ backgroundColor: P }}
                >
                  Notify Me
                </button>
              </div>
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
function Footer() {
  return (
    <footer className="border-t py-10" style={{ borderColor: PB }}>
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
        <div>
          <p className="font-bold text-lg" style={{ color: P }}>Vyntage</p>
          <p className="text-gray-400 mt-0.5">Better tomorrow, cleaner earth.</p>
        </div>

        <div className="flex gap-6 text-gray-400">
          <a href="#" className="hover:text-gray-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-600 transition-colors">Terms</a>
          <a href="mailto:team@vyntage.shop" className="hover:text-gray-600 transition-colors">Contact</a>
        </div>

        <p className="text-gray-400">© 2026 Vyntage. Made with 🌱 in India.</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Pillars />
      <HowItWorks />
      <Impact />
      <Waitlist />
      <Footer />
    </main>
  );
}
