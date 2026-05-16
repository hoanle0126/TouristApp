import { MapPin, Search } from "lucide-react";

export function DestinationsSkeleton() {
  return (
    <div className="min-w-0 flex-1 animate-pulse">
      <div className="mb-8 flex flex-col gap-5 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 h-3 w-24 rounded bg-stone-200"></div>
          <div className="h-10 w-64 rounded bg-stone-200 md:h-12"></div>
          <div className="mt-3 h-4 w-32 rounded bg-stone-200"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-12 rounded bg-stone-200"></div>
          <div className="h-5 w-24 rounded bg-stone-200"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <article className="group" key={i}>
            <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200 shadow-sm"></div>
            <div className="space-y-4 px-1">
              <div>
                <div className="mb-2 h-3 w-24 rounded bg-stone-200"></div>
                <div className="h-8 w-3/4 rounded bg-stone-200"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-stone-200"></div>
                <div className="h-4 w-5/6 rounded bg-stone-200"></div>
              </div>
              <div className="flex justify-end border-t border-stone-100 pt-5">
                <div className="h-8 w-20 rounded bg-stone-200"></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ToursSkeleton() {
  return (
    <div className="min-w-0 flex-1 animate-pulse">
      <div className="mb-8 flex flex-col gap-5 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 h-3 w-32 rounded bg-stone-200"></div>
          <div className="h-10 w-72 rounded bg-stone-200 md:h-12"></div>
          <div className="mt-3 h-4 w-40 rounded bg-stone-200"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-12 rounded bg-stone-200"></div>
          <div className="h-5 w-24 rounded bg-stone-200"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <article className="group" key={i}>
            <div className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-200 shadow-sm"></div>
            <div className="space-y-4 px-1">
              <div className="flex justify-between gap-4">
                <div className="h-8 w-2/3 rounded bg-stone-200"></div>
                <div className="h-6 w-16 rounded bg-stone-200"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-20 rounded-full bg-stone-200"></div>
                <div className="h-6 w-24 rounded-full bg-stone-200"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-stone-200"></div>
                <div className="h-4 w-4/5 rounded bg-stone-200"></div>
              </div>
              <div className="flex justify-end border-t border-stone-100 pt-5">
                <div className="h-8 w-24 rounded bg-stone-200"></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function HotelsSkeleton() {
  return (
    <div className="min-w-0 flex-1 animate-pulse">
      <div className="mb-8 flex flex-col gap-5 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 h-3 w-28 rounded bg-stone-200"></div>
          <div className="h-10 w-60 rounded bg-stone-200 md:h-12"></div>
          <div className="mt-3 h-4 w-36 rounded bg-stone-200"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-12 rounded bg-stone-200"></div>
          <div className="h-5 w-24 rounded bg-stone-200"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 gap-y-16 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <article className="group" key={i}>
            <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-[2rem] bg-stone-200 shadow-sm"></div>
            <div className="space-y-4 px-1">
              <div>
                <div className="mb-2 h-3 w-32 rounded bg-stone-200"></div>
                <div className="h-8 w-3/4 rounded bg-stone-200"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="h-5 w-16 rounded bg-stone-200"></div>
                <div className="h-5 w-16 rounded bg-stone-200"></div>
                <div className="h-5 w-16 rounded bg-stone-200"></div>
              </div>
              <div className="flex items-center justify-between border-t border-stone-100 pt-5">
                <div className="h-6 w-20 rounded bg-stone-200"></div>
                <div className="h-8 w-24 rounded bg-stone-200"></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
