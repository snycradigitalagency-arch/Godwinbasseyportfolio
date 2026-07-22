interface Block {
  type: "paragraph" | "heading" | "code" | "quote";
  text: string;
}

/**
 * Phase 2 keeps insight content as a simple JSON block array so the
 * public page can render without a rich-text editor yet. Phase 3's
 * admin will write this same shape from a proper editor (Tiptap/Lexical),
 * so this renderer doesn't need to change.
 */
export function RichTextRenderer({ content }: { content: unknown }) {
  const blocks = Array.isArray(content) ? (content as Block[]) : [];

  if (blocks.length === 0) {
    return <p className="text-text-muted">This insight has no content yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="font-display text-2xl normal-case tracking-normal text-text-primary">
                {block.text}
              </h2>
            );
          case "code":
            return (
              <pre key={i} className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm text-text-secondary">
                <code>{block.text}</code>
              </pre>
            );
          case "quote":
            return (
              <blockquote key={i} className="border-l-2 border-accent pl-6 text-lg italic text-text-secondary">
                {block.text}
              </blockquote>
            );
          default:
            return (
              <p key={i} className="leading-relaxed text-text-secondary">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
