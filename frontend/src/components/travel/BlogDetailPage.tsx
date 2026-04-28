import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { kyotoNewWaveJournalDetail, type JournalDetail, type JournalDetailRelatedPost } from "@/src/data/mockData";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

function ArticleHero({ article }: Readonly<{ article: JournalDetail }>) {
  return (
    <>
      <section className="relative mb-20 h-[716px] min-h-[600px] overflow-hidden bg-stone-200">
        <Image alt={article.heroAlt} className="object-cover object-center" fill priority sizes="100vw" src={article.heroImage} />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/25 to-transparent" />
      </section>
      <header className="relative z-10 mx-auto -mt-52 mb-20 max-w-4xl rounded-[2rem] bg-white p-8 text-center shadow-[0_25px_70px_-45px_rgba(28,25,23,0.55)] md:p-16">
        <div className="mb-6 flex justify-center">
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-950">
            {article.category}
          </span>
        </div>
        <h1 className="mb-8 text-5xl font-black leading-[0.95] tracking-tighter text-stone-950 md:text-7xl">{article.title}</h1>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-stone-500">
          <span className="font-bold text-stone-950">By {article.author}</span>
          <span className="size-1 rounded-full bg-stone-300" />
          <span>{article.meta}</span>
          <span className="size-1 rounded-full bg-stone-300" />
          <span>{article.date}</span>
        </div>
      </header>
    </>
  );
}

function ArticleBody({ article }: Readonly<{ article: JournalDetail }>) {
  const [openingSection, machiyaSection, closingSection] = article.sections;

  return (
    <article className="mx-auto max-w-3xl px-8 text-lg leading-relaxed text-stone-600 md:px-0">
      <p className="text-xl font-medium leading-relaxed text-stone-950">{article.intro}</p>
      {openingSection.body.map((paragraph) => (
        <p className="mt-10" key={paragraph}>{paragraph}</p>
      ))}
      <figure className="my-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_25px_70px_-45px_rgba(28,25,23,0.55)]">
          <Image alt={article.inlineImage.alt} className="object-cover" fill sizes="(min-width: 768px) 768px, 100vw" src={article.inlineImage.image} />
        </div>
        <figcaption className="mt-4 text-center text-xs font-semibold uppercase tracking-widest text-stone-400">
          The interplay of light and shadow is central to the new machiya aesthetic.
        </figcaption>
      </figure>
      <section>
        <h2 className="mb-6 mt-16 text-3xl font-black tracking-tight text-stone-950">{machiyaSection.heading}</h2>
        <p>{machiyaSection.body[0]}</p>
        <blockquote className="my-12 border-l-2 border-emerald-700 pl-6 font-serif text-2xl italic leading-relaxed text-emerald-800">
          “{article.quote}”
        </blockquote>
        <p>{machiyaSection.body[1]}</p>
      </section>
      <div className="my-16 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-stone-200 md:col-span-7">
          <Image alt={article.secondaryFeature.image.alt} className="object-cover" fill sizes="(min-width: 768px) 58vw, 100vw" src={article.secondaryFeature.image.image} />
        </div>
        <div className="flex flex-col justify-center rounded-[2rem] bg-stone-100 p-8 md:col-span-5">
          <h3 className="mb-4 text-xl font-black tracking-tight text-stone-950">{article.secondaryFeature.title}</h3>
          <p className="text-sm leading-relaxed text-stone-600">{article.secondaryFeature.body}</p>
        </div>
      </div>
      <section>
        <h2 className="mb-6 mt-16 text-3xl font-black tracking-tight text-stone-950">{closingSection.heading}</h2>
        {closingSection.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
    </article>
  );
}

function BackToJournal() {
  return (
    <div className="mx-auto my-20 max-w-3xl border-t border-stone-200 px-8 pt-12 text-center md:px-0">
      <Button asChild className="text-sm font-bold" variant="ghost">
        <Link href="/blog">
          <ArrowLeft className="size-4" />
          Back to Journal
        </Link>
      </Button>
    </div>
  );
}

function RelatedPostCard({ post }: Readonly<{ post: JournalDetailRelatedPost }>) {
  return (
    <Link className="group block overflow-hidden rounded-[2rem] bg-white shadow-sm transition-shadow hover:shadow-[0_25px_70px_-50px_rgba(28,25,23,0.55)]" href={post.href}>
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
        <Image alt={post.alt} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 768px) 33vw, 100vw" src={post.image} />
      </div>
      <div className="p-8">
        <span className="mb-3 block text-[10px] font-black uppercase tracking-widest text-emerald-800">{post.category}</span>
        <h3 className="mb-2 text-lg font-black tracking-tight text-stone-950">{post.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-stone-600">{post.excerpt}</p>
      </div>
    </Link>
  );
}

function RelatedStories({ article }: Readonly<{ article: JournalDetail }>) {
  return (
    <section className="mx-auto max-w-screen-2xl rounded-t-[2.5rem] bg-stone-100 px-8 py-20 lg:px-24">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-800">Continue Reading</p>
        <h2 className="text-3xl font-black tracking-tight text-stone-950">Related Stories</h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {article.relatedPosts.map((post) => (
          <RelatedPostCard key={post.title} post={post} />
        ))}
      </div>
    </section>
  );
}

export default function BlogDetailPage() {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Blog" />
      <div className="pt-20">
        <ArticleHero article={kyotoNewWaveJournalDetail} />
        <ArticleBody article={kyotoNewWaveJournalDetail} />
        <BackToJournal />
        <RelatedStories article={kyotoNewWaveJournalDetail} />
      </div>
      <TravelFooter />
    </main>
  );
}
