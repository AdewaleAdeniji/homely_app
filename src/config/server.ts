import axios from "axios";
import config from "./config";

const server = axios.create({
  baseURL: config.BASE_URL,
  timeoutErrorMessage: "Network Timeout",
});

server.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const token = localStorage.getItem("accessToken");

    if (token && error.response && error.response.status === 401) {
      resetSession()
    }
    throw error;
  }
);

server.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token && config && config.headers)
    config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const resetSession = () => {
  localStorage.clear();
  window.location.href = "/logout";
}

export default server;
