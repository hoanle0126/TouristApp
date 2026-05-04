import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import type { FeaturedJournalPost, JournalPost } from "@/src/types/travel";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

const categories = ["All Stories", "Destinations", "Lifestyle", "Guides", "Interviews"] as const;

function BlogHero() {
  return (
    <section className="mx-auto max-w-5xl px-8 pb-20 pt-36 text-center lg:pt-44">
      <span className="mb-6 inline-flex rounded-full border border-emerald-800/20 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-emerald-800">
        Curator Journal
      </span>
      <h1 className="mb-8 text-6xl font-black leading-none tracking-tighter text-stone-950 md:text-8xl">
        The Journal: Stories &amp; Guides
      </h1>
      <p className="mx-auto max-w-3xl text-xl font-light leading-relaxed text-stone-600 md:text-2xl">
        Curated narratives from the world&apos;s most evocative corners. A collection of quiet moments, architectural marvels, and slow-travel wisdom.
      </p>
    </section>
  );
}

function FeaturedPost({ post }: Readonly<{ post: FeaturedJournalPost | null }>) {
  if (!post) {
    return (
      <section className="mx-auto mb-28 max-w-screen-2xl px-8 lg:px-24">
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
            <Sparkles className="size-7" />
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-stone-950 md:text-4xl">No featured story is live yet</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
            The journal is being refreshed. Check back soon for curated narratives, destination essays, and slow-travel guides.
          </p>
          <Button asChild className="mt-6 rounded-full px-6" variant="outline">
            <Link href="/contact">
              Ask for a curated recommendation
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mb-28 max-w-screen-2xl px-8 lg:px-24">
      <article className="group relative aspect-[21/10] min-h-[480px] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_40px_90px_-55px_rgba(28,25,23,0.65)]">
        <Image alt={post.alt} className="object-cover transition-transform duration-700 group-hover:scale-105" fill priority sizes="100vw" src={post.image} />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
        <div className="absolute bottom-0 left-0 max-w-4xl p-8 text-white md:p-12">
          <span className="mb-5 inline-flex rounded-full bg-emerald-100/95 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-950 backdrop-blur-md">
            {post.badge}
          </span>
          <h2 className="mb-5 text-4xl font-black leading-tight tracking-tight md:text-6xl">{post.title}</h2>
          <p className="max-w-2xl text-lg font-light leading-relaxed text-white/90 md:text-xl">{post.excerpt}</p>
        </div>
      </article>
    </section>
  );
}

function JournalEmptyState() {
  return (
    <section className="mx-auto mb-32 max-w-screen-2xl px-8 lg:px-24">
      <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
          <Search className="size-7" />
        </div>
        <h3 className="mt-5 text-2xl font-black tracking-tight text-stone-950">No additional journal entries yet</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
          We do not have more stories to show right now. Explore again soon for fresh guides, interviews, and destination notes.
        </p>
      </div>
    </section>
  );
}

function JournalGrid({ posts }: Readonly<{ posts: readonly JournalPost[] }>) {
  if (posts.length === 0) {
    return <JournalEmptyState />;
  }

  return (
    <section className="mx-auto mb-32 grid max-w-screen-2xl grid-cols-1 gap-x-12 gap-y-24 px-8 md:grid-cols-2 lg:grid-cols-3 lg:px-24">
      {posts.map((post) => (
        <JournalCard key={post.slug ?? post.title} post={post} />
      ))}
    </section>
  );
}

function CategoryBar() {
  return (
    <section className="sticky top-20 z-40 mx-auto mb-20 max-w-screen-2xl bg-[#f9faf6]/85 px-8 py-6 backdrop-blur-xl lg:px-24">
      <div className="flex flex-wrap items-center justify-center gap-4 border-y border-stone-200 py-6 md:gap-10">
        {categories.map((category) => (
          <Button
            className={
              category === "All Stories"
                ? "h-auto rounded-none border-b-2 border-emerald-800 bg-transparent py-1 text-sm font-black uppercase tracking-widest text-emerald-800 hover:bg-transparent"
                : "h-auto bg-transparent py-1 text-sm font-bold uppercase tracking-widest text-stone-500 hover:bg-transparent hover:text-emerald-800"
            }
            key={category}
            type="button"
            variant="ghost"
          >
            {category}
          </Button>
        ))}
        <Button className="ml-0 h-auto gap-2 bg-transparent py-1 text-sm font-bold text-stone-500 hover:bg-transparent hover:text-emerald-800 md:ml-auto" type="button" variant="ghost">
          <Search className="size-4" />
          Search
        </Button>
      </div>
    </section>
  );
}

function JournalCard({ post }: Readonly<{ post: JournalPost }>) {
  return (
    <article className="group flex flex-col">
      <div className="relative mb-8 aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200">
        <Image
          alt={post.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          src={post.image}
        />
      </div>
      <div className="space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-800">{post.category}</span>
        <h3 className="text-2xl font-black leading-tight text-stone-950 transition-colors group-hover:text-emerald-800">{post.title}</h3>
        <p className="leading-relaxed text-stone-600">{post.excerpt}</p>
        <Button asChild className="text-sm font-black text-stone-950 hover:bg-transparent hover:text-emerald-800" variant="ghost">
          <Link href={`/blog/${post.slug}`}>
            Read Story
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function JournalNewsletter() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-24 lg:px-24">
      <div className="flex flex-col items-center rounded-[2.5rem] bg-stone-100 p-10 text-center md:p-20">
        <Sparkles className="mb-8 size-10 text-emerald-800" />
        <h2 className="mb-6 max-w-2xl text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
          Curated inspiration, delivered to your inbox.
        </h2>
        <p className="mb-10 max-w-xl text-lg leading-relaxed text-stone-600">
          Join 50,000+ curious travelers receiving our monthly editorial digest of stories and hidden guides.
        </p>
        <form className="flex w-full max-w-lg flex-col gap-4 md:flex-row">
          <label className="sr-only" htmlFor="journal-newsletter-email">Email address</label>
          <Input className="min-h-14 flex-1 border-none bg-white px-6 shadow-sm ring-1 ring-stone-200 focus-visible:ring-emerald-800" id="journal-newsletter-email" placeholder="Email address" type="email" />
          <Button className="min-h-14 px-8 font-black">Subscribe Now</Button>
        </form>
        <p className="mt-6 text-xs text-stone-500">By subscribing, you agree to our privacy policy. No spam, ever.</p>
      </div>
    </section>
  );
}

export default function BlogListingPage({ featuredPost, posts }: Readonly<{ featuredPost: FeaturedJournalPost | null; posts: readonly JournalPost[] }>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Blog" />
      <BlogHero />
      <FeaturedPost post={featuredPost} />
      <CategoryBar />
      <JournalGrid posts={posts} />
      <JournalNewsletter />
      <TravelFooter />
    </main>
  );
}
