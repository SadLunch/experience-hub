import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = import.meta.env.BACKEND_URL || "http://localhost:5000";

const socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
});

export default socket;