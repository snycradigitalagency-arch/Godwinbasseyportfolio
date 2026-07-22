import { FadeUp } from "@/components/motion/FadeUp";

const STACK = [
  "TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion",
  "Supabase", "PostgreSQL", "Node.js", "Figma", "Adobe Creative Suite",
];

export function TechStack() {
  return (
    <section id="stack" className="container-page py-24 md:py-32">
      <FadeUp>
        <span className="eyebrow">Tech Stack</span>
        <h2 className="mt-4 max-w-2xl font-display text-section text-text-primary">
          Tools I build with.
        </h2>
      </FadeUp>

      <FadeUp delay={0.15} className="mt-14 flex flex-wrap gap-3">
        {STACK.map((tool) => (
          <span
            key={tool}
            className="rounded-full border border-border px-5 py-2 text-sm text-text-secondary transition-colors duration-300 hover:border-accent hover:text-text-primary"
          >
            {tool}
          </span>
        ))}
      </FadeUp>
    </section>
  );
}
