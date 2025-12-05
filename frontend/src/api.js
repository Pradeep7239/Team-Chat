import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // backend URL
});

// attach JWT automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("teamchat_token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export default API;
