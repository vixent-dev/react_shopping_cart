import "../styles/Cart.css";
import { useCart } from "../stores/cart.js";

function Cart() {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <div className="cart-header">
        <div>
          <span className="cart-eyebrow">TU COMPRA</span>
          <h2>
            Carrito <span id="cart-count">(0)</span>
          </h2>
        </div>
        <label
          htmlFor="cart-toggle"
          className="btn cart-close"
          aria-label="Cerrar carrito"
        >
          <span className="material-icons">close</span>
        </label>
      </div>

      <div className="cart-content">
        {cart.length === 0 ? (
          <div className="cart-empty" id="cart-empty">
            <span className="material-icons">shopping_bag</span>
            <h3>Tu carrito está vacío</h3>
            <p>Parece que todavía no has agregado productos.</p>

            <label htmlFor="cart-toggle" className="continue-shopping">
              Seguir comprando
              <span className="material-icons">arrow_forward</span>
            </label>
          </div>
        ) : (
          <ul className="cart-items" id="cart-items">
            {cart.map((product) => (
              <li key={product.id} className="cart-item">
                <div className="cart-item-img">
                  <img
                    src={product.image}
                    alt={product.title}
                    width="72"
                    height="72"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className="cart-item-remove"
                    aria-label={`Eliminar ${product.title} del carrito`}
                    onClick={() => removeFromCart(product)}
                  >
                    <span className="material-icons md-18">delete</span>
                  </button>
                </div>
                <div className="cart-item-info">
                  <h3>{product.title}</h3>
                  <p>${product.price}</p>
                  <div className="cart-item-quantity">
                    <button
                      type="button"
                      aria-label={`Quitar una unidad de ${product.title}`}
                      onClick={() => decreaseQuantity(product)}
                    >
                      <span className="material-icons md-18">remove</span>
                    </button>
                    <span>{product.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Agregar una unidad de ${product.title}`}
                      onClick={() => addToCart(product)}
                    >
                      <span className="material-icons md-18">add</span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="cart-footer" id="cart-footer">
        <div className="cart-subtotal">
          <span>Subtotal</span>
          <strong id="cart-subtotal">${total}</strong>
        </div>

        <p>Los gastos de envío se calculan al finalizar la compra.</p>

        <a href="/checkout" className="checkout-button">
          Finalizar compra
          <span className="material-icons">arrow_forward</span>
        </a>

        <label htmlFor="cart-toggle" className="continue-link">
          {" "}
          Seguir comprando{" "}
        </label>
      </div>
    </div>
  );
}

export default Cart;
