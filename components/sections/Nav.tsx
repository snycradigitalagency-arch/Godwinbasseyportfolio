"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="container-page fixed left-0 right-0 top-0 z-40 flex items-center justify-between py-6">
      <Link
        href="/"
        data-cursor="hover"
        aria-label="Godwin Bassey — Home"
        className="font-display text-lg tracking-wide text-text-primary"
      >
        GB
      </Link>
      <nav aria-label="Primary" className="flex gap-8">
        {LINKS.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              data-cursor="hover"
              aria-current={active ? "page" : undefined}
              className={clsx(
                "text-sm transition-colors duration-300",
                active ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
