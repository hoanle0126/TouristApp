"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ShoppingBag, Trash2, Users, X } from "lucide-react";

import { useCart } from "@/src/components/travel/CartProvider";
import { Button } from "@/src/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/src/components/ui/drawer";

export function CartSidebar() {
  const { items, removeItem, subtotal, totalItems } = useCart();

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button aria-label="Open cart" className="relative hidden text-stone-600 hover:text-red-800 md:inline-flex" size="icon" variant="ghost">
          <ShoppingBag className="size-5" />
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-red-800 text-[10px] font-black text-white">
            {totalItems}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent aria-label="Travel cart">
        <DrawerHeader className="relative border-b border-stone-200/70 px-8 py-7 text-left">
          <div className="absolute right-0 top-0 size-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-red-100 blur-3xl" />
          <div className="relative flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-red-800">Booking Cart</p>
              <DrawerTitle className="text-3xl font-black tracking-tighter text-stone-950">Your trip cart</DrawerTitle>
            </div>
            <DrawerClose asChild>
              <Button aria-label="Close cart" className="shrink-0 rounded-full text-stone-500 hover:text-stone-950" size="icon" variant="ghost">
                <X className="size-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {items.length > 0 ? (
            <div className="space-y-5">
              {items.map((item) => (
                <article className="group overflow-hidden rounded-[1.5rem] border border-stone-200/70 bg-white p-3 shadow-sm transition-shadow hover:shadow-[0_25px_70px_-55px_rgba(28,25,23,0.65)]" key={item.id}>
                  <div className="flex gap-4">
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[1.1rem] bg-stone-200">
                      <Image alt={item.alt} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="96px" src={item.image} />
                    </div>
                    <div className="min-w-0 flex-1 py-1">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="line-clamp-2 text-base font-black leading-tight text-stone-950">{item.title}</h3>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-red-800">{item.date}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-black text-stone-950">{item.price}</span>
                          <Button
                            aria-label={`Remove ${item.title} from cart`}
                            className="size-8 rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeItem(item.id)}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-stone-500">{item.meta}</p>
                      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-500">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5">
                          <CalendarDays className="size-3.5" />
                          {item.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1.5">
                          <Users className="size-3.5" />
                          {item.meta}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-stone-200/80 bg-white/70 px-6 py-10 text-center">
              <p className="text-lg font-black tracking-tight text-stone-950">Your cart is empty</p>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                Add a journey or stay to start building your itinerary.
              </p>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t border-stone-200/70 bg-white/70 px-8 py-7 backdrop-blur-xl">
          <div className="mb-3 space-y-3 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span className="font-bold text-stone-950">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Booking service</span>
              <span className="font-bold text-stone-950">Included</span>
            </div>
          </div>
          {items.length > 0 ? (
            <Button asChild className="min-h-14 w-full rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-red-950/10">
              <Link href="/checkout">
                Review Booking
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button className="min-h-14 w-full rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-red-950/10" disabled>
              Review Booking
              <ArrowRight className="size-4" />
            </Button>
          )}
          <p className="mt-2 text-center text-xs leading-relaxed text-stone-500">
            Review your selected experiences and stays before continuing to secure checkout.
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
