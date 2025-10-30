import { PeerServer } from "peer";

const peerServer = PeerServer({
  port: 9000,
  path: "/myapp",
  host: "0.0.0.0", // important
});
console.log("✅ PeerJS server running on port 9000");
