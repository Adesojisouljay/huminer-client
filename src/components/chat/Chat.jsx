import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../api/userApi";
import { getOrCreateChat, getChatMessages } from "../../api/chatApi";
import { io } from "socket.io-client";
import "./index.css";

const SOCKET_URL = process.env.REACT_APP_HUMINER_API1 || "http://localhost:2111";

export default function Chat() {
  const { activeUser } = useSelector(state => state.huminer);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const chatIdRef = useRef(null);

  // Fetch users
  useEffect(() => {
    if (!activeUser) return;

    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const filtered = allUsers.filter(u => u._id !== activeUser._id);
        setUsers(filtered);
        if (filtered.length) setSelectedUser(filtered[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [activeUser]);

  // Socket.IO connection
  useEffect(() => {
    if (!activeUser) return;

    socketRef.current = io(SOCKET_URL);

    socketRef.current.emit("userOnline", activeUser._id);

    socketRef.current.on("onlineUsers", (list) => {
      setOnlineUsers(list);
    });

    socketRef.current.on("newMessage", ({ chatId, message }) => {
      if (chatId === chatIdRef.current) {
        setMessages(prev => [
          ...prev,
          {
            ...message,
            fromMe: message.sender._id === activeUser._id,
            time: new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })
          }
        ]);
      }
    });

    return () => socketRef.current.disconnect();
  }, [activeUser]);

  // Fetch messages & join room
  useEffect(() => {
    if (!selectedUser || !activeUser || !socketRef.current) return;

    const initChat = async () => {
      try {
        const chat = await getOrCreateChat(activeUser._id, selectedUser._id);
        chatIdRef.current = chat._id;

        socketRef.current.emit("joinRoom", chat._id);

        const msgs = await getChatMessages(chat._id);
        const formatted = msgs.map(msg => ({
          ...msg,
          fromMe: msg.sender._id === activeUser._id,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Unable to initialize chat:", err);
        setMessages([]);
      }
    };

    initChat();
  }, [selectedUser, activeUser]);

  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;

    socketRef.current.emit("sendMessage", {
      chatId: chatIdRef.current,
      senderId: activeUser._id,
      text: input
    });

    setInput("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="chat-container">
      
      {/* SIDEBAR */}
      <div className="chat-sidebar">
        <h2 className="sidebar-title">Chats</h2>
        <input
          type="text"
          className="chat-search"
          placeholder="Search username..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="chat-list">
          {users
            .filter(u => u.username.toLowerCase().includes(search.toLowerCase()))
            .map(user => (
              <div
                key={user._id}
                className={`chat-list-item ${selectedUser?._id === user._id ? "active" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                <span className={`status-dot ${isOnline(user._id) ? "online" : "offline"}`}></span>
                <Link to={`/chat/${chatIdRef.current}`} className="chat-list-name">{user.username}</Link>
                <div className="chat-list-last">{isOnline(user._id) ? "Online" : "Offline"}</div>
              </div>
          ))}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className="chat-main">
        {/* HEADER */}
        {selectedUser && (
          <div className="chat-header">
            <div className="chat-header-left">
              <span className="chat-username">{selectedUser.username}</span>
              <span className={`user-status ${isOnline(selectedUser._id) ? "online-text" : "offline-text"}`}>
                {isOnline(selectedUser._id) ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        )}

        {/* MESSAGES */}
        <div className="messages-area">
          {messages.map(msg => (
            <div
              key={msg._id || msg.id}
              className={`message-row ${msg.fromMe ? "me" : "them"}`}
            >
              <div className="message">{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* COMPOSER */}
        <div className="message-composer">
          <input
            type="text"
            className="composer-input"
            placeholder="Type a message"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button className="send-button" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}
