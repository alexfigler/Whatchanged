import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { sendNewsletterBatch, type NewsletterMessage } from "@/lib/email";
import { renderNewsletterHtml, renderNewsletterText } from "@/lib/newsletter";

export const dynamic = "force-dynamic";

const schema = z.object({
  subject: z.string().min(1, "Subject is required.").max(200),
  body: z.string().min(1, "Body is required.").max(50000),
});

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return NextResponse.json(
      { error: first?.message || "Invalid input." },
      { status: 400 }
    );
  }

  const { subject, body } = parsed.data;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    return NextResponse.json(
      {
        error:
          "NEXT_PUBLIC_SITE_URL is not set. Add it in Vercel env vars and redeploy.",
      },
      { status: 500 }
    );
  }

  const { data: recipients, error: fetchErr } = await supabaseAdmin
    .from("waitlist")
    .select("email, unsubscribe_token")
    .eq("unsubscribed", false);

  if (fetchErr) {
    console.error("Failed to fetch recipients", fetchErr);
    return NextResponse.json(
      { error: "Could not load subscribers." },
      { status: 500 }
    );
  }

  if (!recipients || recipients.length === 0) {
    return NextResponse.json(
      { error: "No subscribers to send to." },
      { status: 400 }
    );
  }

  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from("newsletters")
    .insert({ subject, body, sent_at: null, recipient_count: null })
    .select("id")
    .single();

  if (insertErr || !inserted) {
    console.error("Failed to insert newsletter row", insertErr);
    return NextResponse.json(
      { error: "Could not record newsletter." },
      { status: 500 }
    );
  }

  const base = siteUrl.replace(/\/$/, "");
  const messages: NewsletterMessage[] = recipients.map((r) => {
    const unsubscribeUrl = `${base}/unsubscribe?token=${r.unsubscribe_token}`;
    return {
      to: r.email,
      subject,
      html: renderNewsletterHtml(subject, body, unsubscribeUrl),
      text: renderNewsletterText(subject, body, unsubscribeUrl),
    };
  });

  const result = await sendNewsletterBatch(messages);

  const { error: updateErr } = await supabaseAdmin
    .from("newsletters")
    .update({
      sent_at: new Date().toISOString(),
      recipient_count: result.successCount,
    })
    .eq("id", inserted.id);

  if (updateErr) {
    console.error("Failed to update newsletter row", updateErr);
  }

  if (result.successCount === 0) {
    return NextResponse.json(
      {
        error: `Send failed for all ${messages.length} recipients. ${result.errors[0] || ""}`.trim(),
      },
      { status: 500 }
    );
  }

  const note =
    result.failureCount > 0
      ? ` (${result.failureCount} failed — check server logs)`
      : "";

  return NextResponse.json(
    {
      ok: true,
      message: `Sent to ${result.successCount} subscriber${result.successCount === 1 ? "" : "s"}.${note}`,
    },
    { status: 200 }
  );
}
