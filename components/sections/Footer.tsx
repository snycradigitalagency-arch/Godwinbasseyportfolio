import Link from "next/link";
import { getSiteSettings } from "@/lib/queries/site-settings";

export async function Footer() {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container-page flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-text-muted">© {year} Godwin Bassey. All rights reserved.</p>

        <nav className="flex gap-6">
          <Link href="/projects" className="text-sm text-text-secondary hover:text-text-primary">
            Projects
          </Link>
          <Link href="/insights" className="text-sm text-text-secondary hover:text-text-primary">
            Insights
          </Link>
          <Link href="/contact" className="text-sm text-text-secondary hover:text-text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex gap-6">
          {settings?.github_url && (
            <a href={settings.github_url} className="text-sm text-text-muted hover:text-text-primary">
              GitHub
            </a>
          )}
          {settings?.linkedin_url && (
            <a href={settings.linkedin_url} className="text-sm text-text-muted hover:text-text-primary">
              LinkedIn
            </a>
          )}
          {settings?.email && (
            <a href={`mailto:${settings.email}`} className="text-sm text-text-muted hover:text-text-primary">
              Email
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
