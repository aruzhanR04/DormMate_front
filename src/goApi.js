// src/api/goApi.js
import axios from "axios";

const goApi = axios.create({
  baseURL: "http://127.0.0.1:8080/api/",
});

goApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

goApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        const refreshResp = await axios.post(
          "http://127.0.0.1:8000/api/v1/token/refresh/",
          { refresh: refreshToken }
        );
        const { access } = refreshResp.data;
        localStorage.setItem("access", access);
        goApi.defaults.headers.Authorization = `Bearer ${access}`;
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return goApi(originalRequest);
      } catch (_error) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default goApi;
