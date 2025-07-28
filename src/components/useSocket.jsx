import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = "https://experience-hub-backend.onrender.com"//import.meta.env.BACKEND_URL;

const socket = io(SOCKET_SERVER_URL, {
    transports: ["websocket"],
});

export default socket;