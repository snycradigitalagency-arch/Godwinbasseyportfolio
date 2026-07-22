import { createClient } from "@/lib/supabase/server";
import { MessageRow } from "@/components/admin/MessageRow";
import { ExportMessagesButton } from "@/components/admin/ExportMessagesButton";

export default async function MessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow">Site</span>
          <h1 className="mt-2 font-display text-2xl text-text-primary">Messages</h1>
        </div>
        {messages && messages.length > 0 && <ExportMessagesButton messages={messages} />}
      </div>

      <div className="mt-8 flex flex-col gap-4">
        {!messages || messages.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-text-muted">No messages yet.</p>
          </div>
        ) : (
          messages.map((message) => <MessageRow key={message.id} message={message} />)
        )}
      </div>
    </div>
  );
}
