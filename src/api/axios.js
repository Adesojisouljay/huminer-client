import axios from "axios";

const BASE_URL = process.env.REACT_APP_HUMINER_API || "http://localhost:2111/api";

export const API = axios.create({
  baseURL: BASE_URL,
});