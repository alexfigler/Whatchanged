import { supabaseAdmin, type WaitlistRow } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function csvEscape(value: string | null | undefined): string {
  if (value == null) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }

  const rows = (data || []) as WaitlistRow[];
  const header = ["created_at", "email", "industry", "experience", "challenge"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.created_at),
        csvEscape(r.email),
        csvEscape(r.industry),
        csvEscape(r.experience),
        csvEscape(r.challenge),
      ].join(",")
    );
  }

  const csv = lines.join("\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${stamp}.csv"`,
    },
  });
}
