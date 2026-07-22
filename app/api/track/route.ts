import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const SESSION_COOKIE = "gb_session_id";

function parseUserAgent(ua: string) {
  const device = /Mobile|Android|iPhone/.test(ua) ? "mobile" : "desktop";
  const browser = /Chrome/.test(ua)
    ? "Chrome"
    : /Firefox/.test(ua)
    ? "Firefox"
    : /Safari/.test(ua)
    ? "Safari"
    : "Other";
  const os = /Windows/.test(ua) ? "Windows" : /Mac/.test(ua) ? "macOS" : /Android/.test(ua) ? "Android" : /iOS|iPhone/.test(ua) ? "iOS" : "Other";
  return { device, browser, os };
}

export async function POST(request: Request) {
  const body = await request.json();
  const { eventType, pagePath, targetType, targetId, referrer, utm } = body as {
    eventType: string;
    pagePath?: string;
    targetType?: string;
    targetId?: string;
    referrer?: string;
    utm?: { source?: string; medium?: string; campaign?: string };
  };

  const cookieStore = cookies();
  const supabase = createClient();
  const ua = request.headers.get("user-agent") || "";
  const { device, browser, os } = parseUserAgent(ua);

  let sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  let isNewSession = false;

  if (!sessionId) {
    const { data: session } = await supabase
      .from("visitor_sessions")
      .insert({
        browser,
        device,
        os,
        referrer: referrer || null,
        utm_source: utm?.source || null,
        utm_medium: utm?.medium || null,
        utm_campaign: utm?.campaign || null,
      })
      .select("id")
      .single();
    sessionId = session?.id;
    isNewSession = true;
  } else {
    await supabase.from("visitor_sessions").update({ last_seen: new Date().toISOString() }).eq("id", sessionId);
  }

  if (sessionId) {
    await supabase.from("analytics_events").insert({
      session_id: sessionId,
      event_type: eventType,
      target_type: targetType || null,
      target_id: targetId || null,
      page_path: pagePath || null,
    });
  }

  const response = NextResponse.json({ success: true });
  if (isNewSession && sessionId) {
    response.cookies.set(SESSION_COOKIE, sessionId, {
      maxAge: 60 * 60 * 24 * 180,
      httpOnly: true,
      sameSite: "lax",
    });
  }
  return response;
}
