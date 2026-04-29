import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Dumbbell, MapPin, Sparkles, Star, Utensils, Waves } from "lucide-react";

import { HotelBookingCard } from "@/src/components/travel/HotelBookingCard";
import { Button } from "@/src/components/ui/button";
import { shiningRiversideHotelDetail, type HotelDetail, type HotelDetailAmenity } from "@/src/data/mockData";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

function AmenityIcon({ icon }: Readonly<{ icon: HotelDetailAmenity["icon"] }>) {
  const className = "size-8 text-emerald-800";

  if (icon === "pool") {
    return <Waves className={className} />;
  }

  if (icon === "spa") {
    return <Sparkles className={className} />;
  }

  if (icon === "dining") {
    return <Utensils className={className} />;
  }

  return <Dumbbell className={className} />;
}

function HotelBreadcrumb({ title }: Readonly<{ title: string }>) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/75">
        <li>
          <Link className="transition-colors hover:text-white" href="/">
            Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4 text-white/40" />
        </li>
        <li>
          <Link className="transition-colors hover:text-white" href="/hotels">
            Hotels
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="size-4 text-white/40" />
        </li>
        <li aria-current="page" className="max-w-full truncate text-emerald-100">
          {title}
        </li>
      </ol>
    </nav>
  );
}

function HotelHero({ hotel }: Readonly<{ hotel: HotelDetail }>) {
  const [firstGalleryImage, secondGalleryImage] = hotel.gallery;

  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-16 pt-32 lg:px-24">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] bg-stone-200 md:col-span-8 lg:col-span-9 lg:min-h-[720px]">
          <Image alt={hotel.heroAlt} className="object-cover" fill priority sizes="(min-width: 1024px) 75vw, 100vw" src={hotel.heroImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent" />
          <div className="absolute bottom-0 left-0 max-w-4xl p-8 text-white md:p-12">
            <HotelBreadcrumb title={hotel.title} />
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
              <Star className="size-4 fill-amber-300 text-amber-300" />
              Highly Rated Choice
            </div>
            <h1 className="mb-3 text-5xl font-black leading-[0.9] tracking-tighter md:text-7xl lg:text-8xl">{hotel.title}</h1>
            <p className="text-xl font-light text-white/90 md:text-2xl">{hotel.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:col-span-4 lg:col-span-3">
          <div className="relative min-h-72 overflow-hidden rounded-[2rem] bg-stone-200 md:min-h-0">
            <Image alt={firstGalleryImage.alt} className="object-cover" fill sizes="(min-width: 1024px) 25vw, 100vw" src={firstGalleryImage.image} />
          </div>
          <div className="group relative min-h-72 overflow-hidden rounded-[2rem] bg-stone-200 md:min-h-0">
            <Image alt={secondGalleryImage.alt} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 1024px) 25vw, 100vw" src={secondGalleryImage.image} />
            <div className="absolute inset-0 flex items-center justify-center bg-stone-950/45 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="rounded-full bg-white/95 px-5 py-2 text-xs font-black uppercase tracking-widest text-stone-950">+12 Photos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewSection({ hotel }: Readonly<{ hotel: HotelDetail }>) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3 text-stone-500">
        <MapPin className="size-5 text-emerald-800" />
        <span className="font-medium">{hotel.address}</span>
      </div>
      <h2 className="mb-8 text-4xl font-black tracking-tight text-stone-950">An Editorial Sanctuary on the Thu Bon</h2>
      <div className="space-y-6 text-lg leading-relaxed text-stone-600">
        {hotel.description.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function AmenitiesSection({ hotel }: Readonly<{ hotel: HotelDetail }>) {
  return (
    <section className="rounded-[2rem] bg-stone-100 p-8 md:p-12">
      <h2 className="mb-10 text-2xl font-black tracking-tight text-stone-950">Property Curations</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        {hotel.amenities.map((amenity) => (
          <div className="space-y-4" key={amenity.title}>
            <AmenityIcon icon={amenity.icon} />
            <p className="font-bold text-stone-950">{amenity.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SuitesSection({ hotel }: Readonly<{ hotel: HotelDetail }>) {
  return (
    <section>
      <h2 className="mb-10 text-3xl font-black tracking-tight text-stone-950">Selected Suites</h2>
      <div className="space-y-14">
        {hotel.suites.map((suite, index) => (
          <article className="group grid grid-cols-1 items-center gap-8 md:grid-cols-2" key={suite.name}>
            <div className={index % 2 === 1 ? "relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-stone-200 md:order-2" : "relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-stone-200"}>
              <Image alt={suite.alt} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="(min-width: 768px) 50vw, 100vw" src={suite.image} />
            </div>
            <div className={index % 2 === 1 ? "space-y-6 md:order-1" : "space-y-6"}>
              {suite.badge ? (
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-950">
                  {suite.badge}
                </span>
              ) : null}
              <h3 className="text-2xl font-black tracking-tight text-stone-950">{suite.name}</h3>
              <p className="leading-relaxed text-stone-600">{suite.description}</p>
              <div className="flex items-center justify-between border-t border-stone-200 pt-5">
                <span className="text-3xl font-black text-emerald-800">
                  {suite.price}
                  <span className="ml-1 text-sm font-normal text-stone-500">/ night</span>
                </span>
                <Button className="text-xs uppercase tracking-widest" size="sm" variant="ghost">
                  Select Room
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewsSection({ hotel }: Readonly<{ hotel: HotelDetail }>) {
  return (
    <section className="border-t border-stone-200 pt-24">
      <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <h2 className="mb-4 text-4xl font-black tracking-tight text-stone-950">{hotel.scoreLabel}</h2>
          <div className="flex items-center gap-4">
            <span className="text-6xl font-black text-emerald-800">{hotel.score}</span>
            <div className="text-stone-500">
              <p className="font-bold text-stone-700">{hotel.scoreSummary}</p>
              <p className="text-sm">Verified Guest Experiences</p>
            </div>
          </div>
        </div>
        <div className="w-full space-y-4 md:w-1/2">
          {hotel.reviewScores.map((item) => (
            <div className="space-y-2" key={item.label}>
              <div className="flex justify-between text-sm font-bold text-stone-700">
                <span>{item.label}</span>
                <span>{item.score}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-stone-200">
                <div className="h-full rounded-full bg-emerald-800" style={{ width: `${Number(item.score) * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {hotel.reviews.map((review) => (
          <article className="rounded-[1.5rem] border border-stone-200 bg-white p-8 shadow-sm" key={review.author}>
            <div className="mb-4 flex gap-1 text-emerald-800" aria-label="Five star review">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star className="size-4 fill-current" key={index} />
              ))}
            </div>
            <p className="mb-6 text-lg font-medium italic leading-relaxed text-stone-700">“{review.quote}”</p>
            <div className="flex items-center gap-4">
              <div className="flex size-11 items-center justify-center rounded-full bg-emerald-800 text-sm font-black text-white">{review.initials}</div>
              <div>
                <p className="font-bold text-stone-950">{review.author}</p>
                <p className="text-xs text-stone-500">{review.stayed}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function HotelDetailPage() {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Hotels" />
      <HotelHero hotel={shiningRiversideHotelDetail} />
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 items-start gap-16 px-8 pb-24 md:gap-24 lg:grid-cols-12 lg:px-24">
        <div className="space-y-24 lg:col-span-8">
          <OverviewSection hotel={shiningRiversideHotelDetail} />
          <AmenitiesSection hotel={shiningRiversideHotelDetail} />
          <SuitesSection hotel={shiningRiversideHotelDetail} />
          <ReviewsSection hotel={shiningRiversideHotelDetail} />
        </div>
        <HotelBookingCard hotel={shiningRiversideHotelDetail} />
      </div>
      <TravelFooter />
    </main>
  );
}
