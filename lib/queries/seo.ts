import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase/public";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://godwinbassey.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

interface BuildMetadataInput {
  pagePath: string;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackImage?: string;
}

export async function buildMetadata({
  pagePath,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
}: BuildMetadataInput): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data: override } = await supabase
    .from("seo_meta")
    .select("meta_title, meta_description, canonical_url, no_index")
    .eq("page_path", pagePath)
    .single();

  const title = override?.meta_title || fallbackTitle;
  const description = override?.meta_description || fallbackDescription;
  const image = fallbackImage || DEFAULT_OG_IMAGE;
  const canonical = override?.canonical_url || `${SITE_URL}${pagePath}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: override?.no_index ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Godwin Bassey",
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Godwin Bassey",
    jobTitle: "Full Stack Developer & Digital Strategist",
    url: SITE_URL,
    sameAs: [] as string[],
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt || undefined,
    author: { "@type": "Person", name: "Godwin Bassey" },
    mainEntityOfPage: `${SITE_URL}/insights/${input.slug}`,
  };
}

export function projectJsonLd(input: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    description: input.description,
    url: `${SITE_URL}/projects/${input.slug}`,
    creator: { "@type": "Person", name: "Godwin Bassey" },
  };
}
