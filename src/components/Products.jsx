import "../styles/Products.css";
import { useMemo, useState } from "react";
import { useCart } from "../stores/cart.js";

function Products({ products }) {
  const [category, setCategory] = useState("all");
  const { addToCart } = useCart();

  const categories = useMemo(
    () => ["all", ...new Set(products.map((p) => p.category))],
    [products],
  );

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      return matchesCategory;
    });
    return result;
  }, [products, category]);

  return (
    <section className="p-section">
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={cat === category ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat === "all" ? "Todos" : cat}
          </button>
        ))}
      </div>
      <ul className="grid-layout">
        {filtered.map(({ id, image, title, price }) => (
          <li key={id}>
            <a href={`/products/${id}`} className="product">
              <div className="image">
                <img src={image} width="200" height="200" />
              </div>
              <h2>{title}</h2>
              <span>★★★★★</span>
              <div className="product-footer">
                <span>${price}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart({ id, image, title, price });
                    alert(`Producto ${title} Agregado al Carrito`);
                  }}
                >
                  <span className="material-icons md-18">
                    add_shopping_cart
                  </span>
                </button>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Products;
