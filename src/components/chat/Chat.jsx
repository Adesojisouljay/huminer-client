// src/components/chat/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllUsers } from "../../api/userApi";
import { getOrCreateChat, getChatMessages } from "../../api/chatApi";
import { socket } from "../../helpers/sockets";
import CallModal from "./CallModal";
// import useWebRTC from "../../hooks/useWebRTC";
import useWebRTC from "../../chat-call-hooks/useWebRTC";
import "./index.css";
import { MdCall, MdVideocam, MdSearch, MdMoreVert, MdArrowBack, MdSend } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";

// Helper for initials
const getInitials = (username) => {
  if (!username) return "?";
  return username.substring(0, 2).toUpperCase();
};

export default function Chat() {
  const { activeUser } = useSelector((state) => state.huminer);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Use imported socket
  // const [socket, setSocket] = useState(null); // Removed local state

  const messagesEndRef = useRef(null);
  const chatIdRef = useRef(null);
  const inputRef = useRef(null);

  // WEBRTC hook (needs socket and local id)
  const {
    startCall,
    acceptCall,
    endCall,
    localStream,
    remoteStream,
    inCall,
    callType,
  } = useWebRTC({ socket, localUserId: activeUser?._id });

  // incomingCall state
  const [incomingCall, setIncomingCall] = useState(null); // { fromUserId, callType, offer }
  const [callPartner, setCallPartner] = useState(null); // name of person we are talking to

  // Fetch users
  useEffect(() => {
    if (!activeUser) return;

    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        const filtered = allUsers.filter((u) => u._id !== activeUser._id);
        setUsers(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, [activeUser]);

  // Socket.io connection - use shared socket
  useEffect(() => {
    if (!activeUser || !socket) return;

    // We don't need to connect/emit userOnline here because App.jsx likely handles it
    // But to be safe in case of refresh on this page, or ensure connection:
    if (!socket.connected) {
      socket.connect();
      socket.emit("userOnline", activeUser._id);
    }
    // If already connected, App.jsx likely emitted userOnline. 
    // But emitting it again updates the map in backend which is fine (idempotent-ish for map set)
    // Actually, let's just emit to be sure we are in the online map
    socket.emit("userOnline", activeUser._id);

    // Initial fetch of online users
    socket.emit("getOnlineUsers"); // Backend confirms listener exists

    const handleOnlineUsers = (list) => {
      setOnlineUsers(list);
    };

    const handleIncomingCall = ({ fromUserId, callType, offer }) => {
      console.log("Incoming call from", fromUserId);
      setIncomingCall({ fromUserId, callType, offer });
    };

    const handleCallEnded = ({ fromUserId }) => {
      setIncomingCall(null);
    };

    // const handleUserOffline = ({ toUserId }) => {};

    const handleNewMessage = ({ chatId, message }) => {
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
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("incomingCall", handleIncomingCall);
    socket.on("callEnded", handleCallEnded);
    socket.on("newMessage", handleNewMessage);

    return () => {
      // Do NOT disconnect shared socket
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callEnded", handleCallEnded);
      socket.off("newMessage", handleNewMessage);
    };
  }, [activeUser]);

  // Fetch messages & join room (unchanged)
  useEffect(() => {
    if (!selectedUser || !activeUser || !socket) return;

    const initChat = async () => {
      try {
        const chat = await getOrCreateChat(activeUser._id, selectedUser._id);
        chatIdRef.current = chat._id;

        socket.emit("joinRoom", chat._id);

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
  }, [selectedUser, activeUser, socket]);

  const sendMessage = () => {
    if (!input.trim() || !selectedUser || !socket) return;

    socket.emit("sendMessage", {
      chatId: chatIdRef.current,
      senderId: activeUser._id,
      text: input,
    });

    setInput("");
    inputRef.current?.focus();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isOnline = (userId) => onlineUsers.includes(userId);

  // CALL UI handlers
  const onStartAudioCall = async () => {
    if (!socket || !selectedUser) return;
    try {
      const { _id: toUserId } = selectedUser;
      // startCall will create offer and emit "callUser"
      await startCall({ toUserId, isVideo: false });
    } catch (err) {
      console.error("start audio call error", err);
    }
  };

  const onStartVideoCall = async () => {
    if (!socket || !selectedUser) return;
    try {
      const { _id: toUserId, username } = selectedUser;
      setCallPartner(username);
      await startCall({ toUserId, isVideo: true });
    } catch (err) {
      console.error("start video call error", err);
    }
  };

  const onAcceptIncoming = async () => {
    if (!incomingCall || !socket) return;
    try {
      const { fromUserId, offer, callType } = incomingCall;
      const callerName = users.find(u => u._id === fromUserId)?.username || "Caller";
      setCallPartner(callerName);

      // acceptCall will set remote desc, create answer and emit "answerCall"
      await acceptCall({ fromUserId, offer, isVideo: callType === "video" });
      setIncomingCall(null);
    } catch (err) {
      console.error("accept error", err);
    }
  };

  const onRejectIncoming = () => {
    // send endCall to caller
    if (socket && incomingCall) {
      socket.emit("endCall", { toUserId: incomingCall.fromUserId, fromUserId: activeUser._id });
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

  // Mobile: toggle between list and chat
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  // ... (existing effects)

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowChatOnMobile(true);
  };

  return (
    <div className={`chat-container ${showChatOnMobile ? "mobile-show-chat" : "mobile-show-list"}`}>
      {/* SIDEBAR */}
      <div className={`chat-sidebar ${showChatOnMobile ? "hidden-mobile" : ""}`}>
        <div className="sidebar-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="avatar-circle" style={{ width: 40, height: 40, fontSize: 16, marginRight: 0 }}>
              {getInitials(activeUser?.username)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 15 }}>
            {/* Icons for User Profile / Status / New Chat could go here */}
            <MdMoreVert className="header-icon" />
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="chat-search"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chat-list">
          {users
            .filter((u) => u.username.toLowerCase().includes(search.toLowerCase()))
            .map((user) => (
              <div
                key={user._id}
                className={`chat-list-item ${selectedUser?._id === user._id ? "active" : ""}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="avatar-circle">
                  {getInitials(user.username)}
                  {isOnline(user._id) && <span className="status-dot"></span>}
                </div>

                <div className="chat-info">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="chat-list-name">{user.username}</span>
                    <span className="chat-list-last">Today</span>
                  </div>
                  <div className="chat-list-last">Click to start chatting</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* MAIN CHAT */}
      <div className={`chat-main ${!showChatOnMobile ? "hidden-mobile" : ""}`}>
        {/* HEADER */}
        {selectedUser ? (
          <div className="chat-header">
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className="back-button-mobile"
                onClick={() => setShowChatOnMobile(false)}
              >
                <MdArrowBack />
              </button>

              <div className="chat-header-user">
                <div className="avatar-circle" style={{ width: 40, height: 40, fontSize: 16 }}>
                  {getInitials(selectedUser.username)}
                </div>
                <div>
                  <span className="chat-username">{selectedUser.username}</span>
                  <span className="user-status">
                    {isOnline(selectedUser._id) ? "Online" : "Last seen recently"}
                  </span>
                </div>
              </div>
            </div>

            <div className="chat-header-actions">
              <MdSearch className="header-icon" />
              <MdVideocam className="header-icon" onClick={onStartVideoCall} title="Video Call" />
              <MdCall className="header-icon" onClick={onStartAudioCall} title="Voice Call" />
              <MdMoreVert className="header-icon" />
            </div>
          </div>
        ) : (
          <div className="chat-header" style={{ justifyContent: "center", color: "var(--text-secondary)" }}>
            Select a chat to start messaging
          </div>
        )}

        {/* MESSAGES */}
        <div className="messages-area"
          style={{ backgroundImage: !selectedUser ? "none" : undefined }}
        >
          {selectedUser ? (
            messages.map((msg, index) => (
              <div key={msg._id || index} className={`message-row ${msg.fromMe ? "me" : "them"}`}>
                <div className="message">
                  {msg.text}
                  <span className="message-time">
                    {msg.time}
                    {msg.fromMe && <BsCheckAll style={{ marginLeft: 4, color: "#4fb6ec" }} />}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              color: "var(--text-secondary)",
              flexDirection: "column"
            }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>👋</div>
              <h3>Welcome to Huminer Chat</h3>
              <p>Send and receive messages with end-to-end functionality</p>
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* COMPOSER */}
        {selectedUser && (
          <div className="message-composer">
            <input
              ref={inputRef}
              type="text"
              className="composer-input"
              placeholder="Type a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className={`send-button ${input.trim() ? "active" : ""}`} onClick={sendMessage}>
              <MdSend />
            </button>
          </div>
        )}
      </div>

      {/* CALL MODAL for active calls only - Incoming shown via popup below */}
      <CallModal
        visible={inCall}
        localStream={localStream}
        remoteStream={remoteStream}
        callType={callType}
        onHangUp={onHangUp}
        onToggleAudio={onToggleAudio}
        onToggleVideo={onToggleVideo}
        callerName={callPartner || selectedUser?.username || "User"}
        isCaller={true}
      />

      {/* small accept/reject buttons for incoming calls */}
      {incomingCall && (
        <div style={{
          position: "fixed",
          left: "50%",
          bottom: 20,
          transform: "translateX(-50%)",
          zIndex: 10000,
          background: "#202c33",
          padding: "16px 24px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          color: "white",
          minWidth: 300
        }}>
          <div style={{ marginBottom: 16, textAlign: "center", fontSize: 16 }}>
            Run-time Incoming <b>{incomingCall.callType}</b> call...
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button
              onClick={onAcceptIncoming}
              style={{
                background: "#00a884",
                border: "none",
                padding: "10px 24px",
                borderRadius: 24,
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Accept
            </button>
            <button
              onClick={onRejectIncoming}
              style={{
                background: "#ef5350",
                border: "none",
                padding: "10px 24px",
                borderRadius: 24,
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
