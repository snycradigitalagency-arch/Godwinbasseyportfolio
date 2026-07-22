import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireEditor } from "@/lib/auth/require-role";

async function getDashboardData() {
  const supabase = createClient();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: projectCount },
    { count: insightCount },
    { count: unreadMessages },
    { count: totalMessages },
    { data: settings },
    { data: recentMessages },
    { data: recentProjects },
    { data: recentInsights },
    { count: portfolioViews },
    { count: uniqueVisitors },
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("content_status", "published"),
    supabase.from("insights").select("id", { count: "exact", head: true }).eq("content_status", "published"),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("is_read", false),
    supabase.from("messages").select("id", { count: "exact", head: true }),
    supabase.from("site_settings").select("resume_download_count").single(),
    supabase.from("messages").select("id, name, subject, created_at, is_read").order("created_at", { ascending: false }).limit(5),
    supabase.from("projects").select("id, title, slug, published_at").eq("content_status", "published").order("published_at", { ascending: false }).limit(5),
    supabase.from("insights").select("id, title, slug, published_at").eq("content_status", "published").order("published_at", { ascending: false }).limit(5),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "page_view").gte("created_at", thirtyDaysAgo),
    supabase.from("visitor_sessions").select("id", { count: "exact", head: true }).gte("first_seen", thirtyDaysAgo),
  ]);

  return {
    projectCount: projectCount ?? 0,
    insightCount: insightCount ?? 0,
    unreadMessages: unreadMessages ?? 0,
    totalMessages: totalMessages ?? 0,
    resumeDownloads: settings?.resume_download_count ?? 0,
    portfolioViews: portfolioViews ?? 0,
    uniqueVisitors: uniqueVisitors ?? 0,
    recentMessages: recentMessages ?? [],
    recentProjects: recentProjects ?? [],
    recentInsights: recentInsights ?? [],
  };
}

const QUICK_ACTIONS = [
  { href: "/admin/content/projects/new", label: "Create Project" },
  { href: "/admin/content/insights/new", label: "Write Insight" },
  { href: "/admin/media", label: "Upload Media" },
  { href: "/admin/resume", label: "Update Resume" },
  { href: "/admin/messages", label: "View Messages" },
];

export default async function DashboardPage() {
  const { profile } = await requireEditor();
  const data = await getDashboardData();

  const stats = [
    { label: "Portfolio Views (30d)", value: data.portfolioViews },
    { label: "Unique Visitors (30d)", value: data.uniqueVisitors },
    { label: "Published Projects", value: data.projectCount },
    { label: "Published Insights", value: data.insightCount },
    { label: "Resume Downloads", value: data.resumeDownloads },
    { label: "Unread Messages", value: data.unreadMessages },
    { label: "Total Messages", value: data.totalMessages },
  ];

  return (
    <div>
      <div>
        <p className="text-sm text-text-muted">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-1 font-display text-3xl text-text-primary">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}.
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
            <p className="font-display text-3xl text-text-primary">{stat.value}</p>
            <p className="mt-1 text-xs text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded-md border border-border px-4 py-2 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-text-primary"
          >
            {action.label}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl normal-case tracking-normal text-text-primary">
              Recent Messages
            </h2>
            <Link href="/admin/messages" className="text-xs text-accent hover:text-accent-hover">
              View all →
            </Link>
          </div>
          <div className="mt-4 flex flex-col divide-y divide-border">
            {data.recentMessages.length === 0 && (
              <p className="py-4 text-sm text-text-muted">No messages yet.</p>
            )}
            {data.recentMessages.map((message) => (
              <div key={message.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm text-text-primary">{message.name}</p>
                  <p className="text-xs text-text-muted">{message.subject || "No subject"}</p>
                </div>
                {!message.is_read && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-xl normal-case tracking-normal text-text-primary">
            Recently Published
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {data.recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between">
                <p className="text-sm text-text-primary">{project.title}</p>
                <span className="text-xs text-text-muted">Project</span>
              </div>
            ))}
            {data.recentInsights.map((insight) => (
              <div key={insight.id} className="flex items-center justify-between">
                <p className="text-sm text-text-primary">{insight.title}</p>
                <span className="text-xs text-text-muted">Insight</span>
              </div>
            ))}
            {data.recentProjects.length === 0 && data.recentInsights.length === 0 && (
              <p className="text-sm text-text-muted">Nothing published yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
