import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Heart,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  Star,
  Users,
} from "lucide-react";

import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import { VisualDiaryCarousel } from "@/src/components/travel/VisualDiaryCarousel";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import {
  blogPosts,
  destinationCards,
  heroImage,
  suggestionCards,
  visualDiaryItems,
  type BlogPost,
  type DestinationCard,
  type SuggestionCard,
  type VisualDiaryItem,
} from "@/src/data/mockData";

interface SectionHeadingProps {
  readonly align?: "left" | "center";
  readonly eyebrow: string;
  readonly subtitle?: string;
  readonly title: string;
}

interface HeroSectionProps {
  readonly image: string;
}

interface VisualDiarySectionProps {
  readonly items: readonly VisualDiaryItem[];
}

interface DestinationSectionProps {
  readonly destinations: readonly DestinationCard[];
}

interface DestinationCardViewProps {
  readonly destination: DestinationCard;
}

interface SuggestionsSectionProps {
  readonly suggestions: readonly SuggestionCard[];
}

interface SuggestionCardViewProps {
  readonly suggestion: SuggestionCard;
}

interface BlogSectionProps {
  readonly posts: readonly BlogPost[];
}

interface BlogCardProps {
  readonly post: BlogPost;
}


function SectionHeading({ align = "left", eyebrow, subtitle, title }: Readonly<SectionHeadingProps>) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </span>
      <h2 className="text-4xl font-extrabold tracking-tighter text-stone-950 md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 max-w-xl text-stone-600">{subtitle}</p>
      ) : null}
    </div>
  );
}

function HeroSection({ image }: Readonly<HeroSectionProps>) {
  return (
    <section className="relative flex min-h-[920px] items-center justify-center overflow-hidden">
      <Image
        alt="Misty mountains reflected in a crystal lake at first light"
        className="object-cover brightness-75 scale-105"
        fill
        priority
        sizes="100vw"
        src={image}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tighter text-white md:text-7xl">
          Crafting Your <span className="text-emerald-100">Personal Odyssey</span>
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl font-light tracking-wide text-white/90 md:text-2xl">
          A digital monograph of the world&apos;s most curated destinations and exclusive experiences.
        </p>
        <Card className="mx-auto max-w-5xl rounded-3xl border-white/60 bg-white/95 p-2 shadow-2xl shadow-black/25 backdrop-blur-xl">
          <form action="/search" className="flex flex-col gap-2 md:flex-row">
            <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-4">
              <div className="rounded-2xl bg-stone-50/80 p-4 text-left">
                <Label className="inline-flex items-center gap-1.5" htmlFor="destination">
                  <MapPin className="size-3.5 text-emerald-700" />
                  Destination
                </Label>
                <Input
                  className="h-10 border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
                  id="destination"
                  name="q"
                  placeholder="Where to?"
                />
              </div>
              <div className="rounded-2xl bg-stone-50/80 p-4 text-left">
                <Label className="inline-flex items-center gap-1.5" htmlFor="check-in">
                  <CalendarDays className="size-3.5 text-emerald-700" />
                  Check-in
                </Label>
                <Input
                  className="h-10 border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
                  id="check-in"
                  type="date"
                />
              </div>
              <div className="rounded-2xl bg-stone-50/80 p-4 text-left">
                <Label className="inline-flex items-center gap-1.5" htmlFor="check-out">
                  <CalendarDays className="size-3.5 text-emerald-700" />
                  Check-out
                </Label>
                <Input
                  className="h-10 border-none bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
                  id="check-out"
                  type="date"
                />
              </div>
              <div className="rounded-2xl bg-stone-50/80 p-4 text-left">
                <Label className="inline-flex items-center gap-1.5">
                  <Users className="size-3.5 text-emerald-700" />
                  Guests
                </Label>
                <Select defaultValue="2-adults">
                  <SelectTrigger className="h-10 border-none bg-transparent px-0 py-0 shadow-none focus:ring-0 focus-visible:ring-0">
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-adult">1 Adult</SelectItem>
                    <SelectItem value="2-adults">2 Adults</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="h-auto min-h-16 px-10 text-base font-bold" size="lg" type="submit">
              <Search className="size-5" />
              Search
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}

function VisualDiarySection({ items }: Readonly<VisualDiarySectionProps>) {
  return (
    <section className="overflow-hidden bg-stone-50 py-24">
      <VisualDiaryCarousel items={items} />
    </section>
  );
}

function DestinationCardView({ destination }: Readonly<DestinationCardViewProps>) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className="relative h-80 overflow-hidden">
        <Image alt={destination.alt} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 1024px) 33vw, 100vw" src={destination.image} />
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur">
          <Star className="size-4 fill-emerald-700 text-emerald-700" />
          <span className="text-xs font-bold text-stone-950">{destination.rating}</span>
        </div>
      </div>
      <div className="p-8">
        <h3 className="mb-2 text-2xl font-bold text-stone-950">{destination.title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-stone-600">{destination.description}</p>
        <div className="flex items-center justify-between border-t border-stone-200 pt-6">
          <span className="text-lg font-bold text-emerald-800">
            {destination.price} <span className="text-xs font-normal text-stone-500">/ person</span>
          </span>
          <Button asChild className="rounded-full px-4" variant="ghost">
            <Link href={destination.href}>
              Explore More
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function DestinationSection({ destinations }: Readonly<DestinationSectionProps>) {
  return (
    <section className="bg-stone-100 py-24" id="destinations">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured Escapes"
            subtitle="Selected journeys that balance thoughtful pace, cinematic landscapes, and high-touch hospitality."
            title="Curated Destinations"
          />
          <Button asChild className="w-fit" size="pill" variant="outline">
            <Link href="/destinations">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCardView destination={destination} key={destination.title} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SuggestionCardView({ suggestion }: Readonly<SuggestionCardViewProps>) {
  return (
    <article className="group cursor-pointer">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl">
        <Image alt={suggestion.alt} className="object-cover transition-transform duration-700 group-hover:scale-110" fill sizes="(min-width: 1024px) 25vw, 50vw" src={suggestion.image} />
        <Button aria-label={`Save ${suggestion.title}`} className="absolute left-4 top-4" size="icon" variant="glass">
          <Heart className="size-5" />
        </Button>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-bold text-stone-950">{suggestion.title}</h4>
          <p className="text-sm text-stone-600">{suggestion.location}</p>
        </div>
        <p className="whitespace-nowrap font-bold text-emerald-800">{suggestion.price}</p>
      </div>
    </article>
  );
}

function SuggestionsSection({ suggestions }: Readonly<SuggestionsSectionProps>) {
  return (
    <section className="bg-stone-50 py-24">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            subtitle="Bespoke selections tailored to your aesthetic preferences and travel philosophy."
            eyebrow="Private Collection"
            title="Suggestions For You"
          />
          <div className="flex flex-wrap gap-2">
            {['All', 'Tours', 'Hotels', 'Villas', 'Activities'].map((filter) => (
              <Button
                key={filter}
                size="pill"
                variant={filter === 'All' ? "secondary" : "outline"}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((suggestion) => (
            <SuggestionCardView key={suggestion.title} suggestion={suggestion} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post }: Readonly<BlogCardProps>) {
  return (
    <article className="flex flex-col">
      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl">
        <Image alt={post.title} className="object-cover" fill sizes="(min-width: 768px) 33vw, 100vw" src={post.image} />
      </div>
      <span className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700">{post.category}</span>
      <h3 className="mb-4 text-2xl font-bold leading-snug text-stone-950">{post.title}</h3>
      <p className="mb-6 flex-grow text-sm leading-relaxed text-stone-600">{post.excerpt}</p>
      <a className="group inline-flex items-center gap-2 text-sm font-bold text-emerald-800" href="#">
        Read More <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </a>
    </article>
  );
}

function BlogSection({ posts }: Readonly<BlogSectionProps>) {
  return (
    <section className="bg-stone-100 py-24">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-16">
          <SectionHeading align="center" eyebrow="Editorial" title="Stories, Tips & Guides" />
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="bg-stone-50 py-32">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-24 px-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 text-5xl font-extrabold tracking-tighter text-stone-950">Let&apos;s Design Your Journey</h2>
          <p className="mb-12 text-xl font-light text-stone-600">Have a specific vision for your next escape? Our curators are ready to bring it to life with unparalleled detail.</p>
          <div className="space-y-8">
            {[['Global Headquarters', '124 Curated Way, London, UK'], ['Direct Line', '+44 20 7946 0123'], ['General Inquiries', 'hello@curator.travel']].map(([label, value]) => (
              <div className="flex items-start gap-6" key={label}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  {label === "Global Headquarters" ? <MapPin className="size-5" /> : null}
                  {label === "Direct Line" ? <Phone className="size-5" /> : null}
                  {label === "General Inquiries" ? <Mail className="size-5" /> : null}
                </div>
                <div>
                  <h4 className="font-bold text-stone-950">{label}</h4>
                  <p className="text-stone-600">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Card className="bg-stone-100/90 shadow-xl shadow-stone-950/5">
          <CardContent className="p-8 md:p-12">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="First Name" type="text" />
                </div>
                <div>
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Last Name" type="text" />
                </div>
              </div>
              <div>
                <Label className="inline-flex items-center gap-1.5" htmlFor="email">
                  <Mail className="size-3.5 text-emerald-700" />
                  Email Address
                </Label>
                <Input id="email" placeholder="Email Address" type="email" />
              </div>
              <div>
                <Label className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-emerald-700" />
                  Desired Destination
                </Label>
                <Select defaultValue="europe">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="americas">The Americas</SelectItem>
                    <SelectItem value="oceania">Oceania</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="inline-flex items-center gap-1.5" htmlFor="message">
                  <Send className="size-3.5 text-emerald-700" />
                  Message
                </Label>
                <Textarea id="message" placeholder="Message" rows={4} />
              </div>
              <Button className="w-full py-6 text-base font-bold" type="submit">
                <Send className="size-4" />
                Send Inquiry
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default function TravelLandingPage() {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <TravelHeader activeItem="Home" />
      <HeroSection image={heroImage} />
      <VisualDiarySection items={visualDiaryItems} />
      <DestinationSection destinations={destinationCards} />
      <SuggestionsSection suggestions={suggestionCards} />
      <BlogSection posts={blogPosts} />
      <ContactSection />
      <TravelFooter />
    </main>
  );
}
