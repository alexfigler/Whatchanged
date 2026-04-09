// Pure helpers used by the newsletter compose page and send route.
// No imports from next, supabase, or resend — keep this trivially testable.

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function chunk<T>(arr: T[], size: number): T[][] {
  if (size <= 0) return [arr];
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

export function renderNewsletterHtml(
  subject: string,
  body: string,
  unsubscribeUrl: string
): string {
  const safeSubject = escapeHtml(subject);
  const safeBody = escapeHtml(body);
  const safeUrl = escapeHtml(unsubscribeUrl);

  return `<!doctype html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#0a0a0a;background:#fafaf9;">
  <h1 style="font-size:22px;margin:0 0 24px;line-height:1.3;">${safeSubject}</h1>
  <div style="font-size:16px;line-height:1.6;white-space:pre-wrap;">${safeBody}</div>
  <hr style="margin:40px 0 16px;border:none;border-top:1px solid #e5e5e5;">
  <p style="font-size:12px;color:#737373;line-height:1.5;">
    You're getting this because you joined the What Changed waitlist.<br>
    <a href="${safeUrl}" style="color:#737373;">Unsubscribe</a>
  </p>
</body></html>`;
}

export function renderNewsletterText(
  subject: string,
  body: string,
  unsubscribeUrl: string
): string {
  return [
    subject,
    "",
    body,
    "",
    "—",
    "You're getting this because you joined the What Changed waitlist.",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");
}
