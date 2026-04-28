import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, Dumbbell, MapPin, MessageCircle, Sparkles, Star, Utensils, Waves } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
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

function BookingCard({ hotel }: Readonly<{ hotel: HotelDetail }>) {
  return (
    <aside className="lg:sticky lg:top-32 lg:col-span-4">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-2xl shadow-stone-950/5 md:p-10">
        <div className="mb-10 flex items-baseline justify-between">
          <div>
            <span className="text-4xl font-black text-stone-950">{hotel.price}</span>
            <span className="ml-2 text-stone-500">/ night</span>
          </div>
          <div className="flex items-center gap-1 text-sm font-black text-stone-950">
            <Star className="size-4 fill-emerald-800 text-emerald-800" />
            {hotel.booking.rating}
          </div>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-stone-100 p-4">
              <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-stone-500" htmlFor="hotel-check-in">Check-in</label>
              <Input className="h-auto border-none bg-transparent p-0 text-sm font-bold shadow-none focus-visible:ring-0" id="hotel-check-in" readOnly value={hotel.booking.checkIn} />
            </div>
            <div className="rounded-xl bg-stone-100 p-4">
              <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-stone-500" htmlFor="hotel-check-out">Check-out</label>
              <Input className="h-auto border-none bg-transparent p-0 text-sm font-bold shadow-none focus-visible:ring-0" id="hotel-check-out" readOnly value={hotel.booking.checkOut} />
            </div>
          </div>
          <button className="flex w-full items-center justify-between rounded-xl bg-stone-100 p-4 text-left" type="button">
            <span>
              <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-stone-500">Travelers</span>
              <span className="text-sm font-bold text-stone-950">{hotel.booking.travelers}</span>
            </span>
            <ChevronDown className="size-5 text-stone-500" />
          </button>
          <Button className="mt-2 w-full py-6 text-lg font-black" size="lg">
            Check Availability
          </Button>
          <p className="text-center text-xs text-stone-500">You won&apos;t be charged yet</p>
          <div className="space-y-4 border-t border-stone-200 pt-8">
            <div className="flex justify-between text-stone-500">
              <span>{hotel.price} x {hotel.booking.nights}</span>
              <span>{hotel.booking.nightlyTotal}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Wellness Service Fee</span>
              <span>{hotel.booking.fee}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-black text-stone-950">
              <span>Total</span>
              <span>{hotel.booking.total}</span>
            </div>
          </div>
          <div className="border-t border-stone-200 pt-8">
            <Button className="w-full gap-2 text-xs uppercase tracking-widest" variant="outline">
              <MessageCircle className="size-4" />
              Ask a Curator
            </Button>
          </div>
        </div>
      </div>
    </aside>
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
        <BookingCard hotel={shiningRiversideHotelDetail} />
      </div>
      <TravelFooter />
    </main>
  );
}
