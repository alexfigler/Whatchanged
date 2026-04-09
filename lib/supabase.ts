import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
}

// Server-side client. Uses the service role key — never import this from client components.
export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

export type WaitlistRow = {
  id: string;
  created_at: string;
  email: string;
  industry: string | null;
  experience: string | null;
  challenge: string | null;
};
