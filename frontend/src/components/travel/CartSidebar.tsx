"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/src/components/ui/drawer";
import { cartItems } from "@/src/data/mockData";

export function CartSidebar() {
  const [items, setItems] = useState(cartItems);
  const subtotal = items.reduce((total, item) => total + Number(item.price.replace(/[^0-9.]/g, "")), 0);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button aria-label="Open cart" className="relative hidden text-stone-600 hover:text-emerald-800 md:inline-flex" size="icon" variant="ghost">
          <ShoppingBag className="size-5" />
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-black text-white">
            {items.length}
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent aria-label="Travel cart">
        <DrawerHeader className="relative border-b border-stone-200/70 px-8 py-7 text-left">
          <div className="absolute right-0 top-0 size-40 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-100 blur-3xl" />
          <div className="relative flex items-start justify-between gap-6">
            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-800">Booking Cart</p>
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
          <div className="space-y-5">
            {items.map((item) => (
              <article className="group overflow-hidden rounded-[1.5rem] border border-stone-200/70 bg-white p-3 shadow-sm transition-shadow hover:shadow-[0_25px_70px_-55px_rgba(28,25,23,0.65)]" key={item.title}>
                <div className="flex gap-4">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[1.1rem] bg-stone-200">
                    <Image alt={item.alt} className="object-cover transition-transform duration-700 group-hover:scale-105" fill sizes="96px" src={item.image} />
                  </div>
                  <div className="min-w-0 flex-1 py-1">
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="line-clamp-2 text-base font-black leading-tight text-stone-950">{item.title}</h3>
                        <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-emerald-800">{item.date}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-black text-stone-950">{item.price}</span>
                        <Button
                          aria-label={`Remove ${item.title} from cart`}
                          className="size-8 rounded-full text-stone-400 hover:bg-red-50 hover:text-red-600"
                          onClick={() => setItems((currentItems) => currentItems.filter((currentItem) => currentItem.title !== item.title))}
                          size="icon"
                          type="button"
                          variant="ghost"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed text-stone-500">{item.meta}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Button aria-label={`Decrease quantity for ${item.title}`} className="size-8 rounded-full text-stone-500" size="icon" type="button" variant="ghost">
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="text-sm font-black text-stone-950">1</span>
                      <Button aria-label={`Increase quantity for ${item.title}`} className="size-8 rounded-full text-stone-500" size="icon" type="button" variant="ghost">
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
          <Button asChild className="min-h-14 w-full rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-950/10">
            <Link href="/checkout">
              Review Booking
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <p className="mt-2 text-center text-xs leading-relaxed text-stone-500">
            Review your selected experiences and stays before continuing to secure checkout.
          </p>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
