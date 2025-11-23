// src/components/chat/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../api/userApi";
import { getOrCreateChat, getChatMessages } from "../../api/chatApi";
import { io } from "socket.io-client";
import CallModal from "./CallModal";
// import useWebRTC from "../../hooks/useWebRTC";
import useWebRTC from "../../chat-call-hooks/useWebRTC";
import "./index.css";

const SOCKET_URL = process.env.REACT_APP_HUMINER_API1 || "http://localhost:2111";

export default function Chat() {
  const { activeUser } = useSelector((state) => state.huminer);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const chatIdRef = useRef(null);

  // WEBRTC hook (needs socket and local id)
  const {
    startCall,
    acceptCall,
    endCall,
    localStream,
    remoteStream,
    inCall,
    callType,
  } = useWebRTC({ socket: socketRef.current, localUserId: activeUser?._id });

  // incoming call state
  const [incomingCall, setIncomingCall] = useState(null); // { fromUserId, callType, offer }

  // Fetch users
  useEffect(() => {
    if (!activeUser) return;

    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const filtered = allUsers.filter((u) => u._id !== activeUser._id);
        setUsers(filtered);
        if (filtered.length) setSelectedUser(filtered[0]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [activeUser]);

  // Socket.io connection
  useEffect(() => {
    if (!activeUser) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("userOnline", activeUser._id);

    socket.on("onlineUsers", (list) => setOnlineUsers(list));

    // incomingCall: server forwards to callee
    socket.on("incomingCall", async ({ fromUserId, callType, offer }) => {
      // Show incoming call modal and keep offer for accept
      setIncomingCall({ fromUserId, callType, offer });
    });

    // when caller receives answer from callee, the hook will listen to "callAnswered" itself
    // iceCandidate, callEnded are handled inside useWebRTC too

    socket.on("callEnded", ({ fromUserId }) => {
      // if remote ended, cleanup UI too
      // the hook endCall will also handle cleanup when callEnded arrives
      setIncomingCall(null);
    });

    socket.on("userOffline", ({ toUserId }) => {
      // optional: toast user offline
    });

    socket.on("newMessage", ({ chatId, message }) => {
      if (chatId === chatIdRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            ...message,
            fromMe: message.sender._id === activeUser._id,
            time: new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeUser]);

  // Fetch messages & join room (unchanged)
  useEffect(() => {
    if (!selectedUser || !activeUser || !socketRef.current) return;

    const initChat = async () => {
      try {
        const chat = await getOrCreateChat(activeUser._id, selectedUser._id);
        chatIdRef.current = chat._id;

        socketRef.current.emit("joinRoom", chat._id);

        const msgs = await getChatMessages(chat._id);
        const formatted = msgs.map((msg) => ({
          ...msg,
          fromMe: msg.sender._id === activeUser._id,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
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
      text: input,
    });

    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isOnline = (userId) => onlineUsers.includes(userId);

  // CALL UI handlers
  const onStartAudioCall = async (targetUser) => {
    if (!socketRef.current) return;
    try {
      const { _id: toUserId } = targetUser;
      // startCall will create offer and emit "callUser"
      await startCall({ toUserId, isVideo: false });
    } catch (err) {
      console.error("start audio call error", err);
    }
  };

  const onStartVideoCall = async (targetUser) => {
    if (!socketRef.current) return;
    try {
      const { _id: toUserId } = targetUser;
      await startCall({ toUserId, isVideo: true });
    } catch (err) {
      console.error("start video call error", err);
    }
  };

  const onAcceptIncoming = async () => {
    if (!incomingCall || !socketRef.current) return;
    try {
      const { fromUserId, offer, callType } = incomingCall;
      // acceptCall will set remote desc, create answer and emit "answerCall"
      await acceptCall({ fromUserId, offer, isVideo: callType === "video" });
      setIncomingCall(null);
    } catch (err) {
      console.error("accept error", err);
    }
  };

  const onRejectIncoming = () => {
    // send endCall to caller
    if (socketRef.current && incomingCall) {
      socketRef.current.emit("endCall", { toUserId: incomingCall.fromUserId, fromUserId: activeUser._id });
    }
    setIncomingCall(null);
  };

  const onHangUp = () => {
    // end locally and notify remote (use hook)
    endCall();
    setIncomingCall(null);
  };

  // toggle audio / video (manipulate local tracks)
  const onToggleAudio = (enabled) => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((t) => (t.enabled = enabled));
  };
  const onToggleVideo = (enabled) => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((t) => (t.enabled = enabled));
  };

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
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chat-list">
          {users
            .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
            .map((user) => (
              <div
                key={user._id}
                className={`chat-list-item ${selectedUser?._id === user._id ? "active" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                <span className={`status-dot ${isOnline(user._id) ? "online" : "offline"}`}></span>
                <div style={{ flex: 1 }}>
                  <div className="chat-list-name">{user.username}</div>
                  <div className="chat-list-last">{isOnline(user._id) ? "Online" : "Offline"}</div>
                </div>

                {/* call buttons on each list item */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => onStartAudioCall(user)} title="Audio call">📞</button>
                  <button onClick={() => onStartVideoCall(user)} title="Video call">🎥</button>
                </div>
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
          {messages.map((msg) => (
            <div key={msg._id || msg.id} className={`message-row ${msg.fromMe ? "me" : "them"}`}>
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="send-button" onClick={sendMessage}>Send</button>
        </div>
      </div>

      {/* CALL MODAL for incoming or active calls */}
      <CallModal
        visible={!!incomingCall || inCall}
        localStream={localStream}
        remoteStream={remoteStream}
        callType={incomingCall ? incomingCall.callType : callType}
        onHangUp={onHangUp}
        onToggleAudio={onToggleAudio}
        onToggleVideo={onToggleVideo}
        callerName={
          incomingCall
            ? users.find((u) => u._id === incomingCall.fromUserId)?.username || "Caller"
            : selectedUser?.username
        }
        isCaller={!incomingCall && inCall}
      />

      {/* small accept/reject buttons for incoming calls */}
      {incomingCall && (
        <div style={{
        //   position: "fixed",
          left: 200,
          bottom: 20,
          zIndex: 10000,
          background: "var(--card-bg)",
          padding: 12,
          borderRadius: 8,
          border: "1px solid var(--border-color)"
        }}>
          <div style={{ marginBottom: 8 }}>
            Incoming {incomingCall.callType} call from {users.find(u => u._id === incomingCall.fromUserId)?.username || "User"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onAcceptIncoming}>Accept</button>
            <button onClick={onRejectIncoming}>Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}
