"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      email: String(data.get("email") || "").trim(),
      industry: String(data.get("industry") || "").trim(),
      experience: String(data.get("experience") || "").trim(),
      challenge: String(data.get("challenge") || "").trim(),
    };

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Something went wrong. Try again.");
        return;
      }
      setStatus("success");
      setMessage(json.message || "You're on the list. Check your inbox.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-paper/20 bg-paper/5 p-8 text-center">
        <p className="text-2xl font-semibold mb-2">You&apos;re in.</p>
        <p className="text-paper/70">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <Field label="Email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourbusiness.com"
          className="input"
        />
      </Field>

      <Field label="What kind of business?" htmlFor="industry">
        <input
          id="industry"
          name="industry"
          type="text"
          required
          placeholder="e.g. plumbing, hair salon, accounting, e-commerce"
          className="input"
        />
      </Field>

      <Field label="How much AI have you used?" htmlFor="experience">
        <select
          id="experience"
          name="experience"
          required
          defaultValue=""
          className="input"
        >
          <option value="" disabled>
            Pick one
          </option>
          <option value="beginner">Beginner — barely touched it</option>
          <option value="intermediate">
            Intermediate — I use ChatGPT or similar weekly
          </option>
          <option value="advanced">
            Advanced — I&apos;ve built tools, automations, or custom GPTs
          </option>
        </select>
      </Field>

      <Field
        label="What's your biggest challenge AI could help with?"
        htmlFor="challenge"
      >
        <textarea
          id="challenge"
          name="challenge"
          rows={4}
          placeholder="One or two sentences is fine."
          className="input resize-y"
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-paper text-ink px-6 py-3 font-medium hover:bg-paper/90 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {status === "submitting" ? "Adding you…" : "Join the waitlist"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-300 text-center">{message}</p>
      )}

      <style jsx>{`
        :global(.input) {
          width: 100%;
          background: rgba(250, 250, 249, 0.06);
          border: 1px solid rgba(250, 250, 249, 0.18);
          color: #fafaf9;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
        }
        :global(.input::placeholder) {
          color: rgba(250, 250, 249, 0.4);
        }
        :global(.input:focus) {
          border-color: rgba(250, 250, 249, 0.55);
          background: rgba(250, 250, 249, 0.1);
        }
        :global(select.input) {
          appearance: none;
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-paper/80 mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
