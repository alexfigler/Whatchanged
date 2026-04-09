import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { sendWaitlistConfirmation } from "@/lib/email";

const schema = z.object({
  email: z.string().email("Please enter a valid email address."),
  industry: z.string().min(1, "Tell us what kind of business.").max(200),
  experience: z.enum(["beginner", "intermediate", "advanced"], {
    errorMap: () => ({ message: "Pick an experience level." }),
  }),
  challenge: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return NextResponse.json(
      { error: first?.message || "Invalid input." },
      { status: 400 }
    );
  }

  const { email, industry, experience, challenge } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const { error } = await supabaseAdmin.from("waitlist").insert({
    email: normalizedEmail,
    industry,
    experience,
    challenge: challenge || null,
  });

  if (error) {
    // Postgres unique violation
    if (error.code === "23505") {
      return NextResponse.json(
        { ok: true, message: "You're already on the list — see you soon." },
        { status: 200 }
      );
    }
    console.error("Supabase insert failed", error);
    return NextResponse.json(
      { error: "We couldn't save that. Try again in a minute." },
      { status: 500 }
    );
  }

  // Fire-and-forget confirmation email
  await sendWaitlistConfirmation(normalizedEmail);

  return NextResponse.json(
    {
      ok: true,
      message: "You're on the list. Check your inbox for a confirmation.",
    },
    { status: 200 }
  );
}
