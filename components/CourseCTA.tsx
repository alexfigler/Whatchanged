import Link from "next/link";

export default function CourseCTA() {
  return (
    <section className="mt-16 rounded-2xl bg-ink text-paper px-6 py-10 sm:px-10 sm:py-12 text-center">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3">
        Want to keep learning?
      </h2>
      <p className="text-paper/70 mb-6 max-w-md mx-auto text-sm sm:text-base">
        Join the What Changed waitlist for weekly AI updates, upcoming courses,
        and a community of professionals learning to work with AI.
      </p>
      <Link
        href="/#waitlist"
        className="inline-block rounded-full bg-paper text-ink px-6 py-2.5 text-sm font-medium hover:bg-paper/90 transition"
      >
        Join the waitlist
      </Link>
    </section>
  );
}
