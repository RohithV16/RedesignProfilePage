import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate } from "motion/react";
import { Mail, Phone, Linkedin, Github, MapPin, ExternalLink, Award, ChevronDown, Menu, X } from "lucide-react";

const NAV_ITEMS = ["About", "Experience", "Projects", "Certifications"];

const SKILLS = [
  "AEM Sites", "AEMaaCS", "Java", "OSGi", "Sling Models",
  "Dispatcher", "CDN", "Akamai", "React", "JUnit",
  "Dynamic Media", "Cloud Manager", "AI / ML", "RAG", "Vector Search",
  "SSR", "Coveo", "Adobe Analytics", "CI/CD", "Repository Restructuring",
];

// Skills shown in the marquee ticker (hero strip) — concise labels
const TICKER_SKILLS = [
  "AEM Sites", "AEMaaCS", "Java", "OSGi", "Dispatcher",
  "CDN", "Akamai", "React", "JUnit", "Dynamic Media",
  "Cloud Manager", "RAG", "Vector Search", "Coveo", "Adobe Analytics",
  "CI/CD", "Sling Models", "SSR", "AI / ML",
];

// --- Types ---

interface SubRole {
  period: string;
  role: string;
  client: string;
  highlights: string[];
}

interface SimpleJob {
  period: string;
  role: string;
  company: string;
  isPromotion?: false;
  highlights: string[];
}

interface PromotionJob {
  period: string;
  company: string;
  isPromotion: true;
  roles: SubRole[];
}

type Job = SimpleJob | PromotionJob;

// --- Data ---

const EXPERIENCE: Job[] = [
  {
    period: "Jul 2025 — Present",
    role: "Senior Software Engineer",
    company: "Merkle (Mandg)",
    highlights: [
      "Analytics pipeline development with RAG architecture",
      "Dispatcher configuration and CDN optimization",
      "AEM component engineering and performance tuning",
    ],
  },
  {
    period: "May 2024 — Jul 2025",
    role: "Technical Product Consultant",
    company: "Adobe",
    highlights: [
      "Led AEMaaCS cloud migration for enterprise clients",
      "CDN integration and Dynamic Media rollouts",
      "Repository restructuring and deployment validation",
    ],
  },
  {
    period: "Jan 2022 — May 2024",
    company: "Infosys",
    isPromotion: true,
    roles: [
      {
        period: "Nov 2023 — May 2024",
        role: "Senior Systems Engineer",
        client: "Auckland Council",
        highlights: [
          "Coveo enterprise search integration with custom sitemaps",
          "Server-side rendering implementation",
          "Windcave payment gateway integration in AEM forms",
        ],
      },
      {
        period: "Jan 2022 — Nov 2023",
        role: "Systems Engineer",
        client: "Telenet",
        highlights: [
          "AEM core & custom component development with Sling Models",
          "JUnit test coverage and code review leadership",
          "Cut production incidents by 35% through mentoring and standards enforcement",
        ],
      },
    ],
  },
];

const PROJECTS = [
  {
    title: "AEM RAG Chatbot",
    description: "Prototype using vector embeddings and semantic search for AEM content discovery. Queries traverse indexed content trees via a retrieval-augmented generation pipeline.",
    tags: ["Java", "RAG", "Vector Search", "AEM"],
    link: true,
  },
  {
    title: "AEM Log Inspector",
    description: "CLI tool wrapping Adobe I/O (AIO) for direct Cloud Manager log access. Reduces context-switching during incident response.",
    tags: ["CLI", "AIO", "Cloud Manager", "Node.js"],
    link: true,
  },
  {
    title: "Coveo Search Sitemap",
    description: "Custom page and asset sitemaps tailored for enterprise search indexing at Auckland Council. Handles large content volumes with incremental generation.",
    tags: ["Coveo", "AEM", "Java", "XML"],
    link: false,
  },
  {
    title: "Adobe Analytics Integration",
    description: "End-to-end event tracking across AEM core components and custom components, including datalayer wiring and tag manager configuration.",
    tags: ["Adobe Analytics", "JavaScript", "AEM", "Tag Manager"],
    link: false,
  },
];

const CERTS = [
  { level: "MASTER", title: "AEM Sites Architect", issuer: "Adobe Certified Master" },
  { level: "EXPERT", title: "AEM Sites Developer", issuer: "Adobe Certified Expert" },
  { level: "PRO", title: "AEM Developer", issuer: "Adobe Certified Professional" },
  { level: "PRO", title: "AEM Assets Developer", issuer: "Adobe Certified Professional" },
  { level: "CERT", title: "Java SE 11 Developer", issuer: "Infosys Certified" },
  { level: "CERT", title: "Java SE 8 Developer", issuer: "Infosys Certified" },
];

const NAVBAR_HEIGHT = 56;

// --- Favicon injection ---

function useFavicon() {
  useEffect(() => {
    // RV monogram favicon: black square, orange "RV" in Archivo Black style
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" fill="#0c0c0c"/>
      <rect x="0" y="28" width="32" height="2" fill="#ff4500"/>
      <text x="4" y="23" font-family="Arial Black, sans-serif" font-size="16" font-weight="900" fill="#f0ede6" letter-spacing="-1">RV</text>
      <rect x="4" y="26" width="24" height="1.5" fill="#ff4500" opacity="0.6"/>
    </svg>`;
    const encoded = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.type = "image/svg+xml";
    link.href = encoded;
    document.title = "Rohith Venati — Senior AEM Developer";
  }, []);
}

// --- Animation variants ---

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const tagVariant = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

// --- Hooks ---

function useScrollInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  return { ref, isInView };
}

function useCounter(target: number, inView: boolean, duration = 1.4) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => {
    if (target === 35) return `${Math.round(v)}%`;
    if (target === 4) return v >= 4 ? "4+" : Math.round(v).toString();
    return Math.round(v).toString();
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, target, { duration, ease: "easeOut" });
    return controls.stop;
  }, [inView, target, duration, motionVal]);

  return rounded;
}

// --- Skills Ticker (infinite marquee) ---

function SkillsTicker() {
  // Duplicate list so the loop looks seamless
  const items = [...TICKER_SKILLS, ...TICKER_SKILLS];

  return (
    <div className="w-full border-y border-border overflow-hidden py-3 bg-card select-none">
      <motion.div
        className="flex gap-8 whitespace-nowrap w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((skill, i) => (
          <span key={i} className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            <span className="text-primary text-base leading-none select-none">·</span>
            {skill}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// --- NavBar ---

function NavBar({ active, onNav }: { active: string; onNav: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const el = navRefs.current[active];
    if (el) {
      const parent = el.parentElement!.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setIndicatorStyle({ left: rect.left - parent.left, width: rect.width });
    }
  }, [active]);

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase"
          >
            rohith<span className="text-primary">.</span>venati
          </motion.span>

          {/* Desktop nav */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="hidden md:flex items-center gap-6 lg:gap-8 relative"
          >
            <motion.div
              className="absolute bottom-[-1px] h-[2px] bg-primary"
              animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                ref={(el) => { navRefs.current[item] = el; }}
                onClick={() => onNav(item)}
                className={`font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-150 pb-1 ${
                  active === item ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
            <a
              href="mailto:rohithv16@gmail.com"
              className="font-mono text-xs tracking-[0.15em] uppercase bg-primary text-primary-foreground px-4 py-2 hover:opacity-80 transition-opacity whitespace-nowrap"
            >
              Contact
            </a>
          </motion.div>

          <button
            className="md:hidden text-foreground p-1 -mr-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.18 }}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-14"
          >
            <div className="flex flex-col gap-1 px-6 py-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3, ease: "easeOut" }}
                  onClick={() => { onNav(item); setOpen(false); }}
                  className={`font-mono text-sm tracking-[0.15em] uppercase text-left py-4 border-b border-border transition-colors ${
                    active === item ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item}
                </motion.button>
              ))}
              <motion.a
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.28, duration: 0.3 }}
                href="mailto:rohithv16@gmail.com"
                onClick={() => setOpen(false)}
                className="font-mono text-sm tracking-[0.15em] uppercase bg-primary text-primary-foreground px-5 py-4 mt-6 text-center hover:opacity-80 transition-opacity"
              >
                Contact
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- Section label ---

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8 sm:mb-10">
      <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary whitespace-nowrap">{children}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

// --- Stat counter cell ---

function StatCell({ val, label, inView }: { val: string; label: string; inView: boolean }) {
  const numeric = parseInt(val.replace(/\D/g, ""), 10);
  const counted = useCounter(numeric, inView);

  return (
    <div className="bg-card flex-1 md:w-28 py-4 sm:py-5 text-center">
      <motion.div
        className="font-black text-primary text-xl sm:text-2xl tabular-nums"
        style={{ fontFamily: "'Archivo Black', sans-serif" }}
      >
        {counted}
      </motion.div>
      <div className="font-mono text-[9px] sm:text-xs text-muted-foreground mt-1 tracking-widest uppercase">
        {label}
      </div>
    </div>
  );
}

// --- Hero ---

function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.5 });

  return (
    <section id="hero" className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:grid md:grid-cols-[1fr_auto] gap-8 md:gap-10 md:items-end">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.p
            variants={fadeUp}
            className="font-mono text-[10px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-muted-foreground mb-3 sm:mb-4"
          >
            Senior AEM Developer — Adobe Certified Master
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-black text-foreground leading-none tracking-tight mb-4 sm:mb-6"
            style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(2.6rem, 12vw, 7rem)" }}
          >
            Rohith<br />
            <span className="text-primary">Venati</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-muted-foreground max-w-xl leading-relaxed text-sm sm:text-base"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Four years building enterprise content management systems at Adobe, Merkle, and Infosys.
            Specializing in AEMaaCS architecture, cloud migration, and performance-critical backend engineering.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-x-5 gap-y-3 mt-6 sm:mt-8"
          >
            <a href="mailto:rohithv16@gmail.com" className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Mail size={13} /> rohithv16@gmail.com
            </a>
            <a href="tel:+916300331842" className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Phone size={13} /> +91 63003 31842
            </a>
            <a href="https://linkedin.com/in/rohithvenati1605" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={13} /> LinkedIn
            </a>
            <a href="https://github.com/RohithV16" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Github size={13} /> GitHub
            </a>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <MapPin size={13} /> Chennai, India
            </span>
          </motion.div>
        </motion.div>

        {/* Stat grid */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-4 md:grid-cols-2 gap-px bg-border border border-border w-full md:w-auto md:self-end"
        >
          {[
            { val: "4+", label: "Years" },
            { val: "3", label: "Companies" },
            { val: "35%", label: "Incidents" },
            { val: "6", label: "Certs" },
          ].map(({ val, label }) => (
            <StatCell key={label} val={val} label={label} inView={statsInView} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// --- Skills section ---

function About() {
  const { ref, isInView } = useScrollInView(0.1);

  return (
    <motion.section
      id="About"
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-border"
    >
      <SectionLabel>01 / Skills</SectionLabel>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-wrap gap-2"
      >
        {SKILLS.map((skill) => (
          <motion.span
            key={skill}
            variants={tagVariant}
            whileHover={{ scale: 1.06, borderColor: "var(--primary)", color: "var(--primary)" }}
            className="font-mono text-[11px] sm:text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 border border-border text-muted-foreground cursor-default"
            style={{ display: "inline-block" }}
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </motion.section>
  );
}

// --- Experience ---

function Experience() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const { ref, isInView } = useScrollInView(0.1);

  return (
    <motion.section
      id="Experience"
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-border"
    >
      <SectionLabel>02 / Experience</SectionLabel>
      <div className="divide-y divide-border">
        {EXPERIENCE.map((job, i) => {
          const isOpen = expanded === i;
          const isPromo = job.isPromotion === true;
          const headerLabel = isPromo
            ? `${(job as PromotionJob).roles[1].role} → ${(job as PromotionJob).roles[0].role}`
            : (job as SimpleJob).role;

          return (
            <div key={i} className="group">
              <button
                className="w-full py-5 sm:py-6 flex items-start justify-between gap-3 text-left"
                onClick={() => setExpanded(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="font-mono text-[10px] sm:text-xs text-muted-foreground">{job.period}</span>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-foreground font-medium text-sm sm:text-base" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      {headerLabel}
                    </span>
                    <span className="font-mono text-xs text-primary">{job.company}</span>
                  </div>
                </div>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1"
                >
                  <ChevronDown size={15} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    {!isPromo && (
                      <ul className="pb-5 sm:pb-6 space-y-2">
                        {(job as SimpleJob).highlights.map((h, j) => (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.06, duration: 0.28 }}
                            className="flex items-start gap-2.5 font-mono text-xs text-muted-foreground"
                          >
                            <span className="text-primary mt-0.5 shrink-0">→</span>
                            {h}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                    {isPromo && (
                      <div className="pb-5 sm:pb-6 space-y-5">
                        {(job as PromotionJob).roles.map((r, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.1, duration: 0.3 }}
                            className="relative pl-4 border-l-2 border-border"
                          >
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="font-mono text-xs text-foreground font-medium">{r.role}</span>
                              {j === 0 && (
                                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest uppercase px-2 py-0.5 border border-primary text-primary">
                                  Promoted
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-muted-foreground">{r.period}</span>
                              <span className="font-mono text-[10px] text-primary">· {r.client}</span>
                            </div>
                            <ul className="space-y-1.5">
                              {r.highlights.map((h, k) => (
                                <li key={k} className="flex items-start gap-2.5 font-mono text-xs text-muted-foreground">
                                  <span className="text-primary mt-0.5 shrink-0">→</span>
                                  {h}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

// --- Projects ---

function Projects() {
  const { ref, isInView } = useScrollInView(0.1);

  return (
    <motion.section
      id="Projects"
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-border"
    >
      <SectionLabel>03 / Projects</SectionLabel>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border"
      >
        {PROJECTS.map((proj, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ backgroundColor: "var(--secondary)" }}
            transition={{ duration: 0.2 }}
            className="bg-card p-5 sm:p-7 flex flex-col gap-3 sm:gap-4 group"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-foreground font-medium text-base sm:text-lg leading-snug" style={{ fontFamily: "'Archivo', sans-serif" }}>
                {proj.title}
              </h3>
              {proj.link && (
                <motion.a
                  href="https://github.com/RohithV16"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2, color: "var(--primary)" }}
                  className="text-muted-foreground shrink-0 mt-0.5"
                >
                  <ExternalLink size={13} />
                </motion.a>
              )}
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed flex-1">{proj.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {proj.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] px-2 py-0.5 border border-border text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// --- Certifications ---

function Certifications() {
  const { ref, isInView } = useScrollInView(0.1);
  const levelColor: Record<string, string> = {
    MASTER: "text-primary border-primary",
    EXPERT: "text-amber-400 border-amber-400",
    PRO: "text-emerald-400 border-emerald-400",
    CERT: "text-muted-foreground border-border",
  };

  return (
    <motion.section
      id="Certifications"
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-border"
    >
      <SectionLabel>04 / Certifications</SectionLabel>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border"
      >
        {CERTS.map((cert, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ backgroundColor: "var(--secondary)" }}
            transition={{ duration: 0.2 }}
            className="bg-card p-5 sm:p-6 flex flex-col gap-3"
          >
            <div className={`font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase border self-start px-2 py-0.5 ${levelColor[cert.level]}`}>
              {cert.level}
            </div>
            <Award size={16} className="text-muted-foreground" />
            <div>
              <p className="text-foreground text-sm font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>{cert.title}</p>
              <p className="font-mono text-xs text-muted-foreground mt-1">{cert.issuer}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// --- Education ---

function Education() {
  const { ref, isInView } = useScrollInView();

  return (
    <motion.section
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-border"
    >
      <SectionLabel>05 / Education</SectionLabel>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 md:gap-8">
        <span className="font-mono text-xs text-muted-foreground sm:w-40 shrink-0">2017 — 2021</span>
        <div className="flex-1">
          <p className="text-foreground font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>
            Bachelor of Mechanical Engineering
          </p>
          <p className="font-mono text-xs text-primary mt-0.5">R.M.K Engineering College, Chennai</p>
        </div>
        <div className="font-mono text-xs text-muted-foreground border border-border px-3 py-1 self-start sm:self-auto shrink-0">
          GPA 8.0 / 10
        </div>
      </div>
    </motion.section>
  );
}

// --- Footer ---

function Footer() {
  return (
    <footer className="border-t border-border py-8 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-muted-foreground">© 2025 Rohith Venati</span>
        <div className="flex items-center gap-5 sm:gap-6">
          <a href="mailto:rohithv16@gmail.com" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors hidden sm:inline">
            rohithv16@gmail.com
          </a>
          <a href="https://linkedin.com/in/rohithvenati1605" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin size={15} />
          </a>
          <a href="https://github.com/RohithV16" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
}

// --- App ---

export default function App() {
  const [active, setActive] = useState("About");
  const scrollingTo = useRef<string | null>(null);

  useFavicon();

  useEffect(() => {
    const handler = () => {
      if (scrollingTo.current) return;
      const offset = NAVBAR_HEIGHT + 32;
      for (const id of [...NAV_ITEMS].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          setActive(id);
          return;
        }
      }
      setActive("About");
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    setActive(id);
    scrollingTo.current = id;
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 16;
      window.scrollTo({ top, behavior: "smooth" });
    }
    setTimeout(() => { scrollingTo.current = null; }, 700);
  };

  return (
    <div className="bg-background text-foreground min-h-screen" style={{ fontFamily: "'Archivo', sans-serif" }}>
      <NavBar active={active} onNav={scrollTo} />
      <main>
        <Hero />
        {/* Skills ticker strip — lives between hero and sections */}
        <SkillsTicker />
        <About />
        <Experience />
        <Projects />
        <Certifications />
        <Education />
      </main>
      <Footer />
    </div>
  );
}
