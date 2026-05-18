import Image from "next/image";
import { ArrowRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { ContactPageForm } from "@/src/components/travel/ContactPageForm";
import { contactPageData, type ContactOffice } from "@/src/data/mockData";
import type { ApiSiteContentSettings } from "@/src/lib/api/types";
import { TravelFooter, TravelHeader } from "@/src/components/travel/TravelShell";

function ContactHero() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-20 pt-36 lg:px-24 lg:pt-44">
      <div className="max-w-4xl">
        <h1 className="mb-8 text-6xl font-black leading-tight tracking-tighter text-stone-950 md:text-8xl">{contactPageData.heroTitle}</h1>
        <p className="max-w-2xl text-xl font-light leading-relaxed text-stone-600 md:text-2xl">{contactPageData.heroSubtitle}</p>
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
  siteContent,
}: Readonly<{
  siteContent: Pick<ApiSiteContentSettings, "contactEmail" | "hotline">;
}>) {
  return (
    <aside className="space-y-16 lg:col-span-5">
      <section className="rounded-[2rem] bg-stone-100 p-10">
        <h2 className="mb-8 text-2xl font-black tracking-tight text-stone-950">Global Offices</h2>
        <div className="space-y-8">
          {contactPageData.offices.map((office, index) => (
            <div key={office.name}>
              <OfficeItem office={office} />
              {index < contactPageData.offices.length - 1 ? <div className="mt-8 h-px bg-stone-200" /> : null}
            </div>
          ))}
        </div>
      </section>
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
        <div>
          <h2 className="mb-4 text-sm font-black uppercase tracking-widest text-stone-500">Departments</h2>
          <ul className="space-y-4">
            {contactPageData.departments.map((department) => (
              <li key={department.email}>
                <a className="block font-bold text-stone-950 transition-colors hover:text-red-800" href={`mailto:${department.email}`}>
                  {department.name}
                </a>
                <span className="text-sm text-stone-500">{department.email}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </aside>
  );
}

function ContactForm() {
  return (
    <section className="lg:col-span-7">
      <div className="relative overflow-hidden rounded-[2rem] border border-stone-200/70 bg-white p-8 shadow-[0_25px_80px_-60px_rgba(28,25,23,0.65)] md:p-14">
        <div className="pointer-events-none absolute right-0 top-0 size-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-red-100/70 blur-3xl" />
        <div className="relative z-10">
          <h2 className="mb-3 text-3xl font-black tracking-tight text-stone-950">Send an Inquiry</h2>
          <p className="mb-10 text-stone-600">Share details about your desired journey, and a dedicated curator will be in touch within 24 hours.</p>
          <ContactPageForm />
        </div>
      </div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="mx-auto max-w-screen-2xl px-8 pb-32 lg:px-24">
      <div className="group relative h-[500px] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_25px_80px_-65px_rgba(28,25,23,0.7)]">
        <Image alt={contactPageData.map.alt} className="object-cover grayscale-[50%] sepia-[10%] transition-all duration-1000 group-hover:grayscale-0" fill sizes="100vw" src={contactPageData.map.image} />
        <div className="absolute inset-0 bg-stone-200/35 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
        <div className="absolute bottom-8 left-8 max-w-xs rounded-2xl border border-stone-200/70 bg-white/90 p-6 shadow-xl backdrop-blur-md">
          <h2 className="mb-2 text-lg font-black text-stone-950">{contactPageData.map.title}</h2>
          <p className="mb-4 text-sm leading-relaxed text-stone-600">{contactPageData.map.note}</p>
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
  siteContent,
}: Readonly<{
  siteContent: Pick<ApiSiteContentSettings, "contactEmail" | "hotline">;
}>) {
  return (
    <main className="min-h-screen bg-[#f9faf6] text-stone-950">
      <TravelHeader activeItem="Contact" />
      <ContactHero />
      <section className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-8 pb-32 lg:grid-cols-12 lg:gap-16 lg:px-24">
        <ContactSidebar siteContent={siteContent} />
        <ContactForm />
      </section>
      <MapSection />
      <TravelFooter />
    </main>
  );
}
