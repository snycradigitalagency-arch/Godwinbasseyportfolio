"use client";

interface Message {
  name: string;
  email: string;
  subject: string | null;
  body: string;
  created_at: string;
}

function toCsv(rows: Message[]) {
  const header = ["Name", "Email", "Subject", "Message", "Date"];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [r.name, r.email, r.subject ?? "", r.body, new Date(r.created_at).toISOString()]
      .map(escape)
      .join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export function ExportMessagesButton({ messages }: { messages: Message[] }) {
  function handleExport() {
    const csv = toCsv(messages);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `messages-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="rounded-md border border-border px-4 py-2 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-text-primary"
    >
      Export CSV
    </button>
  );
}
