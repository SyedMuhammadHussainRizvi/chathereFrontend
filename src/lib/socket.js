import { io } from "socket.io-client";

export const socket = io("https://b149qwqh-4000.inc1.devtunnels.ms/", {
    autoConnect: false,
});