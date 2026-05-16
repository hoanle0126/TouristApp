import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  Search,
  Send,
  Users,
} from "lucide-react";

import { CircularImageRailSection } from "@/src/components/travel/CircularImageRailSection";
import { FeedbackPartnersSection } from "@/src/components/travel/FeedbackPartnersSection";
import { HeroImageCarousel } from "@/src/components/travel/HeroImageCarousel";
import { HomeEventsSection } from "@/src/components/travel/HomeEventsSection";
import { RegionalHighlightsSection } from "@/src/components/travel/RegionalHighlightsSection";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
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
import type { ApiSiteContentSettings } from "@/src/lib/api/types";
import type {
  BlogPost,
  DestinationCard,
  HotelCard,
  TourCard,
  TravelEventCard,
  TravelPartner,
  TravelerFeedback,
  VisualDiaryItem,
} from "@/src/types/travel";

interface HeroImageSlide {
  readonly alt: string;
  readonly image: string;
}

function buildHeroSlides(
  items: readonly VisualDiaryItem[],
  siteContent: Pick<
    ApiSiteContentSettings,
    | "homeHeroImage"
    | "heroImageTwo"
    | "heroImageThree"
  >,
): readonly HeroImageSlide[] {
  const seenImages = new Set<string>();
  const baseSlides = [
    { alt: "Hero Image 1", image: siteContent.homeHeroImage },
    { alt: "Hero Image 2", image: siteContent.heroImageTwo },
    { alt: "Hero Image 3", image: siteContent.heroImageThree },
    ...items.slice(0, 3).map((item) => ({ alt: item.alt, image: item.image })),
  ];

  return baseSlides
    .filter((slide) => {
      if (seenImages.has(slide.image)) {
        return false;
      }

      seenImages.add(slide.image);
      return true;
    })
    .slice(0, 3);
}

interface SectionHeadingProps {
  readonly align?: "left" | "center";
  readonly eyebrow: string;
  readonly subtitle?: string;
  readonly title: string;
}

interface HeroSectionProps {
  readonly slides: readonly HeroImageSlide[];
  readonly siteContent: Pick<
    ApiSiteContentSettings,
    "siteName" | "siteTagline" | "siteDescription"
  >;
}

interface HotelShowcaseSectionProps {
  readonly hotels: readonly HotelCard[];
}

interface HotelShowcaseCardProps {
  readonly hotel: HotelCard;
}

interface BlogSectionProps {
  readonly posts: readonly BlogPost[];
}

interface BlogCardProps {
  readonly post: BlogPost;
}

function buildTourHighlightItems(tours: readonly TourCard[]) {
  return tours.map((tour) => ({
    alt: tour.alt,
    badge: tour.badge,
    category: tour.destination.title,
    description: tour.description,
    href: tour.slug ? `/tours/${tour.slug}` : "/tours",
    image: tour.image,
    meta: [tour.destination.title, tour.duration, tour.guests].filter(Boolean),
    price: tour.price,
    title: tour.title,
  }));
}

function buildHotelHighlightItems(hotels: readonly HotelCard[]) {
  return hotels.map((hotel) => ({
    alt: hotel.alt,
    badge: hotel.badge,
    category: hotel.location,
    description:
      hotel.amenities.length > 0
        ? hotel.amenities.slice(0, 3).join(", ")
        : `Curated stay in ${hotel.location}.`,
    href: hotel.slug ? `/hotels/${hotel.slug}` : "/hotels",
    image: hotel.image,
    meta: hotel.amenities.slice(0, 3),
    price: hotel.price,
    title: hotel.name,
  }));
}

function SectionHeading({
  align = "left",
  eyebrow,
  subtitle,
  title,
}: Readonly<SectionHeadingProps>) {
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

function LandingEmptyState({
  actionHref,
  actionLabel,
  description,
  icon,
  title,
}: Readonly<{
  actionHref: string;
  actionLabel: string;
  description: string;
  icon: ReactNode;
  title: string;
}>) {
  return (
    <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-8 py-14 text-center shadow-sm">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
        {icon}
      </div>
      <h3 className="mt-5 text-2xl font-black tracking-tight text-stone-950">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 md:text-base">
        {description}
      </p>
      <Button asChild className="mt-6 rounded-full px-6" variant="outline">
        <Link href={actionHref}>
          {actionLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

function BlogEmptyState() {
  return (
    <LandingEmptyState
      actionHref="/blog"
      actionLabel="Visit the journal"
      description="Our editorial team has not published a featured story for this moment yet. Check the journal for the latest travel notes and destination essays."
      icon={<Newspaper className="size-7" />}
      title="No featured stories yet"
    />
  );
}

function DestinationEmptyState() {
  return (
    <LandingEmptyState
      actionHref="/destinations"
      actionLabel="Browse all destinations"
      description="Curated escapes are being refreshed right now. Explore the full destination collection while the next featured journeys are prepared."
      icon={<Compass className="size-7" />}
      title="Featured escapes are being refreshed"
    />
  );
}

function BlogSectionEmptyState({
  posts,
}: Readonly<{ posts: readonly BlogPost[] }>) {
  return posts.length === 0 ? <BlogEmptyState /> : null;
}

function HeroSection({ slides, siteContent }: Readonly<HeroSectionProps>) {
  return (
    <section className="relative flex min-h-[920px] w-full items-center justify-center overflow-hidden">
      <HeroImageCarousel slides={slides} />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p className="mb-5 text-sm font-black uppercase tracking-[0.32em] text-white/85">
          {siteContent.siteTagline}
        </p>
        <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tighter text-white md:text-7xl">
          Discover <span className="text-emerald-100">{siteContent.siteName}</span>
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-xl font-light tracking-wide text-white/90 md:text-2xl">
          {siteContent.siteDescription}
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

function HotelShowcaseCard({ hotel }: Readonly<HotelShowcaseCardProps>) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className="relative h-80 overflow-hidden">
        <Image
          alt={hotel.alt}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          src={hotel.image}
        />
      </div>
      <div className="p-8">
        <div className="mb-3 flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            {hotel.location}
          </p>
          <p className="text-sm font-bold text-emerald-800">{hotel.price}</p>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-stone-950">{hotel.name}</h3>
        <p className="mb-6 text-sm leading-relaxed text-stone-600">
          {hotel.amenities.slice(0, 3).join(" • ")}
        </p>
        <div className="flex items-center justify-between border-t border-stone-200 pt-6">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-800">
            Hotel
          </span>
          <Button asChild className="rounded-full px-4" variant="ghost">
            <Link href={hotel.slug ? `/hotels/${hotel.slug}` : "/hotels"}>
              Explore More
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function HotelShowcaseSection({ hotels }: Readonly<HotelShowcaseSectionProps>) {
  return (
    <section className="bg-stone-100 py-24" id="hotels">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured Stays"
            subtitle="Architectural retreats and private sanctuaries selected for atmosphere, service, and sense of place."
            title="Curated Hotels"
          />
          <Button asChild className="w-fit" size="pill" variant="outline">
            <Link href="/hotels">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        {hotels.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {hotels.slice(0, 3).map((hotel) => (
              <HotelShowcaseCard hotel={hotel} key={hotel.slug ?? hotel.name} />
            ))}
          </div>
        ) : (
          <DestinationEmptyState />
        )}
      </div>
    </section>
  );
}

function BlogCard({ post }: Readonly<BlogCardProps>) {
  return (
    <article className="flex flex-col">
      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl">
        <Image
          alt={post.title}
          className="object-cover"
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          src={post.image}
        />
      </div>
      <span className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-700">
        {post.category}
      </span>
      <h3 className="mb-4 text-2xl font-bold leading-snug text-stone-950">
        {post.title}
      </h3>
      <p className="mb-6 flex-grow text-sm leading-relaxed text-stone-600">
        {post.excerpt}
      </p>
      <Link
        className="group inline-flex items-center gap-2 text-sm font-bold text-emerald-800"
        href={post.slug ? `/blog/${post.slug}` : "/blog"}
      >
        Read More <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </Link>
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
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.title} post={post} />
            ))}
          </div>
        ) : (
          <BlogSectionEmptyState posts={posts} />
        )}
      </div>
    </section>
  );
}

function ContactSection({
  siteContent,
}: Readonly<{
  siteContent: Pick<ApiSiteContentSettings, "contactEmail" | "hotline" | "siteName">;
}>) {
  return (
    <section className="bg-stone-50 py-32">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-24 px-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-8 text-5xl font-extrabold tracking-tighter text-stone-950">
            Let&apos;s Design Your Journey
          </h2>
          <p className="mb-12 text-xl font-light text-stone-600">
            Have a specific vision for your next escape? Our curators are ready to bring it to life with unparalleled detail.
          </p>
          <div className="space-y-8">
            {[
              ["Global Headquarters", `124 ${siteContent.siteName} Way, London, UK`],
              ["Direct Line", siteContent.hotline],
              ["General Inquiries", siteContent.contactEmail],
            ].map(([label, value]) => (
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
              <Button asChild className="w-full py-6 text-base font-bold">
                <Link href="/contact">
                  <Send className="size-4" />
                  Send Inquiry
                </Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

interface TravelLandingPageProps {
  readonly blogPosts: readonly BlogPost[];
  readonly destinationCards: readonly DestinationCard[];
  readonly eventCards: readonly TravelEventCard[];
  readonly hotelCards: readonly HotelCard[];
  readonly siteContent: Pick<
    ApiSiteContentSettings,
    | "siteName"
    | "siteTagline"
    | "siteDescription"
    | "contactEmail"
    | "hotline"
    | "homeHeroImage"
    | "heroImageTwo"
    | "heroImageThree"
  >;
  readonly tourCards: readonly TourCard[];
  readonly travelPartners: readonly TravelPartner[];
  readonly travelerFeedback: readonly TravelerFeedback[];
  readonly visualDiaryItems: readonly VisualDiaryItem[];
}

export default function TravelLandingPage({
  blogPosts,
  destinationCards,
  eventCards,
  hotelCards,
  siteContent,
  tourCards,
  travelPartners,
  travelerFeedback,
  visualDiaryItems,
}: Readonly<TravelLandingPageProps>) {
  const heroSlides = buildHeroSlides(visualDiaryItems, siteContent);
  const featuredTourItems = buildTourHighlightItems(tourCards);
  const featuredHotelItems = buildHotelHighlightItems(hotelCards);

  return (
    <main className="min-h-screen bg-stone-50 text-stone-950">
      <TravelHeader activeItem="Home" />
      <HeroSection siteContent={siteContent} slides={heroSlides} />
      <HomeEventsSection events={eventCards} />
      <CircularImageRailSection items={destinationCards} />
      <HotelShowcaseSection hotels={hotelCards} />
      <RegionalHighlightsSection items={featuredTourItems} />
      <RegionalHighlightsSection
        ctaHref="/hotels"
        ctaLabel="Browse stays"
        description="Private villas, design-led resorts, and high-touch stays arranged in a mirrored carousel for faster browsing."
        items={featuredHotelItems}
        reverse
        title="Featured Stays"
      />
      <BlogSection posts={blogPosts} />
      <FeedbackPartnersSection
        feedback={travelerFeedback}
        partners={travelPartners}
      />
      <ContactSection siteContent={siteContent} />
      <TravelFooter />
    </main>
  );
}
