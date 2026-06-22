# Animation Ideas for Rohith Venati Portfolio

## Context
The portfolio is a brutalist dark-themed React site with CSS-only transitions (hover color changes, smooth scroll). The `motion` library (v12.23.24) is installed but unused — this is the primary tool to leverage. The goal is to add purposeful animation that reinforces the technical, sharp identity of the design without feeling gratuitous.

---

## Idea 1 — Scroll-triggered section entrances (high impact, low noise)
**What:** Each section fades + slides up into view as you scroll down to it.  
**How:** Wrap each section in a `motion.div` with `initial={{ opacity: 0, y: 32 }}` and `whileInView={{ opacity: 1, y: 0 }}`. Use `viewport={{ once: true }}` so it only fires once per page load.  
**Why it works:** Gives the page a sense of weight and progression without being distracting. Standard on quality portfolios.

---

## Idea 2 — Staggered hero text reveal (strong first impression)
**What:** On page load, the eyebrow label, name, bio, and contact links each animate in one after another with a short delay between them.  
**How:** Use `motion.p`, `motion.h1`, `motion.div` with staggered `delay` values (0, 0.1, 0.2, 0.3s). Slide up + fade from `y: 20` to `y: 0`.  
**Why it works:** The hero is the first thing visitors see. A clean staggered entrance makes the name land with presence.

---

## Idea 3 — Stat counter animation (memorable micro-interaction)
**What:** The 4 stat values in the hero grid (4+, 3, 35%, 6) count up from 0 to their target value when they enter the viewport.  
**How:** Use `useMotionValue` + `useTransform` from `motion/react`, or a simple `useEffect` with a `requestAnimationFrame` counter loop. Trigger on scroll-into-view.  
**Why it works:** Numbers counting up are attention-grabbing and make the achievements feel earned rather than static.

---

## Idea 4 — Experience accordion with smooth expand/collapse (polish)
**What:** When an accordion row opens, the content animates in height from 0 to full rather than snapping open instantly.  
**How:** Wrap the expanded content in `motion.div` with `initial={{ height: 0, opacity: 0 }}` and `animate={{ height: "auto", opacity: 1 }}`. Use `AnimatePresence` from `motion/react` to handle unmount animation.  
**Why it works:** The accordion is the most-used interactive element — smooth height animation makes it feel refined.

---

## Idea 5 — Skill tag stagger on scroll (texture + energy)
**What:** The 20 skill tags in the Skills section cascade in one-by-one when the section scrolls into view.  
**How:** Use `motion.span` with `staggerChildren` in a `variants` config on the container. Each tag animates from `opacity: 0, scale: 0.85` to `opacity: 1, scale: 1`.  
**Why it works:** A wall of static tags is easy to ignore. A staggered reveal makes visitors actually read them.

---

## Idea 6 — Navbar underline / indicator slide (navigation feedback)
**What:** The active nav link has an orange underline that slides horizontally to the new item when you click between sections.  
**How:** Use `motion.div` as a positioned underline element. Track the active item's position with a `ref` and animate `x` and `width` with `motion` layout animations.  
**Why it works:** Subtly communicates which section you're in without a jarring color jump.

---

## Recommendation
Start with **Ideas 1 + 2 + 4** — they cover the three most impactful moments (first load, scrolling, interaction) with the least visual noise. Add **Idea 3** (stat counters) for the wow moment, and **Idea 5** (skill stagger) for texture. **Idea 6** is a nice-to-have if time allows.

## Files to modify
- `src/app/App.tsx` — all animation changes live here
- No new files needed; no config changes required

## Verification
- Load the page fresh and confirm hero stagger fires on mount
- Scroll down slowly to confirm each section entrance fires once
- Open/close Experience accordion multiple times to confirm smooth height animation
- Confirm no layout shift or jank on mobile (test at 375px width)
