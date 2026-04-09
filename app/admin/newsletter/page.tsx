import Link from "next/link";
import { supabaseAdmin, type Newsletter } from "@/lib/supabase";
import ComposeForm from "./ComposeForm";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const [{ count: activeCount }, { data: pastIssues, error: pastErr }] =
    await Promise.all([
      supabaseAdmin
        .from("waitlist")
        .select("*", { count: "exact", head: true })
        .eq("unsubscribed", false),
      supabaseAdmin
        .from("newsletters")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

  const recipientCount = activeCount ?? 0;
  const issues = (pastIssues || []) as Newsletter[];
  const siteUrlMissing = !process.env.NEXT_PUBLIC_SITE_URL;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Compose newsletter</h1>
          <p className="text-ink/60 text-sm">
            {recipientCount} active subscriber{recipientCount === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-ink/60 hover:text-ink transition"
        >
          ← Back to waitlist
        </Link>
      </div>

      {siteUrlMissing && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Heads up:</strong> <code>NEXT_PUBLIC_SITE_URL</code> is not
          set. Add it in Vercel → Settings → Environment Variables (e.g.{" "}
          <code>https://whatchanged.co</code>) and redeploy before sending.
        </div>
      )}

      {pastErr && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
          Error loading past issues: {pastErr.message}
        </div>
      )}

      <ComposeForm
        recipientCount={recipientCount}
        disabled={siteUrlMissing}
      />

      <h2 className="text-lg font-semibold mt-12 mb-4">Past issues</h2>
      <div className="overflow-x-auto border border-ink/10 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Sent</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Recipients</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {issues.map((n) => (
              <tr key={n.id}>
                <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                  {n.sent_at
                    ? new Date(n.sent_at).toLocaleString()
                    : "— draft —"}
                </td>
                <td className="px-4 py-3">{n.subject}</td>
                <td className="px-4 py-3 text-ink/60">
                  {n.recipient_count ?? "—"}
                </td>
              </tr>
            ))}
            {issues.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-ink/50"
                >
                  No issues sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}