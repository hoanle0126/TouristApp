"use client";

import Link from "next/link";
import {
  Bell,
  CalendarRange,
  CalendarDays,
  Camera,
  ChevronRight,
  Clock3,
  Compass,
  CreditCard,
  Hotel,
  LayoutDashboard,
  MapPinned,
  Menu,
  Search,
  Settings2,
  SquarePen,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

export interface AdminNavItem {
  readonly href: string;
  readonly icon: LucideIcon;
  readonly label: string;
}

const adminNavItems: readonly AdminNavItem[] = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/tours", icon: Compass, label: "Tours" },
  { href: "/admin/destinations", icon: MapPinned, label: "Destinations" },
  { href: "/admin/hotels", icon: Hotel, label: "Hotels" },
  { href: "/admin/bookings", icon: CreditCard, label: "Bookings" },
  { href: "/admin/blogs", icon: SquarePen, label: "Blogs" },
  { href: "/admin/events", icon: CalendarDays, label: "Events" },
  { href: "/admin/moments-captured", icon: Camera, label: "Moments" },
  { href: "/admin/settings", icon: Settings2, label: "Settings" },
] as const;

interface AdminShellProps {
  readonly activePath: string;
  readonly action?: React.ReactNode;
  readonly children: React.ReactNode;
  readonly dateLabel: string;
  readonly pageTitle: string;
  readonly rangeValue?: string;
  readonly searchPlaceholder: string;
  readonly sectionLabel: string;
  readonly teamValue?: string;
}

export function AdminShell({
  activePath,
  action,
  children,
  dateLabel,
  pageTitle,
  rangeValue = "7d",
  searchPlaceholder,
  sectionLabel,
  teamValue = "operations",
}: Readonly<AdminShellProps>) {
  return (
    <main className="min-h-screen bg-[#ecefe5] text-stone-950">
      <div className="grid min-h-screen xl:grid-cols-[288px_minmax(0,1fr)]">
        <aside className="hidden border-r border-stone-200/80 bg-[#f3f4ee] xl:flex xl:w-72 xl:flex-col">
          <AdminSidebarContent activePath={activePath} />
        </aside>

        <div className="min-w-0">
          <AdminTopBar
            action={action}
            activePath={activePath}
            dateLabel={dateLabel}
            pageTitle={pageTitle}
            rangeValue={rangeValue}
            searchPlaceholder={searchPlaceholder}
            sectionLabel={sectionLabel}
            teamValue={teamValue}
          />
          <div className="space-y-6 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </div>
      </div>
    </main>
  );
}

function AdminTopBar({
  action,
  activePath,
  dateLabel,
  pageTitle,
  rangeValue,
  searchPlaceholder,
  sectionLabel,
  teamValue,
}: Readonly<Omit<AdminShellProps, "children">>) {
  return (
    <div className="flex flex-col gap-4 border-b border-stone-200/80 px-5 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <AdminMobileNav activePath={activePath} />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-800">
              {dateLabel}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-950 sm:text-4xl">
              {pageTitle}
            </h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950" variant="outline">
            <CalendarRange className="size-4" />
            This month
          </Button>
          {action}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <Input className="pl-11" placeholder={searchPlaceholder} />
        </div>
        <Select defaultValue={teamValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="operations">Operations</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="concierge">Concierge</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue={rangeValue}>
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-stone-500">{sectionLabel}</p>
        <Button className="bg-white text-stone-700 hover:bg-stone-100 hover:text-stone-950" size="icon" variant="outline">
          <Bell className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function AdminMobileNav({ activePath }: Readonly<{ activePath: string }>) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          aria-label="Open admin navigation"
          className="xl:hidden"
          size="icon"
          variant="outline"
        >
          <Menu className="size-4" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="left-0 right-auto max-w-[320px] border-r border-stone-200">
        <DrawerHeader className="border-b border-stone-200/80 px-6 py-6">
          <DrawerTitle>CURATOR Admin</DrawerTitle>
          <DrawerDescription>
            Navigate bookings, products, and editorial operations.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <AdminSidebarContent activePath={activePath} mobile />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function AdminSidebarContent({
  activePath,
  mobile = false,
}: Readonly<{ activePath: string; mobile?: boolean }>) {
  return (
    <>
      <div className={mobile ? "border-b border-stone-200/80 px-6 py-6" : "border-b border-stone-200/80 px-8 py-7"}>
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-800">
          CURATOR Admin
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-950">
          Operations desk
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          One place for sales, itineraries, and concierge follow-through.
        </p>
      </div>

      <nav className={mobile ? "flex-1 px-4 py-5" : "flex-1 px-5 py-6"}>
        <div className="space-y-1">
          {adminNavItems.map(({ href, icon: Icon, label }) => {
            const active = href === activePath;

            const item = (
              <Link
                className={
                  active
                    ? "flex w-full items-center justify-between rounded-2xl bg-emerald-900 px-4 py-3 text-left text-white shadow-lg shadow-emerald-950/10"
                    : "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-stone-600 transition-colors hover:bg-white hover:text-stone-950"
                }
                href={href}
                key={label}
              >
                <span className="flex items-center gap-3 text-sm font-semibold">
                  <Icon className="size-4" />
                  {label}
                </span>
                <ChevronRight className="size-4 opacity-60" />
              </Link>
            );

            if (mobile) {
              return (
                <DrawerClose asChild key={label}>
                  {item}
                </DrawerClose>
              );
            }

            return item;
          })}
        </div>
      </nav>

      <div className={mobile ? "p-4" : "p-5"}>
        <Card className="overflow-hidden border-none bg-stone-950 text-white shadow-[0_30px_80px_-40px_rgba(28,25,23,0.85)]">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-200">
                Live brief
              </span>
              <Clock3 className="size-4 text-white/60" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">
                14 guest arrivals this week
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Most movement is concentrated in Hoi An and Kyoto. Transfer teams
                should be fully staffed by Thursday.
              </p>
            </div>
            <Button className="w-full bg-white text-stone-950 hover:bg-emerald-100" variant="secondary">
              View arrival plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
