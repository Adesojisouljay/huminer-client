import axios from "axios";

const PROD_URL = "https://devapi.huminer.com/api";
const DEV_URL = "http://localhost:2111/api";

const BASE_URL = process.env.REACT_APP_HUMINER_API || (process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL);

export const API = axios.create({
  baseURL: BASE_URL,
});