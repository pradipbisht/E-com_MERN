import axiosClient from "./axiosApi.js";

const orderApi = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await axiosClient.post("/orders", orderData);
    return response.data;
  },

  // Get user orders with pagination
  getUserOrders: async (params = {}) => {
    const response = await axiosClient.get("/orders", { params });
    return response.data;
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    const response = await axiosClient.put(`/orders/${orderId}/cancel`);
    return response.data;
  },

  // Get order summary/stats
  getOrderSummary: async () => {
    const response = await axiosClient.get("/orders/summary");
    return response.data;
  },

  // Create order from cart
  createOrderFromCart: async (orderData) => {
    const response = await axiosClient.post("/orders", {
      ...orderData,
      useCart: true,
    });
    return response.data;
  },

  // Create order directly (buy now)
  createDirectOrder: async (orderData, items) => {
    const response = await axiosClient.post("/orders", {
      ...orderData,
      useCart: false,
      directItems: items,
    });
    return response.data;
  },
};

export default orderApi;
