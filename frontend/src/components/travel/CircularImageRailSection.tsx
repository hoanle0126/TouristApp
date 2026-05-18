import Image from "next/image";
import Link from "next/link";

import type { DestinationCard } from "@/src/types/travel";

export function CircularImageRailSection({ items }: Readonly<{ items: readonly DestinationCard[] }>) {
  const visibleItems = items.slice(0, 9);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden border-y border-stone-200 bg-white py-10">
      <div className="mx-auto max-w-screen-2xl px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-800">Destination list</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950 md:text-4xl">Browse featured destinations at a glance</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-stone-500">
            A compact destination rail that lets travelers quickly scan places before diving into the full collection.
          </p>
        </div>
        <div className="-mx-8 overflow-x-auto px-8 pb-2 hide-scrollbar">
          <ul className="flex min-w-max snap-x gap-6 motion-safe:animate-[none] md:gap-8">
            {visibleItems.map((item) => (
              <li className="w-32 shrink-0 snap-start text-center" key={item.title}>
                <Link className="group block" href={item.href}>
                  <div className="relative mx-auto size-28 overflow-hidden rounded-full bg-stone-200 ring-4 ring-stone-100 transition-transform duration-300 group-hover:-translate-y-1 group-hover:ring-red-100 md:size-32">
                    <Image alt={item.alt} className="object-cover" fill sizes="128px" src={item.image} />
                  </div>
                  <h3 className="mt-3 text-sm font-black tracking-tight text-stone-950">{item.title}</h3>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">Destination</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
