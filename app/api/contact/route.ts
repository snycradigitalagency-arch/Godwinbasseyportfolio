import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { contactFormSchema } from "@/lib/validators/contact";
import { notifyNewMessage } from "@/lib/integrations/resend";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = createClient();
  const { error } = await supabase.from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject ?? null,
    body: parsed.data.body,
  });

  if (error) {
    return NextResponse.json(
      { error: "Couldn't send your message — try again in a moment." },
      { status: 500 }
    );
  }

  await notifyNewMessage(parsed.data);

  return NextResponse.json({ success: true });
}
