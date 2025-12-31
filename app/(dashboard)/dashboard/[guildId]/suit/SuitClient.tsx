"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
    Gamepad2,
    Swords,
    Users,
    Lock,
    Plus,
    X,
    Loader2,
    ShieldCheck,
    Trophy,
    User as UserIcon,
    Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";
import { useToast } from "@/components/ui/Toast";
import {
    createSuitRoomAction,
    joinSuitRoomAction,
    processSuitResultAction,
    getSuitRoomsAction,
    toggleSuitReadyAction,
    makeSuitMoveAction,
    leaveSuitRoomAction
} from "@/app/actions/suit";

interface Participant {
    id: string;
    name: string;
    avatar?: string;
    ready: boolean;
    choice?: string;
}

interface SuitRoom {
    id: string;
    roomCode: string;
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    guildId: string;
    bet: number;
    status: "waiting" | "running" | "revealed" | "finished";
    participants: Participant[];
    winnerId?: string;
    isPrivate: boolean;
}

const CHOICES = [
    { id: "batu", label: "BATU", emoji: "🪨", beats: "gunting" },
    { id: "gunting", label: "GUNTING", emoji: "✂️", beats: "kertas" },
    { id: "kertas", label: "KERTAS", emoji: "📄", beats: "batu" }
];

const SOCKET_URL = "http://localhost:8000";

export default function SuitClient({
    guildId,
    initialWallet,
    userId,
    userName,
    userAvatar
}: {
    guildId: string;
    initialWallet: number;
    userId: string;
    userName: string;
    userAvatar?: string;
}) {
    const { toast } = useToast();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [rooms, setRooms] = useState<SuitRoom[]>([]);
    const [activeRoom, setActiveRoom] = useState<SuitRoom | null>(null);
    const [wallet, setWallet] = useState(initialWallet);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createBet, setCreateBet] = useState(50000);
    const [isPrivate, setIsPrivate] = useState(false);

    const fetchRooms = useCallback(async () => {
        const result = await getSuitRoomsAction(guildId);
        if (result.success && result.rooms) {
            setRooms(result.rooms as any);
        }
        setLoading(false);
    }, [guildId]);

    // Initial load
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // Socket Connection
    useEffect(() => {
        const socketInstance = io(SOCKET_URL, {
            transports: ["polling"]
        });

        socketInstance.on("connect", () => {
            console.log("[Suit] Connected to relay server");
        });

        // Room list relays
        socketInstance.on("suit_room_list_add", (room: SuitRoom) => {
            if (room.guildId === guildId && !room.isPrivate) {
                setRooms(prev => [room, ...prev]);
            }
        });

        socketInstance.on("suit_room_list_update", (room: SuitRoom) => {
            setRooms(prev => prev.map(r => r.id === room.id ? room : r));
            if (activeRoomRef.current?.id === room.id) {
                setActiveRoom(room);
            }
        });

        socketInstance.on("suit_room_list_remove", (roomId: string) => {
            setRooms(prev => prev.filter(r => r.id !== roomId));
            if (activeRoomRef.current?.id === roomId && activeRoomRef.current?.status === "waiting") {
                setActiveRoom(null);
                toast("Room dibubarin bang.", "info");
            }
        });

        // Game relays
        socketInstance.on("room_update", (updatedRoom: SuitRoom) => {
            if (activeRoomRef.current?.id === updatedRoom.id) {
                setActiveRoom(updatedRoom);
            }
        });

        socketInstance.on("opponent_moved", (data: { userId: string }) => {
            if (data.userId !== userId && activeRoomRef.current) {
                setActiveRoom(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        participants: prev.participants.map(p =>
                            p.id === data.userId ? { ...p, choice: "chosen" } : p
                        )
                    } as any;
                });
            }
        });

        socketInstance.on("game_revealed", (finalRoom: SuitRoom) => {
            if (activeRoomRef.current?.id === finalRoom.id) {
                setActiveRoom(finalRoom);

                // Only host handles result payout once
                if (finalRoom.hostId === userId && finalRoom.status === "revealed") {
                    const p1 = finalRoom.participants[0];
                    const p2 = finalRoom.participants[1];

                    let winnerId: string | null = null;
                    if (p1.choice !== p2.choice) {
                        const choice1 = CHOICES.find(c => c.id === p1.choice);
                        if (choice1?.beats === p2.choice) {
                            winnerId = p1.id;
                        } else {
                            winnerId = p2.id;
                        }
                    }

                    processSuitResultAction(finalRoom.id, winnerId).then(() => {
                        socketInstance.emit("update_room", {
                            roomId: finalRoom.id,
                            room: { ...finalRoom, status: "finished", winnerId }
                        });
                    });
                }
            }
        });

        socketInstance.on("error", (err: { message: string }) => {
            toast(err.message, "error");
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [guildId, toast, userId]);

    // Keep activeRoom ref up to date for socket closures
    const activeRoomRef = useRef(activeRoom);
    activeRoomRef.current = activeRoom;

    // Handlers
    const handleCreateRoom = async () => {
        if (createBet < 5000) return toast("Minimal bet Rp 5.000 bang!", "error");
        if (wallet < createBet) return toast("Saldo gak cukup!", "error");

        setJoining(true);
        const result = await createSuitRoomAction({
            guildId,
            bet: createBet,
            isPrivate
        });
        setJoining(false);

        if (result.success && result.room) {
            setWallet(prev => prev - createBet);
            setActiveRoom(result.room as any);
            setShowCreateModal(false);

            socket?.emit("join_room", { roomId: result.room.id, userId, userName, userAvatar });
            socket?.emit("suit_room_created", result.room);
        } else {
            toast(result.error || "Gagal bikin room", "error");
        }
    };

    const handleJoinRoom = async (room: SuitRoom) => {
        if (wallet < room.bet) return toast("Saldo gak cukup join bang!", "error");

        setJoining(true);
        const result = await joinSuitRoomAction(room.id);
        setJoining(false);

        if (result.success && result.room) {
            setWallet(prev => prev - room.bet);
            setActiveRoom(result.room as any);

            socket?.emit("join_room", { roomId: room.id, userId, userName, userAvatar });
            socket?.emit("suit_room_updated", result.room);
            socket?.emit("update_room", { roomId: room.id, room: result.room });
        } else {
            toast(result.error || "Gagal join room", "error");
        }
    };

    const handleToggleReady = async () => {
        if (!activeRoom) return;
        const result = await toggleSuitReadyAction(activeRoom.id);
        if (result.success && result.room) {
            setActiveRoom(result.room as any);
            socket?.emit("update_room", { roomId: activeRoom.id, room: result.room });

            if (result.room.status === "running") {
                socket?.emit("suit_room_removed", activeRoom.id);
            }
        } else {
            toast(result.error || "Gagal ready", "error");
        }
    };

    const handleMakeMove = async (choice: string) => {
        if (!activeRoom || activeRoom.status !== "running") return;
        const result = await makeSuitMoveAction(activeRoom.id, choice);
        if (result.success && result.room) {
            setActiveRoom(result.room as any);
            socket?.emit("suit_move_made", { roomId: activeRoom.id, userId });

            if (result.room.status === "revealed" && result.fullRoom) {
                socket?.emit("suit_reveal", { roomId: activeRoom.id, room: result.fullRoom });
            }
        } else {
            toast(result.error || "Gagal pilih move", "error");
        }
    };

    const handleLeaveRoom = async () => {
        if (!activeRoom) return;
        const result = await leaveSuitRoomAction(activeRoom.id);
        if (result.success) {
            if (result.action === "deleted") {
                socket?.emit("suit_room_removed", activeRoom.id);
            } else if (result.action === "updated" && result.room) {
                socket?.emit("suit_room_updated", result.room);
                socket?.emit("update_room", { roomId: activeRoom.id, room: result.room });
            }
            socket?.emit("leave_room", { roomId: activeRoom.id, userId });
            setActiveRoom(null);
            if (activeRoom.status === "waiting") {
                setWallet(prev => prev + activeRoom.bet);
            }
        } else {
            toast(result.error || "Gagal leave room", "error");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-black italic uppercase tracking-widest text-xs">Mempersiapkan Arena...</p>
            </div>
        );
    }

    if (activeRoom) {
        const isHost = activeRoom.hostId === userId;
        const me = activeRoom.participants.find(p => p.id === userId);
        const opponent = activeRoom.participants.find(p => p.id !== userId);

        return (
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Room Header */}
                <div className="flex items-center justify-between glass-card p-6 rounded-[32px] border-white/5 bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
                    <div className="relative flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                            <Swords className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">ROOM #{activeRoom.roomCode}</h2>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">BET: {formatRupiah(activeRoom.bet)}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLeaveRoom}
                        className="relative p-3 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-red-500/20 hover:border-red-500/20 transition-all font-black uppercase text-[10px] tracking-widest"
                    >
                        CABUT
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center min-h-[50vh]">
                    {/* Me */}
                    <PlayerSection
                        player={me}
                        isMe={true}
                        status={activeRoom.status}
                        onReady={handleToggleReady}
                        onMove={handleMakeMove}
                        winnerId={activeRoom.winnerId}
                    />

                    {/* VS Divider */}
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 flex flex-col items-center justify-center gap-2">
                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent hidden md:block" />
                        <div className="w-12 h-12 rounded-full border-2 border-white/10 bg-black flex items-center justify-center text-primary font-black italic">VS</div>
                        <div className="w-px h-16 bg-gradient-to-t from-transparent via-white/20 to-transparent hidden md:block" />
                    </div>

                    {/* Opponent */}
                    <PlayerSection
                        player={opponent}
                        isMe={false}
                        status={activeRoom.status}
                        winnerId={activeRoom.winnerId}
                    />
                </div>

                {activeRoom.status === "finished" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4"
                    >
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                            {activeRoom.winnerId === userId ? "LU MENANG BANG! 🏆" : activeRoom.winnerId ? "LU KALAH BANG. 💀" : "SERI! 🤝"}
                        </h2>
                        <button
                            onClick={handleLeaveRoom}
                            className="px-8 py-3 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform"
                        >
                            BALIK KE LOBBY
                        </button>
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header / Wallet */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">SUIT MULTIPLAYER</h1>
                    <p className="text-muted-foreground font-medium text-sm">Bertarung adu hoki lawan user lain real-time bang.</p>
                </div>
                <div className="glass-card px-6 py-4 rounded-[32px] border-white/5 bg-white/5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Wallet className="text-primary w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">SALDO ANDA</p>
                        <p className="text-lg font-black italic text-white leading-none tracking-tight">{formatRupiah(wallet)}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-3 px-8 py-4 rounded-[24px] bg-primary text-white font-black uppercase tracking-widest text-xs hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Plus size={18} />
                    BIKIN ARENA BARU
                </button>
            </div>

            {/* Lobby Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {rooms.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-40">
                            <Users size={64} className="mb-4 text-muted-foreground" />
                            <p className="font-black italic uppercase tracking-widest text-sm">Gak ada arena terbuka bang...</p>
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <motion.div
                                key={room.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-card p-6 rounded-[32px] border-white/5 bg-white/5 hover:border-primary/50 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    {room.status === "running" ? (
                                        <div className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">ON GAEM</div>
                                    ) : (
                                        <div className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">OPEN LOBBY</div>
                                    )}
                                </div>

                                <div className="space-y-6 relative">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-white/5">
                                            <Gamepad2 className="text-primary w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black italic uppercase tracking-tighter text-white">ARENA #{room.roomCode}</h3>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">HOST: {room.hostName}</p>
                                        </div>
                                    </div>

                                    <div className="h-px bg-white/5" />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">TOTAL BET</p>
                                            <p className="text-xl font-black italic text-white tracking-tight">{formatRupiah(room.bet)}</p>
                                        </div>
                                        <div className="flex -space-x-3">
                                            {room.participants.map((p, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0a0b0e] overflow-hidden bg-white/10">
                                                    {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-2 text-white/40" />}
                                                </div>
                                            ))}
                                            {[...Array(2 - room.participants.length)].map((_, i) => (
                                                <div key={i} className="w-10 h-10 rounded-full border-2 border-dashed border-white/10 bg-black/20" />
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        disabled={room.participants.length >= 2 || joining}
                                        onClick={() => handleJoinRoom(room)}
                                        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all disabled:opacity-50"
                                    >
                                        {joining ? "JOINING..." : room.participants.length >= 2 ? "ROOM FULL" : "JOIN ARENA"}
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Create Room Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !joining && setShowCreateModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg glass-card p-10 rounded-[40px] border-white/10 bg-gradient-to-br from-[#12141a] to-[#0a0b0e] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-white"><X size={24} /></button>
                            </div>

                            <div className="space-y-8 relative">
                                <div className="text-center space-y-2">
                                    <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 rotate-12 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                                        <Plus className="text-white w-8 h-8" />
                                    </div>
                                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">BIKIN ARENA</h2>
                                    <p className="text-muted-foreground font-medium text-sm">Pasang taruhan lu bang, ajak temen adu nasib.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 block ml-4">JUMLAH BET (IDR)</label>
                                        <div className="relative group">
                                            <input
                                                type="number"
                                                value={createBet}
                                                onChange={(e) => setCreateBet(parseInt(e.target.value) || 0)}
                                                className="w-full bg-white/5 border border-white/10 rounded-[28px] py-6 px-10 text-3xl font-black text-white italic outline-none focus:border-red-500/50 transition-all focus:shadow-[0_0_30px_rgba(239,68,68,0.1)]"
                                            />
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-focus-within:opacity-100 transition-opacity">
                                                <Wallet className="text-primary w-5 h-5" />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {[50000, 100000, 250000, 500000, 1000000].map(val => (
                                                <button
                                                    key={val}
                                                    onClick={() => setCreateBet(val)}
                                                    className={cn(
                                                        "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
                                                        createBet === val ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                    )}
                                                >
                                                    {formatNumber(val)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between glass-card p-6 rounded-[28px] border-white/5 bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                                                <Lock className="text-indigo-400 w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">ROOM PRIVATE</p>
                                                <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Hanya bisa join pake kode.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setIsPrivate(!isPrivate)}
                                            className={cn(
                                                "w-12 h-6 rounded-full transition-all relative",
                                                isPrivate ? "bg-primary" : "bg-white/10"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                                isPrivate ? "left-7" : "left-1"
                                            )} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={joining}
                                    onClick={handleCreateRoom}
                                    className="w-full py-6 rounded-[32px] bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                                >
                                    {joining ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                    BUAT ARENA SEKARANG
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function PlayerSection({
    player,
    isMe,
    status,
    onReady,
    onMove,
    winnerId
}: {
    player?: Participant;
    isMe: boolean;
    status: SuitRoom["status"];
    onReady?: () => void;
    onMove?: (choice: string) => void;
    winnerId?: string | null;
}) {
    if (!player) {
        return (
            <div className="flex flex-col items-center justify-center p-12 glass-card rounded-[40px] border-white/5 bg-white/2 border-dashed border-2 opacity-50">
                <Users size={48} className="text-muted-foreground mb-4" />
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">Menunggu Lawan...</p>
            </div>
        );
    }

    const isWinner = winnerId === player.id;
    const isDraw = winnerId === null && status === "revealed";

    return (
        <div className={cn(
            "flex flex-col items-center p-8 sm:p-12 rounded-[48px] border transition-all relative overflow-hidden",
            isMe ? "bg-gradient-to-b from-primary/10 to-transparent border-primary/20" : "bg-gradient-to-b from-white/5 to-transparent border-white/5",
            isWinner && "bg-amber-500/10 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
        )}>
            {isWinner && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 p-4 animate-bounce">
                    <Trophy className="text-amber-400 w-12 h-12" />
                </div>
            )}

            <div className="relative mb-8">
                <div className={cn(
                    "w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 bg-white/5",
                    isMe ? "border-primary/50" : "border-white/10"
                )}>
                    {player.avatar ? <img src={player.avatar} alt="" className="w-full h-full object-cover" /> : <UserIcon className="w-full h-full p-6 text-white/20" />}
                </div>
                {player.ready && status === "waiting" && (
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-black px-4 py-1 rounded-full text-[10px] font-black italic uppercase tracking-widest shadow-lg">READY</div>
                )}
            </div>

            <div className="text-center space-y-1 mb-10">
                <h3 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white">{player.name}</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{isMe ? "ANDA" : "LAWAN"}</p>
            </div>

            <div className="min-h-[160px] flex items-center justify-center w-full">
                {status === "waiting" ? (
                    isMe && !player.ready ? (
                        <button
                            onClick={onReady}
                            className="px-10 py-4 rounded-2xl bg-primary text-white font-black italic uppercase tracking-widest text-sm hover:scale-110 active:scale-95 transition-all shadow-lg"
                        >
                            READY UP!
                        </button>
                    ) : (
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                            {player.ready ? "SUDAH SIAP" : "BELUM READY"}
                        </p>
                    )
                ) : status === "running" ? (
                    isMe ? (
                        player.choice ? (
                            <div className="text-center space-y-4">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">PILIHAN ANDA TERKUNCI</p>
                                <div className="text-6xl">{CHOICES.find(c => c.id === player.choice)?.emoji}</div>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                {CHOICES.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => onMove?.(c.id)}
                                        className="w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 hover:border-primary hover:bg-primary/10 transition-all hover:scale-110 group"
                                    >
                                        <span className="text-3xl sm:text-4xl grayscale group-hover:grayscale-0 transition-all">{c.emoji}</span>
                                        <span className="text-[8px] font-black text-white/40 group-hover:text-primary">{c.label}</span>
                                    </button>
                                ))}
                            </div>
                        )
                    ) : (
                        player.choice === "chosen" ? (
                            <div className="text-center space-y-4 animate-pulse">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">LAWAN SUDAH PILIH</p>
                                <div className="text-6xl grayscale">❓</div>
                            </div>
                        ) : (
                            <p className="text-xs font-black uppercase tracking-widest text-white/40 animate-pulse">MENUNGGU PILIHAN...</p>
                        )
                    )
                ) : (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 12 }}
                        className="text-center space-y-4"
                    >
                        <div className="text-8xl sm:text-9xl drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            {CHOICES.find(c => c.id === player.choice)?.emoji}
                        </div>
                        <p className="text-lg font-black italic uppercase tracking-tighter text-white">
                            {CHOICES.find(c => c.id === player.choice)?.label}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

function formatNumber(num: number) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "JT";
    if (num >= 1000) return (num / 1000).toFixed(0) + "RB";
    return num.toString();
}
