import { useRef, useState, useEffect } from "react";

const DEFAULT_CONSTRAINTS = { audio: true, video: true };

export default function useWebRTC({ socket, localUserId }) {
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(new MediaStream());
  const [inCall, setInCall] = useState(false);
  const [callType, setCallType] = useState(null);
  const targetRef = useRef(null);

  // Create RTCPeerConnection
  const createPeerConnection = (remoteUserId) => {
    const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:meet-jit-si-turnrelay.jitsi.net:443" },
          {
            urls: "turn:meet-jit-si-turnrelay.jitsi.net:443",
            username: "jitsi",
            credential: "jitsi"
          }
        ]
      });
      
    // ⭐ DEBUG LOG: ICE connection state
    pc.oniceconnectionstatechange = () => {
      console.log("ICE STATE:", pc.iceConnectionState);
    };

    // ⭐ DEBUG LOG: when remote track arrives
    pc.ontrack = (evt) => {
      console.log("REMOTE TRACK RECEIVED:", evt.streams[0]);

      evt.streams[0]?.getTracks().forEach((track) => {
        if (!remoteStream.getTracks().some((t) => t.id === track.id)) {
          remoteStream.addTrack(track);
        }
      });

      setRemoteStream(remoteStream);
    };

    // Send ICE candidates
    pc.onicecandidate = (evt) => {
      if (evt.candidate && socket) {
        socket.emit("iceCandidate", {
          toUserId: remoteUserId,
          fromUserId: localUserId,
          candidate: evt.candidate,
        });
      }
    };

    pcRef.current = pc;
    return pc;
  };

  const acquireLocalMedia = async (isVideo) => {
    try {
      const constraints = isVideo ? DEFAULT_CONSTRAINTS : { audio: true, video: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // ⭐ DEBUG LOG: local audio tracks
      stream.getAudioTracks().forEach((t) => {
        console.log(
          "LOCAL AUDIO TRACK:",
          "enabled =", t.enabled,
          "id =", t.id,
          "label =", t.label
        );
      });

      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("getUserMedia error:", err);
      throw err;
    }
  };

  const startCall = async ({ toUserId, isVideo = true }) => {
    if (!socket) throw new Error("Socket not available");
    setCallType(isVideo ? "video" : "audio");
    targetRef.current = toUserId;

    const pc = createPeerConnection(toUserId);
    const local = await acquireLocalMedia(isVideo);

    // ⭐ DEBUG LOG: tracks added to pc
    local.getTracks().forEach((track) => {
      console.log("ADDING LOCAL TRACK TO PC:", track.kind, track.id);
      pc.addTrack(track, local);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("callUser", {
      toUserId,
      fromUserId: localUserId,
      callType: isVideo ? "video" : "audio",
      offer,
    });

    setInCall(true);
    return { offer };
  };

  const acceptCall = async ({ fromUserId, offer, isVideo = true }) => {
    if (!socket) throw new Error("Socket not available");
    setCallType(isVideo ? "video" : "audio");
    targetRef.current = fromUserId;

    const pc = createPeerConnection(fromUserId);
    const local = await acquireLocalMedia(isVideo);

    // ⭐ DEBUG LOG: callee local tracks
    local.getTracks().forEach((track) => {
      console.log("CALLEE - ADDING LOCAL TRACK:", track.kind, track.id);
      pc.addTrack(track, local);
    });

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("answerCall", {
      toUserId: fromUserId,
      fromUserId: localUserId,
      answer,
    });

    setInCall(true);
    return { answer };
  };

  const handleRemoteAnswer = async (answer) => {
    if (!pcRef.current) return;
    console.log("REMOTE ANSWER RECEIVED");
    await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleRemoteIce = async (candidate) => {
    if (!pcRef.current) return;
    try {
      console.log("REMOTE ICE CANDIDATE RECEIVED:", candidate);
      await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.warn("addIceCandidate error", err);
    }
  };

  const endCall = () => {
    console.log("CALL ENDED");

    try {
      pcRef.current?.close();
    } catch {}

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
    }

    pcRef.current = null;
    localStreamRef.current = null;

    setLocalStream(null);
    setRemoteStream(new MediaStream());
    setInCall(false);
    setCallType(null);

    if (socket && targetRef.current) {
      socket.emit("endCall", { toUserId: targetRef.current, fromUserId: localUserId });
    }

    targetRef.current = null;
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onCallAnswered = ({ fromUserId, answer }) => handleRemoteAnswer(answer);
    const onIce = ({ fromUserId, candidate }) => handleRemoteIce(candidate);
    const onCallEnded = ({ fromUserId }) => endCall();

    socket.on("callAnswered", onCallAnswered);
    socket.on("iceCandidate", onIce);
    socket.on("callEnded", onCallEnded);

    return () => {
      socket.off("callAnswered", onCallAnswered);
      socket.off("iceCandidate", onIce);
      socket.off("callEnded", onCallEnded);
    };
  }, [socket]);

  return {
    startCall,
    acceptCall,
    endCall,
    localStream,
    remoteStream,
    inCall,
    callType,
  };
}
