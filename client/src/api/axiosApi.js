import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true, // ✅ This ensures cookies are sent with requests
});

// Remove token-related interceptor code since cookies are handled automatically

axiosClient.interceptors.request.use(
  (config) => {
    // Smart Content-Type handling for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "Response error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default axiosClient;
