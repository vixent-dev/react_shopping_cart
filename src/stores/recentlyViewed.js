import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const MAX_HISTORY = 10;

export const useRecentlyViewed = create(
  persist(
    (set) => ({
      items: [],
      trackProductView: (product) =>
        set((state) => ({
          items: [
            product,
            ...state.items.filter((item) => item.id !== product.id),
          ].slice(0, MAX_HISTORY),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "recently-viewed-storage",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
