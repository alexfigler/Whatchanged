export default function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-ink/10">
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-ink/60">
        <p>© {new Date().getFullYear()} What Changed</p>
        <p>
          Questions?{" "}
          <a
            href="mailto:hello@whatchanged.example"
            className="underline hover:text-ink"
          >
            hello@whatchanged.example
          </a>
        </p>
      </div>
    </footer>
  );
}
