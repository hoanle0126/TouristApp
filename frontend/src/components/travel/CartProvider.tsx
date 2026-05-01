"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

import type { CartItem } from "@/src/types/travel";

interface CartLine extends CartItem {
  readonly quantity: number;
}

interface CartContextValue {
  readonly addItem: (item: CartItem) => void;
  readonly clearCart: () => void;
  readonly isInCart: (item: Pick<CartItem, "date" | "meta" | "title">) => boolean;
  readonly items: readonly CartLine[];
  readonly removeItem: (id: string) => void;
  readonly subtotal: number;
  readonly totalItems: number;
}

const STORAGE_KEY = "curator-cart";
const STORAGE_EVENT = "curator-cart-change";

const initialItems: readonly CartLine[] = [];

const CartContext = createContext<CartContextValue | null>(null);
let cachedItems: readonly CartLine[] = initialItems;
let cachedSerializedItems: string | null = null;

function readStoredItems(): readonly CartLine[] {
  if (typeof window === "undefined") {
    return initialItems;
  }

  const storedItems = window.localStorage.getItem(STORAGE_KEY);

  if (storedItems === null) {
    cachedSerializedItems = null;
    cachedItems = initialItems;
    return initialItems;
  }

  if (storedItems === cachedSerializedItems) {
    return cachedItems;
  }

  try {
    cachedItems = JSON.parse(storedItems) as CartLine[];
    cachedSerializedItems = storedItems;
    return cachedItems;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    cachedSerializedItems = null;
    cachedItems = initialItems;
    return initialItems;
  }
}

function writeStoredItems(items: readonly CartLine[]) {
  cachedItems = items;
  cachedSerializedItems = JSON.stringify(items);
  window.localStorage.setItem(STORAGE_KEY, cachedSerializedItems);
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function subscribeToCartStore(onStoreChange: () => void) {
  const handleChange = () => {
    onStoreChange();
  };

  window.addEventListener("storage", handleChange);
  window.addEventListener(STORAGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(STORAGE_EVENT, handleChange);
  };
}

export function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items = useSyncExternalStore(subscribeToCartStore, readStoredItems, () => initialItems);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((total, item) => {
      const price = Number(item.price.replace(/[^0-9.]/g, ""));
      return total + price * item.quantity;
    }, 0);

    const totalItems = items.length;

    return {
      addItem(item) {
        const currentItems = readStoredItems();
        const existingItem = currentItems.find(
          (currentItem) =>
            currentItem.title === item.title &&
            currentItem.date === item.date &&
            currentItem.meta === item.meta,
        );

        if (existingItem) {
          return;
        }

        writeStoredItems([...currentItems, { ...item, quantity: 1 }]);
      },
      clearCart() {
        writeStoredItems([]);
      },
      isInCart(item) {
        return items.some(
          (currentItem) =>
            currentItem.title === item.title &&
            currentItem.date === item.date &&
            currentItem.meta === item.meta,
        );
      },
      items,
      removeItem(id) {
        writeStoredItems(items.filter((currentItem) => currentItem.id !== id));
      },
      subtotal,
      totalItems,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
