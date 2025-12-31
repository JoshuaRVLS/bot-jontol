"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socketInstance = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketInstance.on("connect", () => {
            console.log("[Socket] Connected to battle server:", SOCKET_URL);
            setIsConnected(true);
        });

        socketInstance.on("disconnect", () => {
            console.log("[Socket] Disconnected from battle server");
            setIsConnected(false);
        });

        socketInstance.on("connect_error", (err) => {
            console.error("[Socket] Connection error:", err.message);
        });

        socketRef.current = socketInstance;

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
