import { useEffect } from "react";
import { useRecentlyViewed } from "../stores/recentlyViewed.js";

export function ProductTracker({ product }) {
  const track = useRecentlyViewed((s) => s.trackProductView);
  useEffect(() => {
    useRecentlyViewed.persist.rehydrate();
    track(product);
  }, [product.id]);
  return null;
}
