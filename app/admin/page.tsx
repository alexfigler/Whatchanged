import { supabaseAdmin, type WaitlistRow } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Waitlist</h1>
        <p className="text-red-600">Error loading: {error.message}</p>
      </main>
    );
  }

  const rows = (data || []) as WaitlistRow[];

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Waitlist</h1>
          <p className="text-ink/60 text-sm">{rows.length} signups</p>
        </div>
        <a
          href="/admin/export.csv"
          className="rounded-full bg-ink text-paper px-5 py-2 text-sm font-medium hover:bg-ink/85 transition"
        >
          Download CSV
        </a>
      </div>

      <div className="overflow-x-auto border border-ink/10 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Challenge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 whitespace-nowrap text-ink/60">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.industry}</td>
                <td className="px-4 py-3">{r.experience}</td>
                <td className="px-4 py-3 max-w-md text-ink/70">
                  {r.challenge}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-ink/50"
                >
                  No signups yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
