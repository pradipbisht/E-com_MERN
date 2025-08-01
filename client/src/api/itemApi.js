// import axiosClient from "./axiosClient";

import axiosClient from "./axiosApi";

const itemApi = {
  createItem: async (itemData) => {
    const response = await axiosClient.post("/items/create", itemData);
    return response.data;
  },
  getAllItems: async () => {
    const response = await axiosClient.get("/items/all-items");
    return response.data;
  },
  getItemById: async (id) => {
    const response = await axiosClient.get(`/items/item/${id}`);
    return response.data;
  },
};

export default itemApi;
