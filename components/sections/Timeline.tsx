import { FadeUp } from "@/components/motion/FadeUp";
import { Badge } from "@/components/ui/Badge";
import { getUnifiedTimeline } from "@/lib/queries/timeline";

function formatRange(start: string, end: string | null) {
  const startYear = new Date(start).getFullYear();
  const endYear = end ? new Date(end).getFullYear() : "Present";
  return `${startYear} — ${endYear}`;
}

export async function Timeline() {
  const items = await getUnifiedTimeline();
  if (items.length === 0) return null;

  return (
    <section id="experience" className="container-page py-24 md:py-32">
      <FadeUp>
        <span className="eyebrow">Experience & Education</span>
        <h2 className="mt-4 max-w-2xl font-display text-section text-text-primary">
          The path here.
        </h2>
      </FadeUp>

      <div className="mt-16 flex flex-col divide-y divide-border border-t border-border">
        {items.map((item, i) => (
          <FadeUp
            key={item.id}
            delay={0.03 * i}
            className="flex flex-col gap-2 py-8 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
          >
            <div className="sm:w-1/4">
              <p className="text-sm text-text-muted">{formatRange(item.start_date, item.end_date)}</p>
              <Badge tone="neutral" className="mt-2">
                {item.type === "experience" ? "Experience" : "Education"}
              </Badge>
            </div>
            <div className="sm:w-3/4">
              <h3 className="font-display text-xl normal-case tracking-normal text-text-primary">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-text-muted">{item.subtitle}</p>
              {item.description && (
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              )}
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
