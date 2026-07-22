"use client";

import { useTransition } from "react";
import { deleteMessage, markMessageRead } from "@/app/admin/(protected)/messages/actions";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  created_at: string;
}

export function MessageRow({ message }: { message: Message }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className={`rounded-lg border border-border p-6 ${message.is_read ? "bg-card" : "bg-[#161923]"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {!message.is_read && <span className="h-2 w-2 rounded-full bg-accent" />}
            <p className="font-semibold text-text-primary">{message.name}</p>
            <span className="text-xs text-text-muted">{message.email}</span>
          </div>
          <p className="mt-1 text-sm text-text-muted">{message.subject || "No subject"}</p>
        </div>
        <span className="text-xs text-text-muted">
          {new Date(message.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm text-text-secondary">{message.body}</p>

      <div className="mt-5 flex gap-4 text-sm">
        <a
          href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || "your message")}`}
          className="text-accent hover:text-accent-hover"
        >
          Reply
        </a>
        <button
          disabled={isPending}
          onClick={() => startTransition(() => markMessageRead(message.id, !message.is_read))}
          className="text-text-secondary hover:text-text-primary disabled:opacity-50"
        >
          Mark as {message.is_read ? "unread" : "read"}
        </button>
        <button
          disabled={isPending}
          onClick={() => {
            if (confirm("Delete this message?")) startTransition(() => deleteMessage(message.id));
          }}
          className="text-error/80 hover:text-error disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
