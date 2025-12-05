import { io } from "socket.io-client";

export function connectSocket() {
  const token = localStorage.getItem("teamchat_token");

  const socket = io("http://localhost:4000", {
    auth: {
      token,
    },
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
}
