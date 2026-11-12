import type { APIRoute } from "astro";
import { getOrderStore } from "../../lib/orders.js";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const orderId = String(form.get("orderId"));
  const result = String(form.get("result"));

  const store = getOrderStore();
  const order = await store.get(orderId);
  if (!order) return new Response("No existe", { status: 404 });

  // Idempotente: un webhook duplicado no cambia un pedido ya pagado
  if (
    order.status === "pending" &&
    (result === "paid" || result === "rejected")
  ) {
    order.status = result;
    await store.put(order);
  }

  return redirect(`/pedido/${order.id}`);
};
