export default function Hero() {
  return (
    <section className="px-6 pt-20 pb-16 md:pt-32 md:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-widest text-ink/60 mb-4">
          What Changed
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
          Catch up on AI.
          <br />
          Then put it to work in your business.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-ink/70 max-w-2xl mx-auto">
          Plain-spoken courses, custom builds, and an ongoing community for
          small business owners who want to learn AI — and stop renting it
          from someone else.
        </p>
        <div className="mt-10">
          <a
            href="#waitlist"
            className="inline-flex items-center justify-center rounded-full bg-ink text-paper px-7 py-3 text-base font-medium hover:bg-ink/85 transition"
          >
            Join the waitlist
          </a>
        </div>
      </div>
    </section>
  );
}
