const pillars = [
  {
    title: "Learn",
    tag: "Self-serve courses",
    body: "Short, plain-spoken video lessons from entry level to advanced. Learn the models, the tools, and the patterns — with exercises you actually finish.",
  },
  {
    title: "Build for you",
    tag: "Done-for-you AI setups",
    body: "Need it now? We build the custom GPTs, automations, and workflows tailored to your tools and your team. You keep them. You run them.",
  },
  {
    title: "Keep growing",
    tag: "Community + platform",
    body: "A members space for new lessons, templates, and peers who are figuring it out alongside you. The point is to graduate — and keep building on your own.",
  },
];

export default function Pillars() {
  return (
    <section className="px-6 py-16 md:py-24 border-t border-ink/10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-10 text-center">
          Three ways in. One goal: you, building for yourself.
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-ink/10 bg-white p-7 hover:border-ink/30 transition"
            >
              <p className="text-xs uppercase tracking-widest text-ink/50 mb-3">
                {p.tag}
              </p>
              <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
              <p className="text-ink/70 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
