import { About } from "@/components/sections/About";
import { ExpertiseGrid } from "@/components/sections/ExpertiseGrid";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { TechStack } from "@/components/sections/TechStack";
import { Timeline } from "@/components/sections/Timeline";
import { buildMetadata, personJsonLd } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    pagePath: "/",
    fallbackTitle: "Godwin Bassey — Full Stack Developer & Digital Strategist",
    fallbackDescription:
      "Full Stack Developer, Graphic Designer, and AI Automation Specialist building premium digital products and brands.",
  });
}

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
      />
      <Hero />
      <About />
      <ExpertiseGrid />
      <TechStack />
      <Services />
      <Timeline />
      <Testimonials />
    </main>
  );
}
