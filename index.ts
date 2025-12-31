import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "8000", 10);
const DASHBOARD_URL = process.env.DASHBOARD_URL || "http://localhost:3000";

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
        origin: [DASHBOARD_URL, "http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
});

interface BattleRoom {
    id: string;
    name: string;
    betAmount: number;
    rounds: number;
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    guestId?: string;
    guestName?: string;
    guestAvatar?: string;
    status: "waiting" | "ready" | "rolling" | "finished";
    hostSkins: Skin[];
    guestSkins: Skin[];
    currentRound: number;
    winner?: string;
    createdAt: Date;
}

interface Skin {
    instanceId: string;
    name: string;
    image: string;
    marketPrice: number;
    rarity: { name: string; color: string };
    wear?: string;
}

const battleRooms = new Map<string, BattleRoom>();
const userSockets = new Map<string, string>();

io.on("connection", (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on("register", (userId: string) => {
        userSockets.set(userId, socket.id);
        console.log(`[Socket.IO] User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("create-room", (data: {
        roomId: string;
        name: string;
        betAmount: number;
        rounds: number;
        hostId: string;
        hostName: string;
        hostAvatar?: string;
    }) => {
        const room: BattleRoom = {
            ...data,
            id: data.roomId,
            status: "waiting",
            hostSkins: [],
            guestSkins: [],
            currentRound: 0,
            createdAt: new Date(),
        };
        battleRooms.set(data.roomId, room);
        socket.join(data.roomId);
        io.emit("rooms-update", Array.from(battleRooms.values()));
        console.log(`[Battle] Room created: ${data.roomId} by ${data.hostName}`);
    });

    socket.on("join-room", (data: {
        roomId: string;
        guestId: string;
        guestName: string;
        guestAvatar?: string;
    }) => {
        const room = battleRooms.get(data.roomId);
        if (!room) {
            socket.emit("error", { message: "Room not found" });
            return;
        }

        if (room.guestId) {
            socket.emit("error", { message: "Room is full" });
            return;
        }

        room.guestId = data.guestId;
        room.guestName = data.guestName;
        room.guestAvatar = data.guestAvatar;
        room.status = "ready";

        socket.join(data.roomId);
        io.to(data.roomId).emit("room-update", room);
        io.emit("rooms-update", Array.from(battleRooms.values()));
        console.log(`[Battle] ${data.guestName} joined room ${data.roomId}`);
    });

    socket.on("leave-room", (data: { roomId: string; userId: string }) => {
        const room = battleRooms.get(data.roomId);
        if (!room) return;

        if (room.hostId === data.userId) {
            battleRooms.delete(data.roomId);
            io.to(data.roomId).emit("room-closed", { reason: "Host left" });
        } else if (room.guestId === data.userId) {
            room.guestId = undefined;
            room.guestName = undefined;
            room.guestAvatar = undefined;
            room.status = "waiting";
            io.to(data.roomId).emit("room-update", room);
        }

        socket.leave(data.roomId);
        io.emit("rooms-update", Array.from(battleRooms.values()));
    });

    socket.on("start-battle", async (data: { roomId: string }) => {
        const room = battleRooms.get(data.roomId);
        if (!room || room.status !== "ready") return;

        room.status = "rolling";
        io.to(data.roomId).emit("room-update", room);
        io.to(data.roomId).emit("battle-started");

        for (let round = 1; round <= room.rounds; round++) {
            room.currentRound = round;

            await new Promise(resolve => setTimeout(resolve, 1000));

            const hostSkin = generateRandomSkin();
            const guestSkin = generateRandomSkin();

            room.hostSkins.push(hostSkin);
            room.guestSkins.push(guestSkin);

            io.to(data.roomId).emit("round-result", {
                round,
                hostSkin,
                guestSkin,
                hostTotal: room.hostSkins.reduce((sum, s) => sum + s.marketPrice, 0),
                guestTotal: room.guestSkins.reduce((sum, s) => sum + s.marketPrice, 0),
            });

            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const hostTotal = room.hostSkins.reduce((sum, s) => sum + s.marketPrice, 0);
        const guestTotal = room.guestSkins.reduce((sum, s) => sum + s.marketPrice, 0);

        room.winner = hostTotal > guestTotal ? room.hostId : room.guestId;
        room.status = "finished";

        io.to(data.roomId).emit("battle-finished", {
            winner: room.winner,
            winnerName: hostTotal > guestTotal ? room.hostName : room.guestName,
            hostTotal,
            guestTotal,
            allSkins: [...room.hostSkins, ...room.guestSkins],
        });

        setTimeout(() => {
            battleRooms.delete(data.roomId);
            io.emit("rooms-update", Array.from(battleRooms.values()));
        }, 30000);
    });

    socket.on("get-rooms", () => {
        socket.emit("rooms-update", Array.from(battleRooms.values()));
    });

    socket.on("disconnect", () => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSockets.entries()) {
            if (socketId === socket.id) {
                userSockets.delete(userId);
                break;
            }
        }
    });
});

const RARITIES = [
    { name: "Consumer", color: "#b0c3d9", weight: 50 },
    { name: "Industrial", color: "#5e98d9", weight: 30 },
    { name: "Mil-Spec", color: "#4b69ff", weight: 15 },
    { name: "Restricted", color: "#8847ff", weight: 4 },
    { name: "Classified", color: "#d32ce6", weight: 0.8 },
    { name: "Covert", color: "#eb4b4b", weight: 0.15 },
    { name: "Gold", color: "#ffd700", weight: 0.05 },
];

const SAMPLE_SKINS = [
    "AK-47 | Redline",
    "AWP | Dragon Lore",
    "M4A4 | Howl",
    "Glock-18 | Fade",
    "USP-S | Kill Confirmed",
    "Desert Eagle | Blaze",
    "Karambit | Fade",
    "M9 Bayonet | Doppler",
    "AK-47 | Fire Serpent",
    "AWP | Asiimov",
];

const generateRandomSkin = (): Skin => {
    const totalWeight = RARITIES.reduce((sum, r) => sum + r.weight, 0);
    let random = Math.random() * totalWeight;
    let rarity = RARITIES[0];

    for (const r of RARITIES) {
        random -= r.weight;
        if (random <= 0) {
            rarity = r;
            break;
        }
    }

    const priceMultipliers: Record<string, number> = {
        Consumer: 100,
        Industrial: 500,
        "Mil-Spec": 2000,
        Restricted: 10000,
        Classified: 50000,
        Covert: 200000,
        Gold: 1000000,
    };

    const basePrice = priceMultipliers[rarity.name] || 1000;
    const price = Math.floor(basePrice * (0.5 + Math.random()));

    return {
        instanceId: `battle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: SAMPLE_SKINS[Math.floor(Math.random() * SAMPLE_SKINS.length)],
        image: `https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhjxszJemkV09-5lpKKqPrxN7LEmyVQ7MEpiLuSrYmnjQO3-UNsZzvzI46Ve1Q2MA7TqFC8wO3s1pDv7Z_MmXZgsyFx7CmInBS_gR9JbeM/`,
        marketPrice: price,
        rarity: { name: rarity.name, color: rarity.color },
        wear: ["FN", "MW", "FT", "WW", "BS"][Math.floor(Math.random() * 5)],
    };
};

server.listen(PORT, () => {
    console.log(`[Server] Socket.IO server running on port ${PORT}`);
    console.log(`[Server] Accepting connections from: ${DASHBOARD_URL}`);
});
