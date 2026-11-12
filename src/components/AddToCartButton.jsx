import { useCart } from "../stores/cart.js";
import "../styles/AddToCartButton.css";

function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  return (
    <button
      className="add-button"
      onClick={() => {
        addToCart(product);
        alert(`Producto ${product.title} fue añadido al carrito. `);
      }}
    >
      Añadir al Carrito
    </button>
  );
}

export default AddToCartButton;
