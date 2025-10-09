// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5010",
  timeout: 5000, // 5s timeout
  headers: {
    "Content-Type": "application/json",
    // Add 'Authorization': 'Bearer <token>' when credentials are added
  },
});

export default api;
