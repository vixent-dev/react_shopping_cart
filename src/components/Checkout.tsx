// @ts-nocheck
import { useState } from "react";
import { useCart } from "../stores/cart";
import "../styles/Checkout.css";

const fmt = (n: number) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP" });

export default function Checkout() {
  const cart = useCart((s) => s.cart);
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("asap");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // el endpoint espera `qty`, así que mapeamos desde `quantity`
          items: cart.map((i) => ({
            id: i.id,
            title: i.title,
            price: i.price,
            qty: i.quantity,
          })),
          customer: { name, phone },
          pickup,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al crear el pedido");
      window.location.href = data.url; // el carrito se vacía en la página del pedido (ver abajo)
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!cart.length)
    return <p className="checkout-empty">Tu carrito está vacío.</p>;

  return (
    <form onSubmit={submit} className="checkout">
      <h1 className="checkout__title">Retiro en tienda</h1>

      <ul className="checkout__list">
        {cart.map((i) => (
          <li key={i.id} className="checkout__item">
            <span>
              {i.quantity} × {i.title}
            </span>
            <span>{fmt(i.price * i.quantity)}</span>
          </li>
        ))}
        <li className="checkout__item checkout__item--total">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </li>
      </ul>

      <input
        required
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="checkout__input"
      />
      <input
        required
        type="tel"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="checkout__input"
      />

      <label className="checkout__label">
        ¿Cuándo retiras?
        <select
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          className="checkout__input checkout__select"
        >
          <option value="asap">Lo antes posible (15–20 min)</option>
          <option value="30">En 30 minutos</option>
          <option value="60">En 1 hora</option>
        </select>
      </label>

      <fieldset className="checkout__fieldset">
        <legend className="checkout__legend">Forma de pago</legend>
        <label className="checkout__radio">
          <input
            type="radio"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />
          Pagar ahora (simulado)
        </label>
        <label className="checkout__radio">
          <input
            type="radio"
            checked={paymentMethod === "at_store"}
            onChange={() => setPaymentMethod("at_store")}
          />
          Pagar al retirar en tienda
        </label>
      </fieldset>

      {error && <p className="checkout__error">{error}</p>}

      <button disabled={loading} className="checkout__button">
        {loading
          ? "Procesando…"
          : paymentMethod === "online"
            ? "Ir a pagar"
            : "Confirmar pedido"}
      </button>
    </form>
  );
}
