"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { cartItems, type CartItem } from "@/src/data/mockData";

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

const initialItems: readonly CartLine[] = cartItems.map((item) => ({
  ...item,
  quantity: 1,
}));

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [items, setItems] = useState<readonly CartLine[]>(() => {
    if (typeof window === "undefined") {
      return initialItems;
    }

    const storedItems = window.localStorage.getItem(STORAGE_KEY);

    if (!storedItems) {
      return initialItems;
    }

    try {
      return JSON.parse(storedItems) as CartLine[];
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      return initialItems;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((total, item) => {
      const price = Number(item.price.replace(/[^0-9.]/g, ""));
      return total + price * item.quantity;
    }, 0);

    const totalItems = items.length;

    return {
      addItem(item) {
        setItems((currentItems) => {
          const existingItem = currentItems.find(
            (currentItem) =>
              currentItem.title === item.title &&
              currentItem.date === item.date &&
              currentItem.meta === item.meta,
          );

          if (existingItem) {
            return currentItems;
          }

          return [...currentItems, { ...item, quantity: 1 }];
        });
      },
      clearCart() {
        setItems([]);
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
        setItems((currentItems) =>
          currentItems.filter((currentItem) => currentItem.id !== id),
        );
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
