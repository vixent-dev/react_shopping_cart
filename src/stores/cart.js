import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCart = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        set((state) => {
          const index = state.cart.findIndex((item) => item.id === product.id);

          if (index >= 0) {
            return {
              cart: state.cart.map((item, i) =>
                i === index ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }

          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      decreaseQuantity: (product) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity > 0),
        })),

      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== product.id),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart-storage" },
  ),
);
