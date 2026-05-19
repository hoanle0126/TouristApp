import Image from "next/image";
import { ArrowRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ContactPageForm } from "@/src/components/travel/ContactPageForm";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";
import type { ContactPageContent } from "@/src/lib/api/contact-page";
import type { ApiSiteContentSettings } from "@/src/lib/api/types";

type ContactOffice = ContactPageContent["offices"][number];

function ContactHero({ content }: Readonly<{ content: ContactPageContent }>) {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-20 pt-36 lg:px-24 lg:pt-44">
      <div className="max-w-4xl">
        <h1 className="mb-8 text-6xl font-black leading-tight tracking-tighter text-stone-950 md:text-8xl">{content.heroTitle}</h1>
        <p className="max-w-2xl text-xl font-light leading-relaxed text-stone-600 md:text-2xl">{content.heroSubtitle}</p>
      </div>
    </section>
  );
}

function OfficeItem({ office }: Readonly<{ office: ContactOffice }>) {
  return (
    <article className="flex items-start gap-6">
      <MapPin className="mt-1 size-7 shrink-0 text-red-800" strokeWidth={1.6} />
      <div>
        <h3 className="mb-2 text-lg font-black text-stone-950">{office.name}</h3>
        <p className="mb-3 text-sm leading-relaxed text-stone-600">
          {office.address.map((line) => (
            <span className="block" key={line}>{line}</span>
          ))}
        </p>
        <Button className="h-auto text-sm font-bold text-red-800 hover:bg-transparent" variant="ghost">
          View on map
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </article>
  );
}

function ContactSidebar({
  content,
  siteContent,
}: Readonly<{
  content: ContactPageContent;
  siteContent: Pick<ApiSiteContentSettings, "contactEmail" | "hotline">;
}>) {
  return (
    <aside className="space-y-16 lg:col-span-5">
      {content.offices.length > 0 ? (
        <section className="rounded-[2rem] bg-stone-100 p-10">
          <h2 className="mb-8 text-2xl font-black tracking-tight text-stone-950">Global Offices</h2>
          <div className="space-y-8">
            {content.offices.map((office, index) => (
              <div key={office.name}>
                <OfficeItem office={office} />
                {index < content.offices.length - 1 ? <div className="mt-8 h-px bg-stone-200" /> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-stone-500">Direct Lines</h2>
          <ul className="space-y-4">
            <li>
              <a className="group flex items-center gap-3 font-bold text-stone-950 transition-colors hover:text-red-800" href="tel:+442071234567">
                <Phone className="size-5 text-stone-400 transition-colors group-hover:text-red-800" />
                {siteContent.hotline}
              </a>
            </li>
            <li>
              <a className="group flex items-center gap-3 font-bold text-stone-950 transition-colors hover:text-red-800" href={`mailto:${siteContent.contactEmail}`}>
                <Mail className="size-5 text-stone-400 transition-colors group-hover:text-red-800" />
                {siteContent.contactEmail}
              </a>
            </li>
          </ul>
        </div>
        {content.departments.length > 0 ? (
          <div>
            <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-stone-500">Departments</h2>
            <ul className="space-y-4">
              {content.departments.map((department) => (
                <li key={department.email}>
                  <a className="block font-bold text-stone-950 transition-colors hover:text-red-800" href={`mailto:${department.email}`}>
                    {department.name}
                  </a>
                  <span className="text-sm text-stone-500">{department.email}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </aside>
  );
}

function ContactForm({ content }: Readonly<{ content: ContactPageContent }>) {
  return (
    <section className="lg:col-span-7">
      <div className="relative overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white p-8 shadow-[0_25px_80px_-60px_rgba(28,25,23,0.65)] md:p-14">
        <div className="pointer-events-none absolute right-0 top-0 size-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-red-100/70 blur-3xl" />
        <div className="relative z-10">
          <h2 className="mb-3 text-3xl font-black tracking-tight text-stone-950">{content.formTitle}</h2>
          <p className="mb-10 text-stone-600">{content.formSubtitle}</p>
          <ContactPageForm />
        </div>
      </div>
    </section>
  );
}

function MapSection({ content }: Readonly<{ content: ContactPageContent }>) {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-32 lg:px-24">
      <div className="group relative h-[500px] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_25px_80px_-65px_rgba(28,25,23,0.7)]">
        <Image alt={content.mapAlt} className="object-cover grayscale-[50%] sepia-[10%] transition-all duration-1000 group-hover:grayscale-0" fill sizes="100vw" src={content.mapImage} />
        <div className="absolute inset-0 bg-stone-200/35 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
        <div className="absolute bottom-8 left-8 max-w-xs rounded-2xl border border-stone-200/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
          <h2 className="mb-2 text-lg font-black text-stone-950">{content.mapTitle}</h2>
          <p className="mb-4 text-sm leading-relaxed text-stone-600">{content.mapNote}</p>
          <Button className="h-auto text-sm font-bold text-red-800 hover:bg-transparent" variant="ghost">
            Get Directions
            <ExternalLink className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage({
  content,
  siteContent,
}: Readonly<{
  content: ContactPageContent;
  siteContent: Pick<ApiSiteContentSettings, "contactEmail" | "hotline">;
}>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Contact" />
      <ContactHero content={content} />
      <section className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-8 pb-32 lg:grid-cols-12 lg:gap-16 lg:px-24">
        <ContactSidebar content={content} siteContent={siteContent} />
        <ContactForm content={content} />
      </section>
      <MapSection content={content} />
      <TravelFooter />
    </main>
  );
}
