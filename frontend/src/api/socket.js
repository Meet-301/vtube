import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || apiUrl.replace(/\/api\/v1\/?$/, "");

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ["websocket", "polling"],
});

export default socket;
