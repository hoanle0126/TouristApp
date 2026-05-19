"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Menu, Search, Sparkles, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";

interface MobileNavigationItem {
  readonly href: string;
  readonly label: string;
}

interface MobileNavigationDropdownItem {
  readonly description: string;
  readonly href: string;
  readonly title: string;
}

interface MobileNavigationDropdown {
  readonly eyebrow: string;
  readonly items: readonly MobileNavigationDropdownItem[];
}

export interface MobileNavigationProps {
  readonly activeItem?: string;
  readonly contactEmail: string;
  readonly dropdowns: Partial<Record<"Destinations" | "Tours" | "Hotels", MobileNavigationDropdown>>;
  readonly hotline: string;
  readonly items: readonly MobileNavigationItem[];
}

export function MobileNavigation({
  activeItem,
  contactEmail,
  dropdowns,
  hotline,
  items,
}: Readonly<MobileNavigationProps>) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          aria-label="Open navigation menu"
          className="text-stone-700 hover:text-red-800 lg:hidden"
          size="icon"
          variant="ghost"
        >
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-[320px] sm:max-w-[380px]">
        <DrawerHeader className="flex items-center justify-between gap-3 border-b border-stone-200/70 px-6 py-5 text-left">
          <div>
            <DrawerTitle className="text-xs font-black uppercase tracking-[0.22em] text-red-800">
              Menu
            </DrawerTitle>
            <DrawerDescription className="text-sm text-stone-500">
              Explore journeys, stays and stories
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <Button aria-label="Close navigation menu" size="icon" variant="ghost">
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <nav>
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = item.label === activeItem;

                return (
                  <li key={item.label}>
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={
                        isActive
                          ? "flex items-center justify-between rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-800"
                          : "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-100 hover:text-red-800"
                      }
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                      <ArrowRight className="size-4 text-red-700" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {(["Destinations", "Tours", "Hotels"] as const).map((key) => {
            const dropdown = dropdowns[key];

            if (!dropdown || dropdown.items.length === 0) {
              return null;
            }

            return (
              <section className="mt-8" key={key}>
                <p className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-red-700">
                  {dropdown.eyebrow}
                </p>
                <ul className="space-y-1">
                  {dropdown.items.map((dropdownItem) => (
                    <li key={dropdownItem.title}>
                      <Link
                        className="block rounded-2xl px-3 py-3 transition-colors hover:bg-stone-100"
                        href={dropdownItem.href}
                        onClick={() => setOpen(false)}
                      >
                        <span className="flex items-center justify-between gap-3 text-sm font-black tracking-tight text-stone-950">
                          {dropdownItem.title}
                          <ArrowRight className="size-4 text-red-700" />
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-stone-500">
                          {dropdownItem.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>

        <div className="space-y-3 border-t border-stone-200/70 bg-stone-50/80 px-6 py-5">
          <div className="grid grid-cols-2 gap-2">
            <Button
              asChild
              className="w-full text-stone-700 hover:text-red-800"
              variant="ghost"
            >
              <Link href="/search" onClick={() => setOpen(false)}>
                <Search className="size-4" />
                Search
              </Link>
            </Button>
            <Button
              asChild
              className="w-full bg-red-900 text-white hover:bg-red-950"
            >
              <Link href="/checkout" onClick={() => setOpen(false)}>
                <Sparkles className="size-4" />
                Book Now
              </Link>
            </Button>
          </div>
          <div className="space-y-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            <p>{hotline}</p>
            <a
              className="block text-stone-700 transition-colors hover:text-red-800"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
