import { useEffect } from "react";
import { useRecentlyViewed } from "../stores/recentlyViewed.js";
import "../styles/RecentlyViewed.css";

function RecentlyViewed() {
  const viewedProducts = useRecentlyViewed((s) => s.items);
  useEffect(() => {
    useRecentlyViewed.persist.rehydrate();
  }, []);
  if (viewedProducts.length === 0) {
    return (
      <section className="rv-section">
        <h2>Productos vistos recientemente</h2>
        <p>No has visto ningún producto recientemente.</p>
      </section>
    );
  }
  return (
    <section className="rv-section">
      <h2>Productos vistos recientemente</h2>
      <div className="rv-scroll">
        {viewedProducts.map((product) => (
          <a key={product.id} href={`/products/${product.id}`}>
            <div className="img-container">
              <img src={product.image} width="100" height="100" />
            </div>
            <h3>{product.title}</h3>
            <p>${product.price}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export default RecentlyViewed;
