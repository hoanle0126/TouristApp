import Link from "next/link";
import { ArrowRight, Navigation, Phone, Search, Sparkles } from "lucide-react";

import { CartSidebar } from "@/src/components/travel/CartSidebar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { navigationDropdowns, navigationItems, travelPromoBar, travelTopBar } from "@/src/data/mockData";

interface TravelHeaderProps {
  readonly activeItem?: string;
}

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

function TravelTopBar() {
  return (
    <div className="bg-stone-950 text-white">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-1 px-6 py-2 text-[10px] font-bold uppercase tracking-[0.18em] sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="inline-flex items-center gap-2">
            <Phone className="size-3.5 text-emerald-300" />
            {travelTopBar.hotline}
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-white/35 sm:inline-block" />
          <span className="text-white/65">{travelTopBar.note}</span>
        </div>
        <a className="w-fit text-white/65 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" href={`mailto:${travelTopBar.email}`}>
          {travelTopBar.email}
        </a>
      </div>
    </div>
  );
}

function TravelPromoBar() {
  return (
    <div className="bg-violet-700 text-white shadow-sm shadow-violet-950/20">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-center gap-3 px-6 py-2 text-center text-[11px] font-black uppercase tracking-[0.2em] lg:px-8">
        <span>{travelPromoBar.label}</span>
        <Link className="hidden rounded-full bg-white/15 px-3 py-1 text-[10px] transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex" href={travelPromoBar.href}>
          {travelPromoBar.cta}
        </Link>
      </div>
    </div>
  );
}

function NavigationDropdown({ item }: Readonly<{ item: string }>) {
  const dropdown = navigationDropdowns[item as keyof typeof navigationDropdowns];

  if (!dropdown) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute left-1/2 top-full w-80 -translate-x-1/2 pt-5 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
      <div className="rounded-3xl border border-stone-200/80 bg-white p-4 text-left shadow-2xl shadow-stone-950/12 ring-1 ring-stone-950/5">
        <p className="mb-3 px-2 text-[10px] font-black uppercase tracking-[0.24em] text-violet-700">{dropdown.eyebrow}</p>
        <ul className="space-y-1">
          {dropdown.items.map((dropdownItem) => (
            <li key={dropdownItem.title}>
              <Link className="group/item block rounded-2xl px-3 py-3 transition-colors hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:outline-none" href={dropdownItem.href}>
                <span className="flex items-center justify-between gap-3 text-sm font-black tracking-tight text-stone-950">
                  {dropdownItem.title}
                  <ArrowRight className="size-4 text-emerald-700 transition-transform group-hover/item:translate-x-0.5" />
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

function DesktopNavigation({ activeItem }: Readonly<TravelHeaderProps>) {
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
                  ? "border-b-2 border-emerald-700 pb-1 text-xs font-semibold uppercase tracking-tight text-emerald-700 xl:text-sm"
                  : "text-xs font-semibold uppercase tracking-tight text-stone-500 transition-colors hover:text-emerald-700 focus-visible:text-emerald-700 focus-visible:outline-none xl:text-sm"
              }
              href={itemHref(item)}
            >
              {item}
            </Link>
            <NavigationDropdown item={item} />
          </div>
        );
      })}
    </div>
  );
}

export function TravelHeader({ activeItem = "Home" }: Readonly<TravelHeaderProps>) {
  return (
    <header className="fixed top-0 z-50 w-full">
      <TravelTopBar />
      <TravelPromoBar />
      <nav className="bg-white/85 shadow-sm shadow-emerald-900/5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-5 lg:px-8">
          <Link className="inline-flex items-center gap-2 text-xl font-bold uppercase tracking-tighter text-stone-950 sm:text-2xl" href="/">
            <Navigation className="size-6 text-emerald-800" strokeWidth={2.4} />
            CURATOR
          </Link>
          <DesktopNavigation activeItem={activeItem} />
          <div className="flex items-center gap-3 sm:gap-4">
            <CartSidebar />
            <Button asChild aria-label="Search" className="hidden text-stone-600 hover:text-emerald-800 md:inline-flex" size="icon" variant="ghost">
              <Link href="/search">
                <Search className="size-5" />
              </Link>
            </Button>
            <Button asChild className="shadow-emerald-950/10 active:scale-95">
              <Link href="/checkout">
                <Sparkles className="size-4" />
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function TravelFooter() {
  return (
    <footer className="border-t border-stone-200/70 bg-stone-100">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-12 px-8 py-16 md:grid-cols-4 lg:grid-cols-6">
        <div className="space-y-6 md:col-span-2">
          <Link className="inline-flex items-center gap-2 text-xl font-bold uppercase tracking-tighter text-stone-950" href="/">
            <Navigation className="size-5 text-emerald-800" />
            CURATOR TRAVEL
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-stone-600">
            Defining the future of luxury exploration through intentional design and authentic local connection.
          </p>
        </div>
        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-950">Explore</h4>
          <ul className="space-y-4 text-sm text-stone-500">
            <li><Link className="transition-colors hover:text-emerald-700" href="/tours">Journeys</Link></li>
            <li><Link className="transition-colors hover:text-emerald-700" href="/hotels">Stays</Link></li>
            <li><Link className="transition-colors hover:text-emerald-700" href="/blog">Journal</Link></li>
            <li><a className="transition-colors hover:text-emerald-700" href="#">Sustainability</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-950">Legal</h4>
          <ul className="space-y-4 text-sm text-stone-500">
            <li><a className="transition-colors hover:text-emerald-700" href="#">Privacy</a></li>
            <li><a className="transition-colors hover:text-emerald-700" href="#">Terms</a></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-stone-950">Newsletter</h4>
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="newsletter-email">Email address for newsletter</label>
            <Input className="min-w-0 flex-1 border-none bg-white shadow-sm ring-1 ring-stone-200 focus-visible:ring-emerald-700" id="newsletter-email" placeholder="Email address" type="email" />
            <Button className="px-6 text-xs uppercase tracking-widest">Join</Button>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-2xl border-t border-stone-200 px-8 py-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400">© 2024 CURATOR TRAVEL. The digital curator experience.</p>
      </div>
    </footer>
  );
}
