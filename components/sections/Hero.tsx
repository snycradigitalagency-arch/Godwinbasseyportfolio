import { BlurIn } from "@/components/motion/BlurIn";
import { FadeUp } from "@/components/motion/FadeUp";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { Badge } from "@/components/ui/Badge";
import { SocialLink } from "@/components/analytics/SocialLink";
import { getSiteSettings } from "@/lib/queries/site-settings";

export async function Hero() {
  const settings = await getSiteSettings();

  const headline = settings?.hero_headline ?? "Godwin Bassey";
  const [firstLine, ...rest] = headline.split(" ");
  const secondLine = rest.join(" ");

  const subheadline =
    settings?.hero_subheadline ??
    "Full Stack Developer, Graphic Designer, and AI Automation Specialist — building premium digital products and the brands that carry them.";

  const socials = [
    settings?.github_url && { label: "GitHub", href: settings.github_url, eventType: "github_click" },
    settings?.linkedin_url && { label: "LinkedIn", href: settings.linkedin_url, eventType: "linkedin_click" },
    settings?.whatsapp && {
      label: "WhatsApp",
      href: `https://wa.me/${settings.whatsapp}`,
      eventType: "whatsapp_click",
    },
  ].filter(Boolean) as { label: string; href: string; eventType: string }[];

  return (
    <section className="container-page flex min-h-[92vh] flex-col justify-center gap-10 pt-28 pb-20">
      <FadeUp>
        <Badge tone={settings?.availability_status !== false ? "success" : "neutral"}>
          {settings?.availability_status !== false ? "Available for Work" : "Not Currently Available"}
        </Badge>
      </FadeUp>

      <BlurIn delay={0.1}>
        <h1 className="font-display text-hero text-text-primary">
          {firstLine}
          {secondLine && (
            <>
              <br />
              {secondLine}
            </>
          )}
        </h1>
      </BlurIn>

      <FadeUp delay={0.35} className="max-w-2xl">
        <p className="text-lg text-text-secondary md:text-xl">{subheadline}</p>
      </FadeUp>

      <FadeUp delay={0.5} className="flex flex-wrap items-center gap-4">
        <MagneticButton
          href="/projects"
          trackAs="cta_click"
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 ease-premium hover:bg-accent-hover"
        >
          View Projects
        </MagneticButton>
        {settings?.resume_file_url && (
          <MagneticButton
            href="/api/resume-download"
            trackAs="resume_download"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold text-text-primary transition-colors duration-300 ease-premium hover:border-accent"
          >
            Download Resume
          </MagneticButton>
        )}
        <MagneticButton
          href="/contact"
          trackAs="cta_click"
          className="inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-text-secondary transition-colors duration-300 ease-premium hover:text-text-primary"
        >
          Hire Me
        </MagneticButton>
      </FadeUp>

      {socials.length > 0 && (
        <FadeUp delay={0.65} className="flex gap-6 pt-4">
          {socials.map((social) => (
            <SocialLink key={social.label} href={social.href} label={social.label} eventType={social.eventType} />
          ))}
        </FadeUp>
      )}
    </section>
  );
}
