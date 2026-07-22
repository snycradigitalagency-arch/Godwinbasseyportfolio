/**
 * Email notifications for new contact messages. Kept behind a single
 * adapter so swapping providers later (or adding Cloudinary, Stripe,
 * Calendly, etc. per the addendum) never touches the calling code in
 * app/api/contact/route.ts.
 *
 * No-ops if RESEND_API_KEY isn't set, so local dev and Phase 2 review
 * work without an email provider configured yet.
 */
export async function notifyNewMessage(input: {
  name: string;
  email: string;
  subject?: string;
  body: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL;
  if (!apiKey || !notifyTo) return { sent: false, reason: "not_configured" as const };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio Contact <notifications@godwinbassey.com>",
      to: notifyTo,
      subject: `New message: ${input.subject || "Portfolio contact form"}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.body}`,
    }),
  });

  return { sent: res.ok };
}
