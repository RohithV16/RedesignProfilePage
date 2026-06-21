import { useState, useEffect, useRef } from "react";
import { Mail, Phone, Linkedin, Github, MapPin, ExternalLink, Award, ChevronDown, ChevronUp } from "lucide-react";

const NAV_ITEMS = ["About", "Experience", "Projects", "Certifications"];

const SKILLS = [
  "AEM Sites", "AEMaaCS", "Java", "OSGi", "Sling Models",
  "Dispatcher", "CDN", "Akamai", "React", "JUnit",
  "Dynamic Media", "Cloud Manager", "AI / ML", "RAG", "Vector Search",
  "SSR", "Coveo", "Adobe Analytics", "CI/CD", "Repository Restructuring",
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
  roles: SubRole[]; // ordered newest → oldest
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

// --- Components ---

function NavBar({ active, onNav }: { active: string; onNav: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          rohith<span className="text-primary">.</span>venati
        </span>
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => onNav(item)}
              className={`font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-150 ${
                active === item ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
          <a
            href="mailto:rohithv16@gmail.com"
            className="font-mono text-xs tracking-[0.15em] uppercase bg-primary text-primary-foreground px-4 py-2 hover:opacity-80 transition-opacity"
          >
            Contact
          </a>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <button
              key={item}
              onClick={() => { onNav(item); setOpen(false); }}
              className="font-mono text-xs tracking-[0.15em] uppercase text-left text-muted-foreground hover:text-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <span className="font-mono text-xs tracking-[0.25em] uppercase text-primary">{children}</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function Hero() {
  return (
    <section id="hero" className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-end">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
            Senior AEM Developer — Adobe Certified Master
          </p>
          <h1
            className="font-black text-foreground leading-none tracking-tight mb-6"
            style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "clamp(3rem, 10vw, 7rem)" }}
          >
            Rohith<br />
            <span className="text-primary">Venati</span>
          </h1>
          <p className="text-muted-foreground max-w-xl leading-relaxed" style={{ fontFamily: "'Archivo', sans-serif" }}>
            Four years building enterprise content management systems at Adobe, Merkle, and Infosys.
            Specializing in AEMaaCS architecture, cloud migration, and performance-critical backend engineering.
          </p>
          <div className="flex flex-wrap items-center gap-6 mt-8">
            <a href="mailto:rohithv16@gmail.com" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Mail size={14} /> rohithv16@gmail.com
            </a>
            <a href="tel:+916300331842" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Phone size={14} /> +91 63003 31842
            </a>
            <a href="https://linkedin.com/in/rohithvenati1605" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={14} /> LinkedIn
            </a>
            <a href="https://github.com/RohithV16" target="_blank" rel="noreferrer" className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
              <Github size={14} /> GitHub
            </a>
            <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <MapPin size={14} /> Chennai, India
            </span>
          </div>
        </div>
        {/* stat block — fixed cell widths so labels never overflow */}
        <div className="grid grid-cols-2 gap-px bg-border border border-border self-end">
          {[
            { val: "4+", label: "Years" },
            { val: "3", label: "Companies" },
            { val: "35%", label: "Incidents" },
            { val: "6", label: "Certs" },
          ].map(({ val, label }) => (
            <div key={label} className="bg-card w-28 py-5 text-center">
              <div className="font-black text-primary text-2xl" style={{ fontFamily: "'Archivo Black', sans-serif" }}>{val}</div>
              <div className="font-mono text-xs text-muted-foreground mt-1 tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="About" className="py-16 px-6 max-w-6xl mx-auto border-t border-border">
      <SectionLabel>01 / Skills</SectionLabel>
      <div className="flex flex-wrap gap-2">
        {SKILLS.map((skill) => (
          <span
            key={skill}
            className="font-mono text-xs px-3 py-1.5 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-default"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  // null = all collapsed on load (fixes chevron mismatch)
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="Experience" className="py-16 px-6 max-w-6xl mx-auto border-t border-border">
      <SectionLabel>02 / Experience</SectionLabel>
      <div className="divide-y divide-border">
        {EXPERIENCE.map((job, i) => {
          const isOpen = expanded === i;
          const isPromo = job.isPromotion === true;
          const headerLabel = isPromo
            ? `${job.roles[1].role} → ${job.roles[0].role}`
            : (job as SimpleJob).role;

          return (
            <div key={i} className="group">
              <button
                className="w-full py-6 flex items-start md:items-center justify-between gap-4 text-left"
                onClick={() => setExpanded(isOpen ? null : i)}
                aria-expanded={isOpen}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 flex-1">
                  <span className="font-mono text-xs text-muted-foreground w-44 shrink-0">{job.period}</span>
                  <div>
                    <span className="text-foreground font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>
                      {headerLabel}
                    </span>
                    <span className="text-muted-foreground mx-2 hidden md:inline">—</span>
                    <span className="font-mono text-xs text-primary block md:inline mt-0.5 md:mt-0">{job.company}</span>
                  </div>
                </div>
                <span className="text-muted-foreground group-hover:text-primary transition-colors shrink-0">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              </button>

              {isOpen && !isPromo && (
                <ul className="pb-6 pl-0 md:pl-52 space-y-2">
                  {(job as SimpleJob).highlights.map((h, j) => (
                    <li key={j} className="flex items-start gap-3 font-mono text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5 shrink-0">→</span>
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {isOpen && isPromo && (
                <div className="pb-6 pl-0 md:pl-52 space-y-6">
                  {job.roles.map((r, j) => (
                    <div key={j} className="relative pl-5 border-l border-border">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-mono text-xs text-foreground font-medium">{r.role}</span>
                        {/* Promoted badge only on the newer (index 0) role */}
                        {j === 0 && (
                          <span className="font-mono text-[10px] tracking-widest uppercase px-2 py-0.5 border border-primary text-primary">
                            Promoted
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-muted-foreground">{r.period}</span>
                        <span className="font-mono text-[10px] text-primary">· {r.client}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {r.highlights.map((h, k) => (
                          <li key={k} className="flex items-start gap-3 font-mono text-xs text-muted-foreground">
                            <span className="text-primary mt-0.5 shrink-0">→</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="Projects" className="py-16 px-6 max-w-6xl mx-auto border-t border-border">
      <SectionLabel>03 / Projects</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
        {PROJECTS.map((proj, i) => (
          <div key={i} className="bg-card p-7 flex flex-col gap-4 hover:bg-secondary transition-colors group">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="text-foreground font-medium text-lg leading-snug"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {proj.title}
              </h3>
              {proj.link && (
                <a
                  href="https://github.com/RohithV16"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1"
                >
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed flex-1">
              {proj.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {proj.tags.map((tag) => (
                <span key={tag} className="font-mono text-[10px] px-2 py-0.5 border border-border text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  const levelColor: Record<string, string> = {
    MASTER: "text-primary border-primary",
    EXPERT: "text-amber-400 border-amber-400",
    PRO: "text-emerald-400 border-emerald-400",
    CERT: "text-muted-foreground border-border",
  };
  return (
    <section id="Certifications" className="py-16 px-6 max-w-6xl mx-auto border-t border-border">
      <SectionLabel>04 / Certifications</SectionLabel>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border border border-border">
        {CERTS.map((cert, i) => (
          <div key={i} className="bg-card p-6 flex flex-col gap-3 hover:bg-secondary transition-colors">
            <div className={`font-mono text-[10px] tracking-[0.2em] uppercase border self-start px-2 py-0.5 ${levelColor[cert.level]}`}>
              {cert.level}
            </div>
            <Award size={18} className="text-muted-foreground" />
            <div>
              <p className="text-foreground text-sm font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>
                {cert.title}
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-1">{cert.issuer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto border-t border-border">
      <SectionLabel>05 / Education</SectionLabel>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
        <span className="font-mono text-xs text-muted-foreground w-44 shrink-0">2017 — 2021</span>
        <div>
          <p className="text-foreground font-medium" style={{ fontFamily: "'Archivo', sans-serif" }}>
            Bachelor of Mechanical Engineering
          </p>
          <p className="font-mono text-xs text-primary mt-0.5">R.M.K Engineering College, Chennai</p>
        </div>
        <div className="md:ml-auto font-mono text-xs text-muted-foreground border border-border px-3 py-1 self-start md:self-auto">
          GPA 8.0 / 10
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-xs text-muted-foreground">© 2025 Rohith Venati</span>
        <div className="flex items-center gap-6">
          <a href="mailto:rohithv16@gmail.com" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
            rohithv16@gmail.com
          </a>
          <a href="https://linkedin.com/in/rohithvenati1605" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin size={14} />
          </a>
          <a href="https://github.com/RohithV16" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [active, setActive] = useState("About");
  const scrollingTo = useRef<string | null>(null);

  // Scroll spy — updates active nav based on scroll position
  useEffect(() => {
    const handler = () => {
      // Suppress spy while a programmatic scroll is in flight
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

    // Clear the lock after the smooth scroll settles (~700ms)
    setTimeout(() => { scrollingTo.current = null; }, 700);
  };

  return (
    <div className="bg-background text-foreground min-h-screen" style={{ fontFamily: "'Archivo', sans-serif" }}>
      <NavBar active={active} onNav={scrollTo} />
      <main>
        <Hero />
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
