import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "8000", 10);

const server = http.createServer((req, res) => {
    if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", timestamp: Date.now() }));
        return;
    }
    res.writeHead(404);
    res.end();
});

const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["polling"],
});

io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Lobby & Room Management
    socket.on("join_room", (data: { roomId: string; userId: string; userName: string; userAvatar?: string }) => {
        socket.join(data.roomId);
        console.log(`[Battle] User ${data.userName} joined room ${data.roomId}`);
    });

    socket.on("spectate_room", (data: { roomId: string; userId: string; userName: string }) => {
        socket.join(data.roomId);
        console.log(`[Battle] Spectator ${data.userName} joined room ${data.roomId}`);
    });

    socket.on("leave_room", (data: { roomId: string; userId: string }) => {
        socket.leave(data.roomId);
    });

    // Relay room updates from dashboard to all clients in the room
    socket.on("update_room", (data: { roomId: string; room: any }) => {
        io.to(data.roomId).emit("room_update", data.room);
    });

    // Triggered by host to start the sequence
    socket.on("start_battle", (data: { roomId: string; hostId: string }) => {
        io.to(data.roomId).emit("battle_start", { roomId: data.roomId });
    });

    // Host sends pre-calculated results to be broadcasted to everyone
    socket.on("sync_results", (data: { roomId: string; results: any[]; winnerId: string }) => {
        io.to(data.roomId).emit("battle_results", {
            results: data.results,
            winnerId: data.winnerId
        });
    });

    socket.on("send_message", (data: { roomId: string; userId: string; userName: string; message: string }) => {
        io.to(data.roomId).emit("new_message", data);
    });

    // Suit Specific Relays
    socket.on("suit_room_created", (room: any) => {
        io.emit("suit_room_list_add", room);
    });

    socket.on("suit_room_updated", (room: any) => {
        io.emit("suit_room_list_update", room);
    });

    socket.on("suit_room_removed", (roomId: string) => {
        io.emit("suit_room_list_remove", roomId);
    });

    socket.on("suit_move_made", (data: { roomId: string; userId: string }) => {
        io.to(data.roomId).emit("opponent_moved", data);
    });

    socket.on("suit_reveal", (data: { roomId: string; room: any }) => {
        io.to(data.roomId).emit("game_revealed", data.room);
    });

    socket.on("disconnect", () => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`[Server] Socket.IO server running on port ${PORT}`);
});
