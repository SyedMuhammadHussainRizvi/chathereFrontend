import { io } from "socket.io-client";

export const socket = io("https://ltm2wqrx-4000.inc1.devtunnels.ms", {
    autoConnect: false,
});