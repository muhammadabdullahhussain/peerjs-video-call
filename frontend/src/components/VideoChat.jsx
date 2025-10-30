import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";

function VideoChat() {
  const localVideo = useRef();
  const remoteVideo = useRef();
  const peerRef = useRef();
  const [myId, setMyId] = useState("");

  useEffect(() => {
    const peer = new Peer(undefined, {
      host: "192.168.1.22", // 👈 your local IP
      port: 9000,
      path: "/myapp",
      secure: false, // 👈 local test
    });

    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("My Peer ID:", id);
      setMyId(id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideo.current.srcObject = stream;
        localVideo.current.play();

        peer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (remoteStream) => {
            remoteVideo.current.srcObject = remoteStream;
            remoteVideo.current.play();
          });
        });
      })
      .catch((err) => console.error("Camera error:", err));
  }, []);

  const callUser = () => {
    const remotePeerId = document.getElementById("peerIdInput").value.trim();
    const call = peerRef.current.call(
      remotePeerId,
      localVideo.current.srcObject
    );

    call.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
      remoteVideo.current.play();
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>My Peer ID: {myId}</h2>
      <video
        ref={localVideo}
        muted
        playsInline
        style={{ width: "300px", marginRight: "10px" }}
      />
      <video ref={remoteVideo} playsInline style={{ width: "300px" }} />
      <div style={{ marginTop: "20px" }}>
        <input
          id="peerIdInput"
          placeholder="Enter Peer ID to call"
          style={{ padding: "5px", width: "250px" }}
        />
        <button
          onClick={callUser}
          style={{ marginLeft: "10px", padding: "5px 10px" }}
        >
          Call
        </button>
      </div>
    </div>
  );
}

export default VideoChat;
