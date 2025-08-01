import axiosClient from "./axiosApi.js";

const cartApi = {
  getCart: async () => {
    const response = await axiosClient.get("/cart");
    return response.data;
  },

  addToCart: async (itemId, quantity) => {
    const response = await axiosClient.post("/cart/add", { itemId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await axiosClient.put(`/cart/update/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await axiosClient.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await axiosClient.delete("/cart/clear");
    return response.data;
  },

  getCartSummary: async () => {
    const response = await axiosClient.get("/cart/summary");
    return response.data;
  },
};

export default cartApi;
