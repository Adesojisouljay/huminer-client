import React, { useEffect, useRef, useState } from "react";
import { MdCallEnd, MdMic, MdMicOff, MdVideocam, MdVideocamOff, MdCameraswitch } from "react-icons/md";
import "./call.css";

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
  const remoteAudioRef = useRef(null);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(callType === "video");
  const [elapsed, setElapsed] = useState(0);

  // Timer
  useEffect(() => {
    if (!visible) {
      setElapsed(0);
      return;
    }
    const interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [visible]);

  // Format time
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Attach local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, visible]);

  // Attach remote stream
  useEffect(() => {
    if (!remoteStream) return;

    if (callType === "video" && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch(console.error);
    } else if (callType === "audio" && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
      remoteAudioRef.current
        .play()
        .then(() => console.log("Audio playing"))
        .catch((err) => console.warn("Autoplay blocked?", err));
    }
  }, [remoteStream, callType, visible]);

  if (!visible) return null;

  return (
    <div className="call-modal-overlay">
      <div className="call-modal">
        {/* Header Overlay */}
        <div className="call-header">
          <div className="call-info">
            <div className="caller-name">{callerName || (isCaller ? "Calling..." : "Incoming Call")}</div>
            <div className="call-status">
              {isCaller && elapsed === 0 ? "Ring..." : <span className="call-timer">{formatTime(elapsed)}</span>}
              • {callType === "video" ? "Video Call" : "Voice Call"}
            </div>
          </div>
        </div>

        <div className="call-videos">
          {/* Remote Video / Audio Area */}
          <div className="remote-video-wrapper">
            {callType === "video" ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="remote-video"
              />
            ) : (
              <div className="audio-placeholder">
                <div className="audio-avatar">
                  {callerName?.[0]?.toUpperCase() || "U"}
                </div>
                {/* Invisible audio element for stream playback */}
                <audio ref={remoteAudioRef} autoPlay hidden />
              </div>
            )}
          </div>

          {/* Local Video (Floating) */}
          {callType === "video" && (
            <div className="local-video-wrapper">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="local-video"
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="call-controls">
          {/* Mute Toggle */}
          <button
            className={`control-btn ${!audioEnabled ? "active" : ""}`}
            onClick={() => {
              const next = !audioEnabled;
              setAudioEnabled(next);
              onToggleAudio && onToggleAudio(next);
            }}
            title={audioEnabled ? "Mute" : "Unmute"}
          >
            {audioEnabled ? <MdMic /> : <MdMicOff style={{ color: "#111" }} />}
          </button>

          {/* Video Toggle */}
          {callType === "video" && (
            <button
              className={`control-btn ${!videoEnabled ? "active" : ""}`}
              onClick={() => {
                const next = !videoEnabled;
                setVideoEnabled(next);
                onToggleVideo && onToggleVideo(next);
              }}
              title={videoEnabled ? "Turn Camera Off" : "Turn Camera On"}
            >
              {videoEnabled ? <MdVideocam /> : <MdVideocamOff style={{ color: "#111" }} />}
            </button>
          )}

          {/* Switch Cam (Visual Only for now) */}
          {/* <button className="control-btn" title="Switch Camera">
             <MdCameraswitch />
           </button> */}

          {/* Hang Up */}
          <button className="control-btn hangup" onClick={onHangUp} title="End Call">
            <MdCallEnd />
          </button>
        </div>
      </div>
    </div>
  );
}
