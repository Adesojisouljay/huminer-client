import { io } from "socket.io-client";

// 1. Get Base URL (remove /api)
const PROD_URL = "https://devapi.huminer.com";
const DEV_URL = "http://localhost:2111";

const URL = process.env.REACT_APP_HUMINER_API
    ? process.env.REACT_APP_HUMINER_API.replace("/api", "")
    : (process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL);

export const socket = io(URL);
