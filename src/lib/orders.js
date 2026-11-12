import { env } from "cloudflare:workers";

const mem = (globalThis.__orders ??= new Map());

export function getOrderStore() {
  const kv = env.ORDERS;
  return {
    async get(id) {
      return kv ? await kv.get(id, "json") : (mem.get(id) ?? null);
    },
    async put(order) {
      if (kv) await kv.put(order.id, JSON.stringify(order));
      else mem.set(order.id, order);
    },
    async list() {
      if (!kv) return [...mem.values()];
      const { keys } = await kv.list();
      const all = await Promise.all(keys.map((k) => kv.get(k.name, "json")));
      return all.filter(Boolean);
    },
  };
}
