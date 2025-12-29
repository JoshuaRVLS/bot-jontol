"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Swords,
    Crown,
    Users,
    Check,
    X,
    Play,
    Trophy,
    Eye,
    ArrowLeft,
    Loader2,
    Copy,
    CheckCheck,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/components/SocketProvider";
import { executeBattleAction } from "@/app/actions/battle";
import { CASE_CONFIGS, CaseType } from "@/lib/csgo";
import { cn } from "@/lib/utils";

interface Participant {
    id: string;
    name: string;
    avatar?: string;
    ready: boolean;
}

interface BattleResult {
    participantId: string;
    participantName: string;
    skins: any[];
    totalValue: number;
}

interface BattleRoom {
    id: string;
    roomCode: string;
    hostId: string;
    hostName: string;
    caseType: string;
    crateCount: number;
    maxPlayers: number;
    isPrivate: boolean;
    status: string;
    participants: Participant[];
    spectators: { id: string; name: string }[];
    results?: BattleResult[];
    winnerId?: string;
}

interface BattleRoomViewProps {
    room: BattleRoom;
    guildId: string;
    currentUser: {
        id: string;
        name: string;
        avatar?: string;
        wallet: number;
    };
}

export const BattleRoomView = ({ room: initialRoom, guildId, currentUser }: BattleRoomViewProps) => {
    const [room, setRoom] = useState<BattleRoom>(initialRoom);
    const [isStarting, setIsStarting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [animationPhase, setAnimationPhase] = useState<"idle" | "rolling" | "reveal" | "winner">("idle");
    const [currentRollIndex, setCurrentRollIndex] = useState(0);
    const { socket, isConnected } = useSocket();
    const router = useRouter();

    const isHost = currentUser.id === room.hostId;
    const isParticipant = room.participants.some(p => p.id === currentUser.id);
    const isSpectator = !isParticipant;
    const caseConfig = CASE_CONFIGS[room.caseType as CaseType];

    useEffect(() => {
        if (!socket) return;

        socket.emit("spectate_room", { roomId: room.id, userId: currentUser.id, userName: currentUser.name });

        socket.on("room_update", (updatedRoom: BattleRoom) => {
            setRoom(updatedRoom);
        });

        socket.on("battle_start", async () => {
            setAnimationPhase("rolling");
            const res = await executeBattleAction(room.id);
            if (res.success) {
                setRoom(prev => ({
                    ...prev,
                    status: "finished",
                    results: res.results,
                    winnerId: res.winnerId
                }));

                for (let i = 0; i < (res.results?.length || 0); i++) {
                    await new Promise(r => setTimeout(r, 3000));
                    setCurrentRollIndex(i + 1);
                }
                setAnimationPhase("winner");
            }
        });

        socket.on("battle_finished", (updatedRoom: BattleRoom) => {
            setRoom(updatedRoom);
            setAnimationPhase("winner");
        });

        return () => {
            socket.off("room_update");
            socket.off("battle_start");
            socket.off("battle_finished");
        };
    }, [socket, room.id, currentUser]);

    const handleToggleReady = () => {
        if (!socket || isSpectator) return;
        socket.emit("toggle_ready", { roomId: room.id, userId: currentUser.id });
    };

    const handleJoin = () => {
        if (!socket) return;

        const totalCost = caseConfig.cost * room.crateCount;
        if (currentUser.wallet < totalCost) {
            alert(`Duit lu kurang! Butuh Rp ${totalCost.toLocaleString()}`);
            return;
        }

        socket.emit("join_room", {
            roomId: room.id,
            userId: currentUser.id,
            userName: currentUser.name,
            userAvatar: currentUser.avatar
        });
    };

    const handleStartBattle = () => {
        if (!socket || !isHost) return;
        setIsStarting(true);
        socket.emit("start_battle", { roomId: room.id, hostId: currentUser.id });
    };

    const handleLeave = () => {
        if (socket) {
            socket.emit("leave_room", { roomId: room.id, userId: currentUser.id });
        }
        router.push(`/dashboard/${guildId}/battle`);
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(room.roomCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const allReady = room.participants.every(p => p.ready);
    const canStart = isHost && room.participants.length >= 2 && allReady && room.status === "waiting";

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button onClick={handleLeave} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                    <span className="font-bold text-sm">Kembali ke Lobby</span>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleCopyCode}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                        {isCopied ? <CheckCheck size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        <span className="font-black text-xs uppercase">#{room.roomCode}</span>
                    </button>
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                        room.status === "waiting" ? "bg-amber-500/20 text-amber-400" :
                            room.status === "running" ? "bg-red-500/20 text-red-400" :
                                "bg-emerald-500/20 text-emerald-400"
                    )}>
                        {room.status === "waiting" ? "Menunggu" : room.status === "running" ? "Berlangsung" : "Selesai"}
                    </div>
                </div>
            </div>

            {/* Room Info Card */}
            <div className="glass-card rounded-[32px] border-white/5 p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
                            <Swords size={28} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase italic">Battle Room</h2>
                            <div className="flex items-center gap-3 mt-1 text-xs font-bold text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Zap size={12} />
                                    {room.caseType} ({room.crateCount}x)
                                </span>
                                <span className="text-white/20">|</span>
                                <span className="flex items-center gap-1">
                                    <Users size={12} />
                                    {room.participants.length}/{room.maxPlayers}
                                </span>
                                <span className="text-white/20">|</span>
                                <span>Entry: Rp {(caseConfig?.cost * room.crateCount || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {room.status === "waiting" && (
                        <div className="flex gap-3">
                            {isParticipant && !isHost && (
                                <button
                                    onClick={handleToggleReady}
                                    className={cn(
                                        "px-6 py-3 rounded-2xl font-black uppercase text-xs transition-all",
                                        room.participants.find(p => p.id === currentUser.id)?.ready
                                            ? "bg-emerald-500 text-white"
                                            : "bg-white/5 border border-white/10"
                                    )}
                                >
                                    {room.participants.find(p => p.id === currentUser.id)?.ready ? (
                                        <span className="flex items-center gap-2"><Check size={16} /> READY!</span>
                                    ) : (
                                        "CLICK TO READY"
                                    )}
                                </button>
                            )}
                            {isSpectator && room.participants.length < room.maxPlayers && (
                                <button
                                    onClick={handleJoin}
                                    className="px-6 py-3 rounded-2xl bg-red-500 text-white font-black uppercase text-xs shadow-xl shadow-red-500/20"
                                >
                                    JOIN BATTLE
                                </button>
                            )}
                            {canStart && (
                                <button
                                    onClick={handleStartBattle}
                                    disabled={isStarting}
                                    className="px-8 py-3 rounded-2xl bg-red-500 text-white font-black uppercase text-xs shadow-xl shadow-red-500/20 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isStarting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                                    MULAI BATTLE!
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Participants Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: room.maxPlayers }).map((_, idx) => {
                    const participant = room.participants[idx];
                    const result = room.results?.find(r => r.participantId === participant?.id);
                    const isWinner = participant?.id === room.winnerId;

                    return (
                        <motion.div
                            key={idx}
                            layout
                            className={cn(
                                "glass-card rounded-[28px] border-white/5 p-5 text-center transition-all",
                                isWinner && "border-amber-500/50 bg-amber-500/10"
                            )}
                        >
                            {participant ? (
                                <div className="space-y-3">
                                    <div className="relative inline-block">
                                        {participant.avatar ? (
                                            <img src={participant.avatar} alt="" className="w-16 h-16 rounded-2xl mx-auto object-cover" />
                                        ) : (
                                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl mx-auto">
                                                {participant.name[0]}
                                            </div>
                                        )}
                                        {isWinner && (
                                            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                                                <Crown size={16} className="text-white" />
                                            </div>
                                        )}
                                        {participant.id === room.hostId && !isWinner && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                                <Crown size={10} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase text-sm">{participant.name}</h4>
                                        {room.status === "waiting" && (
                                            <span className={cn(
                                                "text-[10px] font-black uppercase",
                                                participant.ready ? "text-emerald-400" : "text-muted-foreground"
                                            )}>
                                                {participant.ready ? "READY" : "NOT READY"}
                                            </span>
                                        )}
                                        {result && (
                                            <div className="mt-2 space-y-1">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase">{result.skins.length} Skins</p>
                                                <p className={cn(
                                                    "text-sm font-black",
                                                    isWinner ? "text-amber-400" : "text-white"
                                                )}>
                                                    Rp {result.totalValue.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 space-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 mx-auto flex items-center justify-center">
                                        <Users size={24} className="text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase text-muted-foreground">Slot Kosong</p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Results Display */}
            {room.status === "finished" && room.results && (
                <div className="space-y-6">
                    <h3 className="text-xl font-black uppercase italic text-center flex items-center justify-center gap-3">
                        <Trophy size={24} className="text-amber-400" />
                        HASIL BATTLE
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {room.results.map((result) => (
                            <div key={result.participantId} className={cn(
                                "glass-card rounded-[24px] border-white/5 p-4",
                                result.participantId === room.winnerId && "border-amber-500/50"
                            )}>
                                <div className="flex items-center gap-3 mb-3">
                                    {result.participantId === room.winnerId && <Crown size={18} className="text-amber-400" />}
                                    <span className="font-black uppercase">{result.participantName}</span>
                                    <span className="ml-auto text-sm font-black text-emerald-400">
                                        Rp {result.totalValue.toLocaleString()}
                                    </span>
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {result.skins.slice(0, 10).map((skin, idx) => (
                                        <div key={idx} className="relative group aspect-square bg-white/5 rounded-lg overflow-hidden">
                                            <img src={skin.image} alt="" className="w-full h-full object-contain" />
                                            <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: skin.rarity?.color }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Spectators */}
            {room.spectators && room.spectators.length > 0 && (
                <div className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <Eye size={12} className="inline mr-2" />
                    {room.spectators.length} Penonton: {room.spectators.map(s => s.name).join(", ")}
                </div>
            )}
        </div>
    );
};
