const fits = [
  "Solo owners and small teams",
  "Any industry — trades, services, retail, hospitality, professional",
  "Total beginners through people already using AI daily",
  "People who want to own what they build, not rent it",
];

export default function WhoFor() {
  return (
    <section className="px-6 py-16 md:py-20 border-t border-ink/10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-6">
          Who this is for
        </h2>
        <ul className="space-y-3 text-lg text-ink/75">
          {fits.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-ink shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
