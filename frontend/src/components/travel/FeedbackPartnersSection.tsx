import { Quote } from "lucide-react";

import { TravelMomentsCarousel } from "@/src/components/travel/TravelMomentsCarousel";
import type {
  TravelMoment,
  TravelPartner,
  TravelerFeedback,
} from "@/src/types/travel";

export function FeedbackPartnersSection({
  feedback,
  moments,
  partners,
}: Readonly<{
  feedback: readonly TravelerFeedback[];
  moments: readonly TravelMoment[];
  partners: readonly TravelPartner[];
}>) {
  if (
    feedback.length === 0 &&
    partners.length === 0 &&
    moments.length === 0
  ) {
    return null;
  }

  return (
    <section className="bg-[#f9faf6] py-24">
      <div className="mx-auto max-w-screen-2xl px-8">
        {feedback.length > 0 ? (
          <div>
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-red-800">
                Feedback
              </p>
              <h2 className="text-4xl font-black tracking-tight text-stone-950 md:text-5xl">
                What travelers say about the journey
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {feedback.map((item) => (
                <article
                  className="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm shadow-stone-950/5"
                  key={item.name}
                >
                  <Quote className="mb-6 size-8 text-red-700" />
                  <p className="text-lg font-medium leading-8 tracking-tight text-stone-800">
                    “{item.quote}”
                  </p>
                  <div className="mt-8 border-t border-stone-200 pt-5">
                    <h3 className="font-black text-stone-950">{item.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">{item.role}</p>
                    <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-800">
                      {item.trip}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <TravelMomentsCarousel moments={moments} />
          </div>
        ) : moments.length > 0 ? (
          <TravelMomentsCarousel moments={moments} />
        ) : null}

        {partners.length > 0 ? (
          <div className="mt-16 rounded-[2rem] border border-amber-200/70 bg-amber-50 p-6 shadow-sm shadow-amber-900/5 md:p-8">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-700">
                  Partners
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-stone-950">
                  Trusted travel partners
                </h3>
              </div>
              <p className="max-w-lg text-sm leading-6 text-stone-600">
                A network of stays, guides, and local operators that helps each
                journey run smoothly from start to finish.
              </p>
            </div>
            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 [scrollbar-width:thin] md:overflow-visible">
              {partners.slice(0, 5).map((partner) => (
                <div
                  className="min-w-50 flex-1 rounded-2xl border border-amber-200/70 bg-white px-5 py-4 transition-colors hover:border-amber-300 hover:bg-amber-50/60 md:min-w-0"
                  key={partner.name}
                >
                  <p className="text-sm font-black uppercase tracking-tight text-stone-950">
                    {partner.name}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {partner.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
