import { FadeUp } from "@/components/motion/FadeUp";

const EXPERTISE = [
  { title: "Full Stack Development", description: "React, Next.js, TypeScript, scalable backend architecture." },
  { title: "Website Design", description: "Premium, conversion-focused interfaces built to perform." },
  { title: "Graphic Design", description: "Visual systems that hold up across every touchpoint." },
  { title: "Brand Identity", description: "Naming, voice, and visual identity for products and people." },
  { title: "AI Automation", description: "Workflow and process automation powered by modern AI tooling." },
  { title: "Social Media Management", description: "Content systems that build audience with intention." },
  { title: "SEO", description: "Technical and content SEO built into the architecture, not bolted on." },
  { title: "Content Strategy", description: "Editorial planning that positions expertise, not just output." },
  { title: "Digital Consulting", description: "Strategic guidance for teams building their next digital product." },
];

export function ExpertiseGrid() {
  return (
    <section id="expertise" className="border-t border-border bg-bg-secondary py-24 md:py-32">
      <div className="container-page">
        <FadeUp>
          <span className="eyebrow">Core Expertise</span>
          <h2 className="mt-4 max-w-2xl font-display text-section text-text-primary">
            Nine disciplines,
            <br />
            one standard.
          </h2>
        </FadeUp>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((item, i) => (
            <FadeUp key={item.title} delay={0.05 * (i % 3)} className="bg-card p-8 transition-colors duration-300 hover:bg-[#1D2027]">
              <h3 className="font-display text-xl normal-case tracking-normal text-text-primary">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {item.description}
              </p>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
