import { FadeUp } from "@/components/motion/FadeUp";
import { ContactForm } from "@/components/sections/ContactForm";
import { getSiteSettings } from "@/lib/queries/site-settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return buildMetadata({
    pagePath: "/contact",
    fallbackTitle: "Contact — Godwin Bassey",
    fallbackDescription: "Get in touch with Godwin Bassey for development, design, or AI automation work.",
  });
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const details = [
    { label: "Email", value: settings?.email },
    { label: "WhatsApp", value: settings?.whatsapp },
    { label: "Location", value: settings?.location },
  ].filter((d) => d.value);

  return (
    <main id="contact" className="container-page py-24 md:py-32">
      <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
        <FadeUp className="md:col-span-4">
          <span className="eyebrow">Contact</span>
          <h1 className="mt-4 font-display text-section text-text-primary">
            Let's build
            <br />
            something.
          </h1>
          <div className="mt-10 flex flex-col gap-4">
            {details.map((d) => (
              <div key={d.label}>
                <p className="text-xs uppercase tracking-eyebrow text-text-muted">{d.label}</p>
                <p className="mt-1 text-text-secondary">{d.value}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.1} className="md:col-span-8">
          <ContactForm />
        </FadeUp>
      </div>
    </main>
  );
}
