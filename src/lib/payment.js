export const mockProvider = {
  async createPayment(order) {
    return { url: `/mock-pago/${order.id}` };
  },
};

// Cuando pases a producción: export const mercadoPagoProvider = {...}
export const provider = mockProvider;
