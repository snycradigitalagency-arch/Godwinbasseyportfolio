/** @type {import('next').NextConfig} */

// Supabase project ref, parsed from NEXT_PUBLIC_SUPABASE_URL (e.g.
// https://abcxyz.supabase.co) so next/image is allowed to optimize
// images served from the `media`/`resume` storage buckets without
// hardcoding a project-specific hostname here.
let supabaseHostname;
try {
  supabaseHostname = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname;
} catch {
  supabaseHostname = undefined;
}

const nextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseHostname
        ? [{ protocol: "https", hostname: supabaseHostname, pathname: "/storage/v1/object/public/**" }]
        : []),
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Cache immutable Next.js build assets aggressively; HTML/data stay
  // on Next's own revalidation via generateStaticParams + ISR.
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

module.exports = nextConfig;
