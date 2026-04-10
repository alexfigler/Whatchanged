import { escapeHtml } from "./newsletter";

// Lightweight plain-text → HTML renderer. Zero dependencies.
// Supports: # headings, **bold**, - bullet lists, blank-line paragraphs.
// Everything else is rendered as plain text with line breaks preserved.

export function renderLesson(raw: string): string {
  const escaped = escapeHtml(raw);
  const blocks = escaped.split(/\n\n+/);
  const html: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Check if this block is a list (all lines start with "- ")
    const lines = trimmed.split("\n");
    const isList = lines.every(
      (l) => l.trim().startsWith("- ") || l.trim() === ""
    );

    if (isList) {
      const items = lines
        .filter((l) => l.trim().startsWith("- "))
        .map((l) => `<li>${applyInline(l.trim().slice(2))}</li>`)
        .join("");
      html.push(`<ul style="margin:0 0 0 1.5rem;padding:0;list-style:disc;">${items}</ul>`);
      continue;
    }

    // Process line by line
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;

      if (t.startsWith("## ")) {
        html.push(
          `<h3 style="font-size:1.15rem;font-weight:600;margin:1.5rem 0 0.5rem;">${applyInline(t.slice(3))}</h3>`
        );
      } else if (t.startsWith("# ")) {
        html.push(
          `<h2 style="font-size:1.35rem;font-weight:600;margin:1.5rem 0 0.5rem;">${applyInline(t.slice(2))}</h2>`
        );
      } else {
        html.push(
          `<p style="margin:0 0 1rem;line-height:1.7;">${applyInline(t)}</p>`
        );
      }
    }
  }

  return html.join("");
}

// Inline formatting: **bold**
function applyInline(text: string): string {
  return text.replace(
    /\*\*(.+?)\*\*/g,
    '<strong style="font-weight:600;">$1</strong>'
  );
}
