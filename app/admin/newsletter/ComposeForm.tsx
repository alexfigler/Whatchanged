"use client";

import { useState } from "react";

type Props = {
  recipientCount: number;
  disabled: boolean;
};

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export default function ComposeForm({ recipientCount, disabled }: Props) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const canOpenConfirm =
    !disabled &&
    subject.trim().length > 0 &&
    body.trim().length > 0 &&
    recipientCount > 0 &&
    status.kind !== "sending";

  const canSend = confirmText.trim().toUpperCase() === "SEND";

  async function doSend() {
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error || "Send failed." });
        return;
      }
      setStatus({ kind: "ok", message: data.message || "Sent." });
      setSubject("");
      setBody("");
      setConfirmOpen(false);
      setConfirmText("");
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error.",
      });
    }
  }

  return (
    <div className="rounded-xl border border-ink/10 p-6 bg-paper">
      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1">Subject</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={200}
          placeholder="What changed in AI this week"
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-base bg-white focus:outline-none focus:border-ink/40"
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium mb-1">
          Body
          <span className="text-ink/50 font-normal ml-2">
            (plain text — line breaks preserved)
          </span>
        </span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={50000}
          rows={14}
          placeholder={`3 things that changed in AI this week:\n\n1. ...\n2. ...\n3. ...\n\nTry this:\n...`}
          className="w-full rounded-lg border border-ink/15 px-3 py-2 text-base font-mono bg-white focus:outline-none focus:border-ink/40"
        />
      </label>

      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="text-sm text-ink/70 hover:text-ink underline"
        >
          {showPreview ? "Hide preview" : "Show preview"}
        </button>
        <span className="text-ink/40 text-sm">·</span>
        <span className="text-sm text-ink/60">
          {body.length.toLocaleString()} / 50,000 chars
        </span>
      </div>

      {showPreview && (
        <div className="mb-6 rounded-lg border border-ink/10 bg-white p-6">
          <h3 className="text-xl font-semibold mb-4">
            {subject || <span className="text-ink/30">(no subject)</span>}
          </h3>
          <div className="text-base leading-relaxed whitespace-pre-wrap">
            {body || <span className="text-ink/30">(no body)</span>}
          </div>
          <hr className="my-6 border-ink/10" />
          <p className="text-xs text-ink/50">
            You're getting this because you joined the What Changed waitlist.
            <br />
            <span className="underline">Unsubscribe</span>
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-ink/60">
          Will send to{" "}
          <strong className="text-ink">{recipientCount}</strong> subscriber
          {recipientCount === 1 ? "" : "s"}
        </div>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={!canOpenConfirm}
          className="rounded-full bg-ink text-paper px-6 py-2 text-sm font-medium hover:bg-ink/85 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send to {recipientCount}
        </button>
      </div>

      {status.kind === "ok" && (
        <div className="mt-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
          {status.message}
        </div>
      )}
      {status.kind === "error" && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
          {status.message}
        </div>
      )}

      {confirmOpen && (
        <div
          className="fixed inset-0 bg-ink/50 flex items-center justify-center p-4 z-50"
          onClick={() => status.kind !== "sending" && setConfirmOpen(false)}
        >
          <div
            className="bg-paper rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-2">Send for real?</h3>
            <p className="text-sm text-ink/70 mb-4">
              This will email{" "}
              <strong>{recipientCount}</strong> subscribers immediately.
              There's no undo. Type <code className="bg-ink/5 px-1.5 py-0.5 rounded">SEND</code> to confirm.
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="SEND"
              autoFocus
              className="w-full rounded-lg border border-ink/15 px-3 py-2 text-base bg-white focus:outline-none focus:border-ink/40 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setConfirmText("");
                }}
                disabled={status.kind === "sending"}
                className="px-4 py-2 text-sm text-ink/70 hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={doSend}
                disabled={!canSend || status.kind === "sending"}
                className="rounded-full bg-ink text-paper px-5 py-2 text-sm font-medium hover:bg-ink/85 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status.kind === "sending" ? "Sending…" : "Send now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
