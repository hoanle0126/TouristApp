import Link from "next/link";
import { Navigation, Search, Sparkles } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { navigationItems } from "@/src/data/mockData";

interface TravelHeaderProps {
  readonly activeItem?: string;
}

function itemHref(item: string) {
  if (item === "Home") {
    return "/";
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

export function TravelHeader({ activeItem = "Home" }: Readonly<TravelHeaderProps>) {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 shadow-sm shadow-emerald-900/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-5 lg:px-8">
        <Link className="inline-flex items-center gap-2 text-2xl font-bold uppercase tracking-tighter text-stone-950" href="/">
          <Navigation className="size-6 text-emerald-800" strokeWidth={2.4} />
          CURATOR
        </Link>
        <div className="hidden items-center space-x-8 md:flex">
          {navigationItems.map((item) => (
            <Link
              className={
                item === activeItem
                  ? "border-b-2 border-emerald-700 pb-1 text-sm font-semibold uppercase tracking-tight text-emerald-700"
                  : "text-sm font-semibold uppercase tracking-tight text-stone-500 transition-colors hover:text-emerald-700"
              }
              href={itemHref(item)}
              key={item}
            >
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Button aria-label="Search" className="hidden text-stone-600 hover:text-emerald-800 md:inline-flex" size="icon" variant="ghost">
            <Search className="size-5" />
          </Button>
          <Button className="shadow-emerald-950/10 active:scale-95">
            <Sparkles className="size-4" />
            Book Now
          </Button>
        </div>
      </div>
    </nav>
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
