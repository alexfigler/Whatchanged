import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;

const resend = apiKey ? new Resend(apiKey) : null;

export async function sendWaitlistConfirmation(toEmail: string) {
  if (!resend || !fromEmail) {
    // Email is best-effort. If Resend isn't configured, don't fail the signup.
    console.warn("Resend not configured — skipping confirmation email");
    return;
  }

  try {
    await resend.emails.send({
      from: `What Changed <${fromEmail}>`,
      to: toEmail,
      subject: "You're on the What Changed waitlist",
      text: [
        "Thanks for signing up.",
        "",
        "You're on the waitlist for What Changed — AI lessons, custom builds, and a community for small business owners.",
        "",
        "We'll be in touch as soon as the first lessons are ready. In the meantime, if you have a specific challenge AI could help with, just hit reply — every answer shapes what gets built first.",
        "",
        "— What Changed",
      ].join("\n"),
    });
  } catch (err) {
    console.error("Failed to send confirmation email", err);
  }
}

export type NewsletterMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type NewsletterSendResult = {
  successCount: number;
  failureCount: number;
  errors: string[];
};

// Sends a newsletter to many recipients via Resend's batch endpoint.
// Resend allows up to 100 messages per batch call. We chunk and tally
// successes/failures per chunk; a failed chunk does NOT abort the run.
export async function sendNewsletterBatch(
  messages: NewsletterMessage[]
): Promise<NewsletterSendResult> {
  const result: NewsletterSendResult = {
    successCount: 0,
    failureCount: 0,
    errors: [],
  };

  if (messages.length === 0) return result;

  if (!resend || !fromEmail) {
    console.warn("Resend not configured — cannot send newsletter");
    result.failureCount = messages.length;
    result.errors.push("Resend not configured on server.");
    return result;
  }

  const from = `What Changed <${fromEmail}>`;
  const BATCH_SIZE = 100;

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    const slice = messages.slice(i, i + BATCH_SIZE);
    try {
      const { error } = await resend.batch.send(
        slice.map((m) => ({
          from,
          to: m.to,
          subject: m.subject,
          html: m.html,
          text: m.text,
        }))
      );
      if (error) {
        console.error("Resend batch error", error);
        result.failureCount += slice.length;
        result.errors.push(error.message || "Unknown Resend batch error");
      } else {
        result.successCount += slice.length;
      }
    } catch (err) {
      console.error("Resend batch threw", err);
      result.failureCount += slice.length;
      result.errors.push(err instanceof Error ? err.message : String(err));
    }
  }

  return result;
}

