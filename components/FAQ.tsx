const faqs = [
  {
    q: "How much will it cost?",
    a: "Pricing isn't set yet — that's part of why this is a waitlist. People on the list will get the first pricing and an early-bird discount.",
  },
  {
    q: "When does it launch?",
    a: "Soon. The first courses will start with the topics you tell us about in the signup form, so the more honest you are about your challenges, the better the launch will be.",
  },
  {
    q: "Do I need to be technical?",
    a: "No. Lessons assume zero coding background. If you can use a web browser and a spreadsheet, you can do this. There will also be advanced tracks for people who want to go deeper.",
  },
  {
    q: "What tools will you teach?",
    a: "The big ones — ChatGPT, Claude, Gemini — plus how to wire them into the tools you already use (email, scheduling, invoicing, CRM, social). We meet you where you are, not where the textbook says you should be.",
  },
  {
    q: "Can you build something for my business directly?",
    a: "Yes. Done-for-you setups are part of the offer. Mention what you need in the signup form and we'll be in touch.",
  },
  {
    q: "What if I want to learn enough to do it myself?",
    a: "That's the whole point. We want you to graduate. The community exists so you can keep building after the lessons end.",
  },
];

export default function FAQ() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-10">
          Questions
        </h2>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium">
                <span>{f.q}</span>
                <span className="text-ink/40 group-open:rotate-45 transition-transform text-2xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink/70 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
