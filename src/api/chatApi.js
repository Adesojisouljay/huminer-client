// chatApi.js
import { API } from "./axios";

// 1. Create or get existing chat
export const getOrCreateChat = async (userId1, userId2) => {
  const response = await API.post("/chats", {
    participants: [userId1, userId2]
  });

  return response.data.chat; // contains _id, participants, lastMessage
};

// 2. Get messages from a real chatId
export const getChatMessages = async (chatId) => {
  const response = await API.get(`/chats/${chatId}/messages`);
  return response.data.messages;
};

// 3. Send message and store in DB
export const sendChatMessage = async (chatId, senderId, text) => {
  const response = await API.post(`/chats/message`, {
    chatId,
    senderId,
    text,
  });

  return response.data.chat;
};

// 4. Fetch all chats for user
export const getUserChats = async (userId) => {
  const response = await API.get(`/chats/user/${userId}`);
  return response.data.chats;
};

export const getChatById = async (chatId) => {
    const response = await API.get(`/chats/${chatId}`);
    return response.data.chat;
  };
  