import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import type { TravelEventCard } from "@/src/types/travel";

export function HomeEventsSection({ events }: Readonly<{ events: readonly TravelEventCard[] }>) {
  const visibleEvents = events.slice(0, 2);

  if (visibleEvents.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f9faf6] py-20">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-red-700">Now trending</p>
          <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl lg:text-6xl">
            Featured moments & upcoming departures
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {visibleEvents.map((event, index) => (
            <article className={index === 0 ? "group relative min-h-[28rem] overflow-hidden rounded-4xl border border-stone-200 bg-stone-950 shadow-xl shadow-stone-950/8 lg:col-span-2 lg:min-h-[34rem]" : "group relative min-h-[28rem] overflow-hidden rounded-4xl border border-stone-200 bg-stone-950 shadow-sm"} key={event.title}>
              <Image alt={event.alt} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes={index === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"} src={event.image} />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent" />
              <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-red-700 backdrop-blur">
                {event.badge}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <div className="mb-4 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white/80">
                  <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{event.date}</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{event.location}</span>
                </div>
                <h3 className="text-3xl font-black tracking-tight md:text-4xl">{event.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/82 md:text-base">{event.description}</p>
                <Button asChild className="mt-6 rounded-full bg-white text-stone-950 hover:bg-red-100" size="sm">
                  <Link href={event.href}>
                    Explore more
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
