import { io } from "socket.io-client";

// 1. Get Base URL (remove /api)
const URL = process.env.REACT_APP_HUMINER_API
    ? process.env.REACT_APP_HUMINER_API.replace("/api", "")
    : "http://localhost:2111"; // Default dev

export const socket = io(URL);
