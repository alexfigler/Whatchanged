import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Pillars from "@/components/Pillars";
import WhoFor from "@/components/WhoFor";
import WaitlistForm from "@/components/WaitlistForm";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Problem />
      <Pillars />
      <WhoFor />
      <section id="waitlist" className="px-6 py-20 md:py-28 bg-ink text-paper">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            Get on the waitlist
          </h2>
          <p className="text-paper/70 mb-8">
            Tell us a little about your business. We&apos;ll use it to shape
            the first lessons around the tools and challenges owners actually
            care about.
          </p>
          <WaitlistForm />
        </div>
      </section>
      <FAQ />
      <Footer />
    </main>
  );
}
