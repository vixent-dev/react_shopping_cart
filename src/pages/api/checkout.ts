import type { APIRoute } from "astro";
import { getOrderStore } from "../../lib/orders.js";
import { provider } from "../../lib/payment.js";
import { getProducts } from "../../lib/products";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const { items, customer, pickup, paymentMethod } = body ?? {};

  if (!items?.length || !customer?.name?.trim() || !customer?.phone?.trim()) {
    return Response.json({ error: "Datos incompletos" }, { status: 400 });
  }

  let list;
  try {
    list = await getProducts();
  } catch (e) {
    console.error("getProducts falló:", e);
    return Response.json(
      { error: "No se pudo cargar el catálogo" },
      { status: 502 },
    );
  }
  const byId = new Map(list.map((p: any) => [String(p.id), p]));

  const priced = [];
  for (const i of items) {
    const p: any = byId.get(String(i.id));
    const qty = Number(i.qty);
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > 50) {
      return Response.json(
        { error: `Producto inválido: ${i.id}` },
        { status: 400 },
      );
    }
    // Solo los campos que confiamos: nada del navegador salvo id y qty
    priced.push({ id: String(p.id), title: p.title, price: p.price, qty });
  }

  const total = priced.reduce((s: number, i: any) => s + i.price * i.qty, 0);

  const order = {
    id: crypto.randomUUID(),
    code: Math.random().toString(36).slice(2, 6).toUpperCase(),
    items: priced,
    total,
    customer,
    pickup,
    paymentMethod,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await getOrderStore().put(order);

  if (paymentMethod === "at_store") {
    return Response.json({ url: `/pedido/${order.id}` });
  }

  const { url } = await provider.createPayment(order);
  return Response.json({ url });
};
