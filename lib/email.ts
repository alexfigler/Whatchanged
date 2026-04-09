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
