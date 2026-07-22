import { FadeUp } from "@/components/motion/FadeUp";
import { getServices } from "@/lib/queries/content";

export async function Services() {
  const services = await getServices();
  if (services.length === 0) return null;

  return (
    <section id="services" className="border-t border-border py-24 md:py-32">
      <div className="container-page">
        <FadeUp>
          <span className="eyebrow">Services</span>
          <h2 className="mt-4 max-w-2xl font-display text-section text-text-primary">
            How we can work together.
          </h2>
        </FadeUp>

        <div className="mt-16 flex flex-col divide-y divide-border border-t border-border">
          {services.map((service, i) => (
            <FadeUp
              key={service.id}
              delay={0.03 * i}
              className="flex flex-col gap-2 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
            >
              <h3 className="font-display text-2xl normal-case tracking-normal text-text-primary sm:w-1/3">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted sm:w-1/2">
                {service.description}
              </p>
              {service.price_note && (
                <span className="text-sm text-text-secondary sm:w-1/6 sm:text-right">
                  {service.price_note}
                </span>
              )}
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
