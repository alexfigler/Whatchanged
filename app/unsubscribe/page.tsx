import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type SearchParams = { token?: string | string[] };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const raw = params.token;
  const token = Array.isArray(raw) ? raw[0] : raw;

  if (!token || !UUID_RE.test(token)) {
    return (
      <Shell>
        <h1 className="text-2xl font-semibold mb-3">Invalid unsubscribe link</h1>
        <p className="text-ink/70">
          This link doesn't look right. If you'd like to unsubscribe, reply to
          any email from us and we'll take care of it.
        </p>
      </Shell>
    );
  }

  const { data, error } = await supabaseAdmin
    .from("waitlist")
    .update({ unsubscribed: true })
    .eq("unsubscribe_token", token)
    .select("email")
    .maybeSingle();

  if (error) {
    console.error("Unsubscribe failed", error);
    return (
      <Shell>
        <h1 className="text-2xl font-semibold mb-3">Something went wrong</h1>
        <p className="text-ink/70">
          We couldn't process that just now. Please try again in a minute, or
          reply to any email from us and we'll handle it manually.
        </p>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell>
        <h1 className="text-2xl font-semibold mb-3">Link not recognized</h1>
        <p className="text-ink/70">
          We couldn't find a subscription matching that link. You may already be
          unsubscribed.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <h1 className="text-2xl font-semibold mb-3">You've been unsubscribed</h1>
      <p className="text-ink/70 mb-2">
        <strong>{data.email}</strong> won't receive any more emails from What
        Changed.
      </p>
      <p className="text-ink/60 text-sm">
        Changed your mind? Just sign up again at{" "}
        <a href="/" className="underline">
          whatchanged.co
        </a>
        .
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full">{children}</div>
    </main>
  );
}
