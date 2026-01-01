"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Swords,
    Crown,
    Users,
    Play,
    ArrowLeft,
    Loader2,
    Copy,
    CheckCheck,
    Zap,
    History,
    Dices
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/components/SocketProvider";
import { executeBattleAction, startBattleAction, leaveBattleRoomAction } from "@/app/actions/battle";
import { CASE_CONFIGS, CaseType } from "@/lib/csgo";
import { cn } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";

interface Participant {
    id: string;
    name: string;
    avatar?: string;
    ready: boolean;
}

interface Skin {
    instanceId: string;
    name: string;
    image: string;
    marketPrice: number;
    rarity: { name: string; color: string };
    wear?: string;
}

interface BattleResult {
    participantId: string;
    participantName: string;
    skins: Skin[];
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
    crazyMode: boolean;
    isTeamMode: boolean;
    status: string;
    participants: Participant[];
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

// Carousel Component for single opening
const SkinCarousel = ({ skin, isRolling, roundIndex }: { skin: Skin | null, isRolling: boolean, roundIndex: number }) => {
    if (!skin && !isRolling) return (
        <div className="w-full aspect-square bg-white/5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center">
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none text-center px-1">Round {roundIndex + 1}</span>
        </div>
    );

    return (
        <div className="relative w-full aspect-square glass-card rounded-2xl border-white/5 overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4">
            <AnimatePresence mode="wait">
                {isRolling ? (
                    <motion.div
                        key="rolling"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center gap-1 sm:gap-3"
                    >
                        <motion.div
                            animate={{
                                rotateY: [0, 360],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <Dices size={30} className="text-white/20 sm:w-10 sm:h-10" />
                        </motion.div>
                        <span className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase animate-pulse">Rolling...</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reveal"
                        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        className="flex flex-col items-center text-center w-full h-full justify-between"
                    >
                        <div className="relative w-full h-2/3 flex items-center justify-center">
                            <motion.img
                                src={skin!.image}
                                alt={skin!.name}
                                className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                                animate={{ y: [0, -3, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <div className="absolute inset-0 bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
                        </div>
                        <div className="mt-1 sm:mt-2 w-full">
                            <p className="text-[8px] sm:text-[10px] font-black leading-tight line-clamp-2 uppercase whitespace-normal h-5 sm:h-6 flex items-center justify-center px-0.5 sm:px-1">
                                {skin!.name}
                            </p>
                            <p className="text-[8px] sm:text-[10px] font-bold text-emerald-400 mt-0.5 sm:mt-1">
                                {formatRupiah(skin!.marketPrice)}
                            </p>
                        </div>
                        <div
                            className="absolute bottom-0 left-0 w-full h-0.5 sm:h-1"
                            style={{ backgroundColor: skin!.rarity?.color || "#5865f2" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const RoundIndicator = ({ current, total }: { current: number, total: number }) => {
    return (
        <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-1 rounded-full transition-all duration-500",
                        i < current ? "w-4 bg-emerald-500" :
                            i === current ? "w-8 bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" :
                                "w-2 bg-white/10"
                    )}
                />
            ))}
        </div>
    );
};

export const BattleRoomView = ({ room: initialRoom, guildId, currentUser }: BattleRoomViewProps) => {
    const [room, setRoom] = useState<BattleRoom>(initialRoom);
    const [isStarting, setIsStarting] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // Animation State
    const [battleResults, setBattleResults] = useState<BattleResult[] | null>(null);
    const [currentRound, setCurrentRound] = useState(-1); // -1: lobby, 0+: rolling
    const [isRollingRound, setIsRollingRound] = useState(false);

    const { socket } = useSocket();
    const router = useRouter();

    const isHost = currentUser.id === room.hostId;
    const isParticipant = room.participants.some(p => p.id === currentUser.id);
    const caseConfig = CASE_CONFIGS[room.caseType as CaseType];

    const handleHostExecution = useCallback(async () => {
        if (!isHost) return;

        const res = await executeBattleAction(room.id);
        if (res.success && res.results) {
            socket?.emit("sync_results", {
                roomId: room.id,
                results: res.results,
                winnerId: res.winnerId
            });
        }
    }, [isHost, room.id, socket]);

    const startAnimationSequence = useCallback(async (results: BattleResult[]) => {
        setRoom(prev => ({ ...prev, status: "running" }));

        for (let i = 0; i < room.crateCount; i++) {
            setCurrentRound(i);
            setIsRollingRound(true);
            await new Promise(r => setTimeout(r, 2000)); // Roll time
            setIsRollingRound(false);
            await new Promise(r => setTimeout(r, 1500)); // Reveal wait
        }

        setRoom(prev => ({
            ...prev,
            status: "finished",
            results: results,
            winnerId: (() => {
                if (prev.isTeamMode && results.length === 4) {
                    const t1Val = results[0].totalValue + results[2].totalValue;
                    const t2Val = results[1].totalValue + results[3].totalValue;
                    const t1Wins = prev.crazyMode ? t1Val < t2Val : t1Val > t2Val;
                    return t1Wins ? results[0].participantId : results[1].participantId;
                }
                return results.reduce((best, r) => {
                    if (prev.crazyMode) {
                        return r.totalValue < best.totalValue ? r : best;
                    }
                    return r.totalValue > best.totalValue ? r : best;
                }).participantId;
            })()
        }));
    }, [room.crateCount]);

    // Initialize/Sync
    useEffect(() => {
        if (!socket) return;

        socket.emit("spectate_room", { roomId: room.id, userId: currentUser.id, userName: currentUser.name });

        socket.on("room_update", (updatedRoom: BattleRoom) => {
            if (updatedRoom.status === "removed") {
                router.push(`/dashboard/${guildId}/battle`);
                return;
            }
            setRoom(updatedRoom);
        });

        socket.on("battle_start", () => {
            setRoom(prev => ({ ...prev, status: "running" }));
            handleHostExecution();
        });

        socket.on("battle_results", (data: { results: BattleResult[], winnerId: string }) => {
            setBattleResults(data.results);
            startAnimationSequence(data.results);
        });

        return () => {
            socket.off("room_update");
            socket.off("battle_start");
            socket.off("battle_results");
        };
    }, [socket, room.id, currentUser.id, currentUser.name, guildId, router, handleHostExecution, startAnimationSequence]);


    const handleToggleReady = () => {
        if (!socket || !isParticipant) return;
        socket.emit("update_room", {
            roomId: room.id,
            room: {
                ...room,
                participants: room.participants.map(p =>
                    p.id === currentUser.id ? { ...p, ready: !p.ready } : p
                )
            }
        });

        socket.emit("battle_room_updated", {
            ...room,
            participants: room.participants.map(p =>
                p.id === currentUser.id ? { ...p, ready: !p.ready } : p
            )
        });
    };

    const handleJoin = () => {
        if (!socket || isParticipant || room.participants.length >= room.maxPlayers) return;
        const updatedParticipants = [...room.participants, {
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            ready: true
        }];
        socket.emit("update_room", {
            room: { ...room, participants: updatedParticipants }
        });
        socket.emit("battle_room_updated", { ...room, participants: updatedParticipants });
    };

    const handleStartBattle = async () => {
        if (!socket || !isHost) return;
        setIsStarting(true);
        const res = await startBattleAction(room.id);
        if (res.success) {
            socket.emit("start_battle", { roomId: room.id, hostId: currentUser.id });
        } else {
            alert(res.error);
            setIsStarting(false);
        }
    };

    const handleLeave = async () => {
        const res = await leaveBattleRoomAction(room.id);
        if (res.success) {
            if (res.action === "removed") {
                socket?.emit("battle_room_removed", room.id);
                socket?.emit("update_room", {
                    roomId: room.id,
                    room: { ...room, status: "removed" } // This helps client side handling
                });
            } else if (res.action === "updated" && res.room) {
                socket?.emit("update_room", {
                    roomId: room.id,
                    room: res.room
                });
                socket?.emit("battle_room_updated", res.room);
            }
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

    // Progress percentage
    const progress = Math.max(0, ((currentRound + (isRollingRound ? 0.5 : 1)) / room.crateCount) * 100);

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20 relative">
            {/* Header Sticky */}
            <div className="flex items-center justify-between bg-background/80 backdrop-blur-xl p-3 sm:p-4 rounded-2xl sm:rounded-3xl sticky top-20 z-30 border border-white/5 shadow-2xl">
                <button onClick={handleLeave} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors px-2 sm:px-4 py-2 hover:bg-white/5 rounded-xl">
                    <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                    <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest italic tracking-tighter">KABURRR</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-50">Room Hash</p>
                        <p className="text-xs font-mono font-bold">#{room.roomCode}</p>
                    </div>
                    <button
                        onClick={handleCopyCode}
                        className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-muted-foreground hover:text-white"
                    >
                        {isCopied ? <CheckCheck size={16} className="text-emerald-400 sm:w-[18px] sm:h-[18px]" /> : <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />}
                    </button>
                    {room.crazyMode && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse">
                            <Zap size={10} className="fill-red-500" />
                            CRAZY MODE
                        </div>
                    )}
                    <div className={cn(
                        "px-3 sm:px-6 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-black/40",
                        room.status === "waiting" ? "bg-amber-500/20 text-amber-500 border border-amber-500/20" :
                            room.status === "running" ? "bg-red-500 text-white border border-red-400/50 animate-pulse" :
                                "bg-emerald-500 text-white border border-emerald-400/50"
                    )}>
                        {room.status === "waiting" ? "NYARI TUMBAL" : room.status === "running" ? "GACOR KANG!!" : "DONE MASZEHH"}
                    </div>
                </div>
            </div>

            {/* Battle Main Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Players Column */}
                <div className="lg:col-span-3 space-y-4">

                    {/* Progress Bar (Visible when running) */}
                    {room.status === "running" && (
                        <div className="glass-card rounded-2xl p-2 relative overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-red-500/10 transition-all duration-500" style={{ width: `${progress}%` }} />
                            <div className="flex items-center justify-between px-4 relative z-10">
                                <span className="text-[10px] font-black uppercase text-red-500 italic flex items-center gap-2">
                                    <Zap size={12} className="animate-pulse" /> {room.crazyMode ? "CRAZY MODE ACTIVATED" : "PROSES PEMBERSIHAN DOYA"}
                                </span>
                                <div className="flex items-center gap-3">
                                    <RoundIndicator current={currentRound} total={room.crateCount} />
                                    <span className="text-[10px] font-black uppercase text-muted-foreground ml-2">
                                        Ronde {currentRound + 1} / {room.crateCount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Participants Row/Container */}
                    <div className={cn(
                        "grid gap-4",
                        room.status === "waiting" ? (room.isTeamMode ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4") : "grid-cols-1"
                    )}>
                        {Array.from({ length: room.maxPlayers }).map((_, idx) => {
                            const p = room.participants[idx];
                            const pResults = battleResults?.find(r => r.participantId === p?.id);
                            const currentTotal = pResults?.skins.slice(0, currentRound + (isRollingRound ? 0 : 1)).reduce((sum, s) => sum + s.marketPrice, 0) || 0;
                            const isWinner = room.status === "finished" && p?.id === room.winnerId;

                            // Team Assignment
                            const isTeamCT = room.isTeamMode && (idx === 0 || idx === 2);
                            const isTeamT = room.isTeamMode && (idx === 1 || idx === 3);

                            // In Battle View, we show each player in a row with their rolls
                            if (room.status !== "waiting" && p) {
                                return (
                                    <motion.div
                                        key={p.id}
                                        layout
                                        className={cn(
                                            "glass-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 items-center relative overflow-hidden transition-all duration-700",
                                            isWinner ? "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)] sm:shadow-[0_0_40px_rgba(245,158,11,0.2)]" : "border-white/5",
                                            isTeamCT ? "bg-blue-500/5 border-blue-500/20" : isTeamT ? "bg-amber-500/5 border-amber-500/20" : ""
                                        )}
                                    >
                                        {isWinner && (
                                            <div className="absolute top-0 right-0 p-4">
                                                <Crown className="text-amber-500 drop-shadow-glow" size={32} />
                                            </div>
                                        )}

                                        {/* Team Badge */}
                                        {room.isTeamMode && (
                                            <div className={cn(
                                                "absolute top-4 left-4 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
                                                isTeamCT ? "bg-blue-500 text-white" : "bg-amber-600 text-white"
                                            )}>
                                                {isTeamCT ? "CT TEAM" : "T TEAM"}
                                            </div>
                                        )}

                                        {/* Player Profile & Stats */}
                                        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 sm:gap-3 min-w-[120px] sm:min-w-[140px]">
                                            <div className="relative">
                                                {p.avatar ? (
                                                    <img src={p.avatar} alt={p.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover ring-2 ring-white/5" />
                                                ) : (
                                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/5 flex items-center justify-center font-black text-lg sm:text-xl border border-white/10 uppercase">{p.name[0]}</div>
                                                )}
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-background border border-white/10 flex items-center justify-center text-[8px] sm:text-[10px] font-black">
                                                    #{idx + 1}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase text-[10px] sm:text-sm italic line-clamp-1 flex items-center gap-2">
                                                    {p.name}
                                                    {isWinner && <Crown size={12} className="text-amber-500 animate-bounce" />}
                                                </h4>
                                                <p className={cn(
                                                    "text-lg sm:text-xl font-black mt-0.5 sm:mt-1",
                                                    isWinner ? "text-amber-500" : "text-white"
                                                )}>{formatRupiah(currentTotal)}</p>
                                                <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">HASIL NYOPET</p>
                                            </div>
                                        </div>

                                        {/* Carousel / Current Roll Area */}
                                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                                            {/* Previous Rolls */}
                                            {Array.from({ length: currentRound }).map((_, rIdx) => (
                                                <div key={rIdx} className="relative group opacity-50 hover:opacity-100 transition-opacity">
                                                    <img src={pResults?.skins[rIdx].image} alt={pResults?.skins[rIdx].name} className="w-full aspect-square object-contain bg-white/5 rounded-xl border border-white/5" />
                                                    <div className="absolute bottom-1 left-1 px-1 bg-black/60 rounded text-[8px] font-bold">
                                                        {formatRupiah(pResults!.skins[rIdx].marketPrice, false)}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Current Roll */}
                                            {room.status === "running" && currentRound < room.crateCount && (
                                                <div className="col-span-full sm:col-span-1">
                                                    <SkinCarousel
                                                        skin={isRollingRound ? null : (pResults?.skins[currentRound] || null)}
                                                        isRolling={isRollingRound}
                                                        roundIndex={currentRound}
                                                    />
                                                </div>
                                            )}

                                            {/* Summary for Finished */}
                                            {room.status === "finished" && (
                                                <div className="col-span-full border-t border-white/5 pt-4 mt-2 flex items-center justify-between">
                                                    <div className="flex -space-x-3 overflow-hidden">
                                                        {pResults?.skins.slice(0, 5).map((s, i) => (
                                                            <img key={i} src={s.image} alt={s.name} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-white/5 border border-white/10" />
                                                        ))}
                                                        {pResults!.skins.length > 5 && (
                                                            <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-background bg-muted text-[8px] font-black">
                                                                +{pResults!.skins.length - 5}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase text-muted-foreground transition-all">Detail</button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            }

                            // Lobby View
                            return (
                                <motion.div key={idx} className={cn(
                                    "glass-card rounded-3xl p-6 border-white/5 text-center flex flex-col items-center gap-4 transition-all hover:scale-[1.02]",
                                    p ? "bg-white/5" : "bg-transparent border-dashed border-2 border-white/10",
                                    isTeamCT ? "border-blue-500/40 bg-blue-500/5 focus:ring-2 ring-blue-500/20" :
                                        isTeamT ? "border-amber-500/40 bg-amber-500/5 focus:ring-2 ring-amber-500/20" : ""
                                )}>
                                    {room.isTeamMode && (
                                        <div className={cn(
                                            "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter",
                                            isTeamCT ? "bg-blue-500 text-white" : "bg-amber-600 text-white"
                                        )}>
                                            {isTeamCT ? "Counter-Terrorists" : "Terrorists"}
                                        </div>
                                    )}
                                    {p ? (
                                        <>
                                            <div className="relative">
                                                {p.avatar ? (
                                                    <img src={p.avatar} alt={p.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/5" />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center font-black text-2xl uppercase">{p.name[0]}</div>
                                                )}
                                                {p.id === room.hostId && (
                                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center text-white border-2 border-background">
                                                        <Crown size={12} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase text-sm italic">{p.name}</h4>
                                                <div className={cn(
                                                    "mt-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest",
                                                    p.ready ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-white/5 text-muted-foreground border border-white/10"
                                                )}>
                                                    {p.ready ? "READY!" : "PENDING"}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="py-8 space-y-3 opacity-30">
                                            <Users size={32} className="mx-auto" />
                                            <p className="text-[10px] font-black uppercase tracking-tighter">Slot Kosong</p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-4">
                    {/* Case Config Card */}
                    <div className="glass-card rounded-[32px] p-6 border-white/5 space-y-6">
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-16 h-16 rounded-3xl bg-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                                <Swords size={32} />
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tighter">Battle Arena</h3>
                        </div>

                        <div className="space-y-3 border-t border-white/5 pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Case Type</span>
                                <span className="text-xs font-bold uppercase">{room.caseType}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Cases per Player</span>
                                <span className="text-xs font-bold">{room.crateCount}x</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Entry Fee</span>
                                <span className="text-xs font-bold text-emerald-400">{formatRupiah(caseConfig?.cost * room.crateCount || 0)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Prize Pool (Est.)</span>
                                <span className="text-xs font-bold text-amber-400">{formatRupiah(caseConfig?.cost * room.crateCount * room.participants.length || 0)}</span>
                            </div>
                        </div>

                        {room.status === "waiting" && (
                            <div className="pt-4 space-y-3">
                                {isParticipant ? (
                                    <button
                                        onClick={handleToggleReady}
                                        className={cn(
                                            "w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl",
                                            room.participants.find(p => p.id === currentUser.id)?.ready
                                                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                                : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
                                        )}
                                    >
                                        {room.participants.find(p => p.id === currentUser.id)?.ready ? "I'm Ready!" : "Mark as Ready"}
                                    </button>
                                ) : room.participants.length < room.maxPlayers && (
                                    <button
                                        onClick={handleJoin}
                                        className="w-full py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-red-500/20 hover:scale-[1.02] transition-all"
                                    >
                                        Join Battle
                                    </button>
                                )}

                                {canStart && (
                                    <button
                                        onClick={handleStartBattle}
                                        disabled={isStarting}
                                        className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase text-xs tracking-widest shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        {isStarting ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
                                        Start Battle
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Activity Box */}
                    <div className="glass-card rounded-[32px] p-6 border-white/5">
                        <div className="flex items-center gap-2 mb-4">
                            <History size={16} className="text-muted-foreground" />
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">GOSIP TERKINI</h4>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="text-[10px] font-bold text-muted-foreground/50 text-center py-4">Habitat judi dibuat oleh {room.hostName}</div>
                            {room.participants.map(p => (
                                <div key={p.id} className="flex items-center gap-2 text-[10px] font-bold">
                                    <span className="text-white">{p.name}</span>
                                    <span className="text-muted-foreground">masuk ke kandang</span>
                                </div>
                            ))}
                            {room.status === "running" && (
                                <div className="text-[10px] font-bold text-red-500/50 text-center py-4 italic">BATTLE DIMULAI, SIAP-SIAP MISKIN!</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className={cn(
                    "absolute top-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-all duration-1000",
                    room.status === "running" ? "bg-red-500/10" : "bg-primary/5"
                )} />
                <div className={cn(
                    "absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-all duration-1000",
                    room.status === "finished" ? "bg-amber-500/10" : "bg-indigo-500/5"
                )} />
            </div>
        </div>
    );
};
