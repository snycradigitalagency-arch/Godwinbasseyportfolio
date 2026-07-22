import { FadeUp } from "@/components/motion/FadeUp";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { getFeaturedTestimonials } from "@/lib/queries/content";

export async function Testimonials() {
  const testimonials = await getFeaturedTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-border bg-bg-secondary py-24 md:py-32">
      <div className="container-page">
        <FadeUp>
          <span className="eyebrow">Testimonials</span>
        </FadeUp>
        <FadeUp delay={0.1} className="mt-8 max-w-3xl">
          <TestimonialsSlider testimonials={testimonials} />
        </FadeUp>
      </div>
    </section>
  );
}
