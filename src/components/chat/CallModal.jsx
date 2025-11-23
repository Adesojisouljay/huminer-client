// src/components/call/CallModal.jsx
import React, { useEffect, useRef, useState } from "react";
import "./call.css"; // local minimal styles

export default function CallModal({
  visible,
  localStream,
  remoteStream,
  callType,
  onHangUp,
  onToggleAudio,
  onToggleVideo,
  callerName,
  isCaller,
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(callType === "video");

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  if (!visible) return null;

  return (
    <div className="call-modal-overlay">
      <div className="call-modal">
        <div className="call-top">
          <div className="call-user">{callerName || (isCaller ? "Calling..." : "Incoming Call")}</div>
          <button className="hangup-btn" onClick={onHangUp}>End</button>
        </div>

        <div className="call-videos">
          <div className="remote-video-wrapper">
            {callType === "video" ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
            ) : (
              <div className="remote-audio-placeholder">
                <div className="initials">{callerName?.[0]?.toUpperCase() || "U"}</div>
                <div>{callerName || "User"}</div>
              </div>
            )}
          </div>

          <div className="local-video-wrapper">
            {callType === "video" ? (
              <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
            ) : (
              <div className="local-audio-placeholder">You</div>
            )}
          </div>
        </div>

        <div className="call-controls">
          <button
            className="control-btn"
            onClick={() => {
              const next = !audioEnabled;
              setAudioEnabled(next);
              onToggleAudio && onToggleAudio(next);
            }}
          >
            {audioEnabled ? "Mute" : "Unmute"}
          </button>

          {callType === "video" && (
            <button
              className="control-btn"
              onClick={() => {
                const next = !videoEnabled;
                setVideoEnabled(next);
                onToggleVideo && onToggleVideo(next);
              }}
            >
              {videoEnabled ? "Camera Off" : "Camera On"}
            </button>
          )}

          <button className="control-btn hang" onClick={onHangUp}>Hang up</button>
        </div>
      </div>
    </div>
  );
}
