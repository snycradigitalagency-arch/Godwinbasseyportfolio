"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { signOut } from "@/app/admin/login/actions";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", label: "Command Center" }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/content/projects", label: "Projects" },
      { href: "/admin/content/insights", label: "Insights" },
      { href: "/admin/content/testimonials", label: "Testimonials" },
      { href: "/admin/content/experience", label: "Experience" },
      { href: "/admin/content/education", label: "Education" },
      { href: "/admin/content/achievements", label: "Achievements" },
      { href: "/admin/content/certifications", label: "Certifications" },
      { href: "/admin/content/services", label: "Services" },
      { href: "/admin/content/skills", label: "Skills" },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/media", label: "Media Library" },
      { href: "/admin/resume", label: "Resume" },
      { href: "/admin/messages", label: "Messages" },
      { href: "/admin/content/seo_meta", label: "SEO" },
    ],
  },
];

export function Sidebar({ userName }: { userName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-bg-secondary">
      <div className="border-b border-border px-6 py-6">
        <p className="font-display text-lg tracking-wide text-text-primary">Command Center</p>
        {userName && <p className="mt-1 text-xs text-text-muted">{userName}</p>}
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="px-2 text-xs uppercase tracking-eyebrow text-text-muted">{group.label}</p>
            <div className="mt-2 flex flex-col gap-1">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "rounded-md px-3 py-2 text-sm transition-colors duration-200",
                      active
                        ? "bg-card text-text-primary"
                        : "text-text-secondary hover:bg-card hover:text-text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <form action={signOut} className="border-t border-border px-4 py-4">
        <button
          type="submit"
          className="w-full rounded-md px-3 py-2 text-left text-sm text-text-muted transition-colors duration-200 hover:text-text-primary"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
