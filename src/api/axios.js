import axios from "axios";

export const API = axios.create({
    baseURL: "http://localhost:2111/api", // change this to your deployed URL when live
  });