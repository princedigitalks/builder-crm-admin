import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    let socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    
    try {
      const url = new URL(socketUrl);
      socketUrl = url.origin;
    } catch (e) {
      console.error("[Socket Admin] Invalid URL:", socketUrl);
    }
    
    console.log("[Socket Admin] Initializing to:", socketUrl, "path: /api/socket.io");

    socket = io(socketUrl, {
      path: "/api/socket.io",
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log(">>> [Socket Admin] CONNECTED SUCCESS:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket Admin] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket Admin] Disconnected:", reason);
    });
  }
  return socket;
};
