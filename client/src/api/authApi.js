import axiosClient from "./axiosApi.js";

const authApi = {
  register: async (userData) => {
    const response = await axiosClient.post("/auth/register", userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosClient.post("/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    const response = await axiosClient.post("/auth/logout");
    return response.data;
  },

  getAuth: async () => {
    const response = await axiosClient.get("/auth/getAuth");
    return response.data;
  },

  getProfile: async (userId) => {
    const response = await axiosClient.get(`/auth/profile/${userId}`);
    return response.data;
  },
};

export default authApi;
