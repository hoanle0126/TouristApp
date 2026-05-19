import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Phone, Search, Sparkles } from "lucide-react";

import { CartSidebar } from "@/src/components/travel/CartSidebar";
import { MobileNavigation } from "@/src/components/travel/MobileNavigation";
import { NewsletterForm } from "@/src/components/travel/NewsletterForm";
import { Button } from "@/src/components/ui/button";
import { getDestinations } from "@/src/lib/api/destinations";
import { getHotels } from "@/src/lib/api/hotels";
import { getSiteContentSettings } from "@/src/lib/api/settings";
import { getTours } from "@/src/lib/api/tours";
import type { DestinationCard, HotelCard, TourCard } from "@/src/types/travel";
import { navigationItems } from "@/src/data/mockData";

interface TravelHeaderProps {
  readonly activeItem?: string;
}

type NavigationDropdownItem = {
  readonly description: string;
  readonly href: string;
  readonly title: string;
};

type NavigationDropdownData = {
  readonly eyebrow: string;
  readonly items: readonly NavigationDropdownItem[];
};

type NavigationDropdownMap = Partial<Record<"Destinations" | "Tours" | "Hotels", NavigationDropdownData>>;

function itemHref(item: string) {
  if (item === "Home") {
    return "/";
  }

  if (item === "Destinations") {
    return "/destinations";
  }

  if (item === "Tours") {
    return "/tours";
  }

  if (item === "Hotels") {
    return "/hotels";
  }

  if (item === "Blog") {
    return "/blog";
  }

  if (item === "About Us") {
    return "/about-us";
  }

  if (item === "Contact") {
    return "/contact";
  }

  return "#";
}

function buildDestinationDropdownItems(destinations: readonly DestinationCard[]): readonly NavigationDropdownItem[] {
  return destinations.slice(0, 3).map((destination) => ({
    description: destination.description,
    href: destination.slug ? `/destinations/${destination.slug}` : destination.href,
    title: destination.title,
  }));
}

function buildTourDropdownItems(tours: readonly TourCard[]): readonly NavigationDropdownItem[] {
  return tours.slice(0, 3).map((tour) => ({
    description: tour.description,
    href: tour.slug ? `/tours/${tour.slug}` : "/tours",
    title: tour.title,
  }));
}

function buildHotelDropdownItems(hotels: readonly HotelCard[]): readonly NavigationDropdownItem[] {
  return hotels.slice(0, 3).map((hotel) => ({
    description: hotel.location,
    href: hotel.slug ? `/hotels/${hotel.slug}` : "/hotels",
    title: hotel.name,
  }));
}

async function getNavigationDropdowns(): Promise<NavigationDropdownMap> {
  const [destinationsResult, toursResult, hotelsResult] = await Promise.allSettled([
    getDestinations({ perPage: 3 }),
    getTours({ perPage: 3 }),
    getHotels({ perPage: 3 }),
  ]);

  return {
    Destinations: {
      eyebrow: "Suggested escapes",
      items: destinationsResult.status === "fulfilled" ? buildDestinationDropdownItems(destinationsResult.value) : [],
    },
    Tours: {
      eyebrow: "Popular journeys",
      items: toursResult.status === "fulfilled" ? buildTourDropdownItems(toursResult.value) : [],
    },
    Hotels: {
      eyebrow: "Featured stays",
      items: hotelsResult.status === "fulfilled" ? buildHotelDropdownItems(hotelsResult.value) : [],
    },
  };
}

function NavigationDropdown({
  dropdowns,
  item,
}: Readonly<{ dropdowns: NavigationDropdownMap; item: string }>) {
  const dropdown = dropdowns[item as keyof NavigationDropdownMap];

  if (!dropdown || dropdown.items.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-1/2 top-full w-80 -translate-x-1/2 pt-5 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
      <div className="rounded-3xl border border-stone-200/80 bg-white p-4 text-left shadow-2xl shadow-stone-950/12 ring-1 ring-stone-950/5">
        <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.24em] text-red-700">{dropdown.eyebrow}</p>
        <ul className="space-y-1">
          {dropdown.items.map((dropdownItem) => (
            <li key={dropdownItem.title}>
              <Link className="group/item block rounded-2xl px-3 py-3 transition-colors hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none" href={dropdownItem.href}>
                <span className="flex items-center justify-between gap-3 text-sm font-black tracking-tight text-stone-950">
                  {dropdownItem.title}
                  <ArrowRight className="size-4 text-red-700 transition-transform group-hover/item:translate-x-0.5" />
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-stone-500">{dropdownItem.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DesktopNavigation({
  activeItem,
  dropdowns,
}: Readonly<TravelHeaderProps & { dropdowns: NavigationDropdownMap }>) {
  return (
    <div className="hidden items-center gap-4 lg:flex xl:gap-6">
      {navigationItems.map((item) => {
        const isActive = item === activeItem;

        return (
          <div className="group relative" key={item}>
            <Link
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "border-b-2 border-red-700 pb-1 text-xs font-semibold uppercase tracking-tight text-red-700 xl:text-sm"
                  : "text-xs font-semibold uppercase tracking-tight text-stone-500 transition-colors hover:text-red-700 focus-visible:text-red-700 focus-visible:outline-none xl:text-sm"
              }
              href={itemHref(item)}
            >
              {item}
            </Link>
            <NavigationDropdown dropdowns={dropdowns} item={item} />
          </div>
        );
      })}
    </div>
  );
}

export async function TravelHeader({ activeItem = "Home" }: Readonly<TravelHeaderProps>) {
  const [dropdowns, siteContent] = await Promise.all([
    getNavigationDropdowns(),
    getSiteContentSettings().catch(() => null),
  ]);

  const brandName = siteContent?.siteName ?? "CURATOR";
  const hotline = siteContent?.hotline ?? "Hotline: +44 (0) 20 7123 4567";
  const topBarNote = siteContent?.topBarNote ?? "Private itinerary support, 24/7";
  const contactEmail = siteContent?.contactEmail ?? "inquiries@curator.travel";
  const promoLabel = siteContent?.promoLabel ?? "Travel freely without worrying about the price";
  const promoCta = siteContent?.promoCta ?? "View offers";
  const promoHref = siteContent?.promoHref ?? "/tours";

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="bg-stone-950 text-white">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-1 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.18em] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-2">
              <Phone className="size-3.5 text-red-300" />
              {hotline}
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:inline-block" />
            <span className="text-white/65">{topBarNote}</span>
          </div>
          <a className="w-fit text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
        </div>
      </div>
      <div className="bg-red-900 text-white shadow-sm shadow-red-950/20">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-center gap-3 px-6 py-2 text-center text-[11px] font-black uppercase tracking-[0.2em] lg:px-8">
          <span>{promoLabel}</span>
          <Link className="hidden rounded-full bg-white/15 px-3 py-1 text-[10px] transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex" href={promoHref}>
            {promoCta}
          </Link>
        </div>
      </div>
      <nav className="bg-white/85 shadow-sm shadow-red-900/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-5 lg:px-8">
          <Link className="inline-flex items-center gap-2 text-xl font-bold uppercase tracking-tighter text-stone-950 sm:text-2xl" href="/">
            <Image src="/logo.png" alt={brandName} width={48} height={48} className="h-12 w-auto object-contain" priority />
          </Link>
          <DesktopNavigation activeItem={activeItem} dropdowns={dropdowns} />
          <div className="flex items-center gap-3 sm:gap-4">
            <CartSidebar />
            <Button asChild aria-label="Search" className="hidden text-stone-600 hover:text-red-800 md:inline-flex" size="icon" variant="ghost">
              <Link href="/search">
                <Search className="size-5" />
              </Link>
            </Button>
            <Button asChild className="hidden bg-red-900 text-white shadow-red-950/10 hover:bg-red-950 active:scale-95 sm:inline-flex">
              <Link href="/checkout">
                <Sparkles className="size-4" />
                Book Now
              </Link>
            </Button>
            <MobileNavigation
              activeItem={activeItem}
              contactEmail={contactEmail}
              dropdowns={dropdowns}
              hotline={hotline}
              items={navigationItems.map((item) => ({ href: itemHref(item), label: item }))}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}

export async function TravelFooter() {
  const siteContent = await getSiteContentSettings().catch(() => null);
  const brandName = siteContent?.siteName ?? "CURATOR";
  const siteDescription =
    siteContent?.siteDescription ??
    "Curated destinations and exclusive travel experiences.";
  return (
    <footer className="border-t border-stone-200/70 bg-stone-100">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-8 py-16 md:grid-cols-4 lg:grid-cols-6">
        <div className="space-y-6 md:col-span-2">
          <Link className="inline-flex items-center gap-2 text-xl font-bold uppercase tracking-tighter text-stone-950" href="/">
            <Image src="/logo.png" alt={brandName} width={40} height={40} className="h-10 w-auto object-contain" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-stone-600">
            {siteDescription}
          </p>
        </div>
        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-950">Explore</h4>
          <ul className="space-y-4 text-sm text-stone-500">
            <li><Link className="transition-colors hover:text-red-700" href="/tours">Journeys</Link></li>
            <li><Link className="transition-colors hover:text-red-700" href="/hotels">Stays</Link></li>
            <li><Link className="transition-colors hover:text-red-700" href="/blog">Journal</Link></li>
            <li><a className="transition-colors hover:text-red-700" href="#">Sustainability</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-950">Legal</h4>
          <ul className="space-y-4 text-sm text-stone-500">
            <li><a className="transition-colors hover:text-red-700" href="#">Privacy</a></li>
            <li><a className="transition-colors hover:text-red-700" href="#">Terms</a></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-950">Newsletter</h4>
          <NewsletterForm />
        </div>
      </div>
      <div className="mx-auto max-w-screen-2xl border-t border-stone-200 px-8 py-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">© 2024 {brandName}. The digital curator experience.</p>
      </div>
    </footer>
  );
}
