import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Sprout } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { aboutPageData, type AboutCurator, type AboutPhilosophyPillar } from "@/src/data/mockData";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

function AboutHero() {
  return (
    <section className="relative flex h-[920px] min-h-[720px] items-center justify-center overflow-hidden">
      <Image alt={aboutPageData.heroAlt} className="object-cover grayscale-[20%]" fill priority sizes="100vw" src={aboutPageData.heroImage} />
      <div className="absolute inset-0 bg-stone-950/15" />
      <div className="relative z-10 mx-auto max-w-5xl px-8 text-center text-white">
        <h1 className="mb-8 text-6xl font-black leading-[0.88] tracking-tighter md:text-8xl lg:text-9xl">
          The Art of <br />Curated Journeys
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed tracking-wide text-white/90 md:text-xl">
          {aboutPageData.heroSubtitle}
        </p>
      </div>
      <div className="absolute bottom-12 left-1/2 size-10 -translate-x-1/2 rounded-full border border-white/40 text-white">
        <ArrowRight className="m-auto mt-2.5 size-5 rotate-90" />
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="mx-auto grid max-w-screen-2xl grid-cols-1 items-center gap-20 px-8 py-32 md:grid-cols-2 lg:px-24">
      <div className="relative">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-stone-200 shadow-[0_30px_80px_-55px_rgba(28,25,23,0.65)]">
          <Image alt={aboutPageData.story.alt} className="object-cover transition-transform duration-700 hover:scale-105" fill sizes="(min-width: 768px) 50vw, 100vw" src={aboutPageData.story.image} />
        </div>
        <div className="absolute -bottom-8 -right-8 -z-10 size-48 rounded-2xl bg-emerald-100/60 backdrop-blur-xl" />
      </div>
      <div className="space-y-8">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Our Narrative</span>
        <h2 className="text-5xl font-black leading-tight tracking-tighter text-stone-950 md:text-6xl">{aboutPageData.story.heading}</h2>
        <div className="space-y-6 text-lg leading-relaxed text-stone-600">
          {aboutPageData.story.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Button className="text-sm font-black text-emerald-800 hover:bg-transparent" variant="ghost">
          Learn about our philosophy
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  return (
    <section className="bg-stone-100 py-32">
      <div className="mx-auto max-w-5xl px-8 text-center">
        <ShieldCheck className="mx-auto mb-8 size-12 text-emerald-800" strokeWidth={1.6} />
        <h2 className="mb-14 text-5xl font-black tracking-tighter text-stone-950 md:text-6xl">Curating with Intent</h2>
        <div className="grid grid-cols-1 gap-8 text-left md:grid-cols-2">
          {[
            ["Our Mission", aboutPageData.mission],
            ["Our Vision", aboutPageData.vision],
          ].map(([title, body]) => (
            <article className="rounded-2xl border border-stone-200/70 bg-white p-8 shadow-[0_25px_70px_-55px_rgba(28,25,23,0.55)]" key={title}>
              <h3 className="mb-4 text-xl font-black text-emerald-800">{title}</h3>
              <p className="leading-relaxed text-stone-600">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CuratorCard({ curator }: Readonly<{ curator: AboutCurator }>) {
  return (
    <article className="group">
      <div className="relative mb-6 aspect-square overflow-hidden rounded-2xl bg-stone-200 shadow-[0_25px_70px_-55px_rgba(28,25,23,0.55)]">
        <Image alt={curator.alt} className="object-cover transition-transform duration-700 group-hover:scale-110" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" src={curator.image} />
        <div className="absolute inset-0 bg-emerald-800/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
      <h3 className="text-2xl font-black tracking-tight text-stone-950">{curator.name}</h3>
      <p className="mt-2 text-sm font-bold tracking-wide text-emerald-800">{curator.role}</p>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">{curator.bio}</p>
    </article>
  );
}

function CuratorsSection() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 py-32 lg:px-24">
      <div className="mb-20 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="max-w-xl">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-800">The Visionaries</span>
          <h2 className="mt-4 text-5xl font-black tracking-tighter text-stone-950">Meet the Curators</h2>
          <p className="mt-6 text-lg leading-relaxed text-stone-600">
            Our team is composed of former editors, architects, and anthropologists who view the world through a different lens.
          </p>
        </div>
        <Button className="hidden rounded-none border-b-2 border-emerald-800 text-emerald-800 hover:bg-transparent md:inline-flex" variant="ghost">
          View all team members
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {aboutPageData.curators.map((curator) => (
          <CuratorCard curator={curator} key={curator.name} />
        ))}
      </div>
    </section>
  );
}

function PhilosophyIcon({ icon }: Readonly<{ icon: AboutPhilosophyPillar["icon"] }>) {
  if (icon === "leaf") {
    return <Leaf className="size-12" strokeWidth={1.5} />;
  }

  if (icon === "sparkle") {
    return <Sparkles className="size-12" strokeWidth={1.5} />;
  }

  return <Sprout className="size-12" strokeWidth={1.5} />;
}

function PhilosophySection() {
  return (
    <section className="bg-stone-200/40 px-8 py-32 lg:px-24">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-24 text-center">
          <h2 className="text-5xl font-black tracking-tighter text-stone-950">Our Philosophy</h2>
          <p className="mt-4 text-lg text-stone-600">The core pillars that define every CURATOR itinerary.</p>
        </div>
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          {aboutPageData.philosophy.map((pillar) => (
            <article className="group text-center" key={pillar.title}>
              <div className="mb-8 flex justify-center text-emerald-800 transition-transform duration-300 group-hover:scale-110">
                <PhilosophyIcon icon={pillar.icon} />
              </div>
              <h3 className="mb-4 text-2xl font-black text-stone-950">{pillar.title}</h3>
              <p className="mx-auto max-w-sm leading-relaxed text-stone-600">{pillar.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative overflow-hidden px-8 py-40 text-center">
      <div className="absolute left-0 top-0 -z-10 size-96 rounded-full bg-emerald-800/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 -z-10 size-96 rounded-full bg-stone-500/10 blur-[120px]" />
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-10 text-5xl font-black leading-tight tracking-tighter text-stone-950 md:text-7xl">{aboutPageData.cta}</h2>
        <Button className="min-h-16 px-10 text-lg font-bold shadow-xl shadow-emerald-950/10 active:scale-95">
          Start Your Journey
        </Button>
      </div>
    </section>
  );
}

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="About Us" />
      <div className="pt-20">
        <AboutHero />
        <StorySection />
        <MissionVisionSection />
        <CuratorsSection />
        <PhilosophySection />
        <CtaSection />
      </div>
      <TravelFooter />
    </main>
  );
}
