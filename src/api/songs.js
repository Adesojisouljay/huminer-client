import { API } from "./axios";

export const getSongById = async (id) => {
    const response = await API.get(`/song/${id}`);
    return response.data;
  };