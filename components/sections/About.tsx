import { FadeUp } from "@/components/motion/FadeUp";
import { getAchievements } from "@/lib/queries/content";

// Static fallback so the section still reads well before achievements
// have been seeded in Supabase.
const FALLBACK_HIGHLIGHTS = [
  { id: "fallback-1", value: "25+", suffix: "", title: "Projects completed" },
  { id: "fallback-2", value: "5+", suffix: "", title: "Web applications shipped" },
  { id: "fallback-3", value: "100%", suffix: "", title: "Client satisfaction" },
];

export async function About() {
  const achievements = await getAchievements();
  const highlights = achievements.length > 0 ? achievements : FALLBACK_HIGHLIGHTS;

  return (
    <section id="about" className="container-page py-24 md:py-32">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <FadeUp className="md:col-span-4">
          <span className="eyebrow">About</span>
          <h2 className="mt-4 font-display text-section text-text-primary">
            Precision,
            <br />
            by design.
          </h2>
        </FadeUp>

        <div className="md:col-span-8">
          <FadeUp delay={0.1}>
            <p className="text-lg leading-relaxed text-text-secondary md:text-xl">
              I work at the intersection of engineering and design —
              building products that are as considered in their code as
              they are in their visual language. My focus is premium
              digital experiences: fast, accessible, and unmistakably
              intentional.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="mt-6 text-base leading-relaxed text-text-muted">
              From full-stack applications to brand identity systems and
              AI-driven automation, every engagement starts with the same
              question: what does this actually need to say, and how does
              it say it best?
            </p>
          </FadeUp>

          <FadeUp delay={0.3} className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {highlights.map((item) => (
              <div key={item.id}>
                <p className="font-display text-3xl text-accent md:text-4xl">
                  {item.value}
                  {"suffix" in item ? item.suffix : ""}
                </p>
                <p className="mt-1 text-sm text-text-muted">{item.title}</p>
              </div>
            ))}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
