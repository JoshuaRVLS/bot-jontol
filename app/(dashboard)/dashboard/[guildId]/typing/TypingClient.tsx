"use client";

import { useState, useEffect, useRef, memo, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import {
    Keyboard, Users, Zap,
    Play, CheckCircle2,
    Flag, Plus
} from "lucide-react";
import {
    getTypingRoomsAction,
    createTypingRoomAction,
    joinTypingRoomAction,
    toggleTypingReadyAction,
    startTypingRaceAction,
    finishTypingRaceAction,
    leaveTypingRoomAction
} from "@/app/actions/typing";
import { formatRupiah, parseBet } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

// Optimized Sub-components
const ParticipantRow = memo(({ p, userId }: { p: Participant, userId: string }) => (
    <div className="space-y-1">
        <div className="flex justify-between items-end px-2">
            <div className="flex items-center gap-2">
                <div className={cn(
                    "w-2 h-2 rounded-full",
                    p.ready ? (p.finished ? "bg-green-400 shadow-[0_0_10px_#4ade80]" : "bg-blue-400") : "bg-white/20"
                )} />
                <span className="text-sm font-bold truncate max-w-[120px]">{p.name} {p.id === userId && <span className="text-[10px] text-white/40">(LU)</span>}</span>
            </div>
            <span className="text-[10px] font-mono text-white/60">{p.wpm} WPM</span>
        </div>
        <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div
                className={cn(
                    "h-full rounded-full transition-colors",
                    p.id === userId ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-white/20"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${p.progress}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
        </div>
    </div>
));
ParticipantRow.displayName = "ParticipantRow";

const TargetTextDisplay = memo(({ targetText, typedText }: { targetText: string, typedText: string }) => {
    const chars = targetText.split("");
    return (
        <div className="text-xl sm:text-2xl font-medium leading-relaxed tracking-tight text-white/80 font-mono">
            {chars.map((char, i) => {
                let color = "text-white/30";
                if (i < typedText.length) {
                    color = typedText[i] === char ? "text-green-400 drop-shadow-[0_0_8px_#4ade80]" : "text-red-400 bg-red-400/20 rounded-sm";
                }
                return <span key={i} className={cn(color, "transition-colors duration-150")}>{char}</span>;
            })}
        </div>
    );
});
TargetTextDisplay.displayName = "TargetTextDisplay";

// Socket URL - adjust if needed
const SOCKET_URL = "http://localhost:8000";

interface Participant {
    id: string;
    name: string;
    avatar?: string;
    ready: boolean;
    progress: number;
    wpm: number;
    finished?: boolean;
    finishTime?: number;
}

export default function TypingClient({ guildId, userId, userName, initialWallet }: any) {
    const { toast } = useToast();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [wallet, setWallet] = useState(initialWallet);
    const [rooms, setRooms] = useState<any[]>([]);
    const [activeRoom, setActiveRoom] = useState<any>(null);
    const [, setLoading] = useState(false);
    const [customBet, setCustomBet] = useState(10000);
    const [customBetInput, setCustomBetInput] = useState("10000");

    useEffect(() => {
        setCustomBetInput(customBet.toString());
    }, [customBet]);

    const handleCustomBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCustomBetInput(val);
        const parsed = parseBet(val);
        if (parsed > 0) setCustomBet(parsed);
    };

    // Game State
    const [typedText, setTypedText] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // Initial load and socket setup
    useEffect(() => {
        const s = io(SOCKET_URL);
        setSocket(s);

        const loadRooms = async () => {
            const res = await getTypingRoomsAction(guildId);
            if (res.success) setRooms(res.rooms);
        };
        loadRooms();

        s.on("typing_room_list_add", (room: any) => setRooms((prev: any[]) => [room, ...prev]));
        s.on("typing_room_list_update", (room: any) => setRooms((prev: any[]) => prev.map(r => r.id === room.id ? room : r)));
        s.on("typing_room_list_remove", (roomId: string) => setRooms((prev: any[]) => prev.filter(r => r.id !== roomId)));

        return () => { s.disconnect(); };
    }, [guildId]);

    const startCountdown = () => {
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown((prev: number | null) => {
                if (prev === 1) {
                    clearInterval(timer);
                    setStartTime(Date.now());
                    setTimeout(() => inputRef.current?.focus(), 10);
                    return null;
                }
                return prev ? prev - 1 : null;
            });
        }, 1000);
    };

    // Active room updates
    useEffect(() => {
        if (!socket || !activeRoom) return;

        socket.on("typing_room_update", (updatedRoom: any) => {
            setActiveRoom(updatedRoom);
            if (updatedRoom.status === "running" && updatedRoom.targetText && !startTime && !countdown) {
                startCountdown();
            }
        });

        socket.on("player_progress", (data: { userId: string, progress: number, wpm: number }) => {
            setActiveRoom((prev: any) => {
                if (!prev) return null;
                const participants = (prev.participants as Participant[]).map((p: Participant) =>
                    p.id === data.userId ? { ...p, progress: data.progress, wpm: data.wpm } : p
                );
                return { ...prev, participants };
            });
        });

        socket.on("player_finished", (data: { userId: string, wpm: number }) => {
            setActiveRoom((prev: any) => {
                if (!prev) return null;
                const participants = (prev.participants as Participant[]).map((p: Participant) =>
                    p.id === data.userId ? { ...p, finished: true, wpm: data.wpm } : p
                );
                return { ...prev, participants };
            });
            if (data.userId === userId) setIsFinished(true);
        });

        return () => {
            socket.off("typing_room_update");
            socket.off("player_progress");
            socket.off("player_finished");
        };
    }, [socket, activeRoom, startTime, countdown, userId]);

    // Countdown Logic removed from here as it was moved up to follow hoisting rules

    const handleCreateRoom = async (betAmount: number) => {
        if (wallet < betAmount) return toast("Saldo gak cukup!", "error");
        setLoading(true);
        const res = await createTypingRoomAction({ guildId, bet: betAmount, isPrivate: false });
        if (res.success) {
            setActiveRoom(res.room);
            setWallet((prev: number) => prev - betAmount);
            socket?.emit("join_room", { roomId: res.room.id, userId, userName });
            socket?.emit("typing_room_created", res.room);
        } else {
            toast(res.error || "Gagal bikin room", "error");
        }
        setLoading(false);
    };

    const handleJoinRoom = async (room: any) => {
        if (wallet < room.bet) return toast("Saldo gak cukup!", "error");
        setLoading(true);
        const res = await joinTypingRoomAction(room.id);
        if (res.success) {
            setActiveRoom(res.room);
            setWallet((prev: number) => prev - room.bet);
            socket?.emit("join_room", { roomId: res.room.id, userId, userName });
            socket?.emit("typing_room_updated", res.room);
        } else {
            toast(res.error || "Gagal join room", "error");
        }
        setLoading(false);
    };

    const handleToggleReady = async () => {
        const res = await toggleTypingReadyAction(activeRoom.id);
        if (res.success) {
            setActiveRoom(res.room);
            socket?.emit("typing_room_updated", res.room);
        }
    };

    const handleStartGame = async () => {
        const res = await startTypingRaceAction(activeRoom.id);
        if (res.success) {
            setActiveRoom(res.room);
            socket?.emit("typing_room_updated", res.room);
        } else {
            toast(res.error || "Gagal start game", "error");
        }
    };

    const handleFinished = useCallback(async (finalWpm: number) => {
        setIsFinished(true);
        socket?.emit("typing_finished", { roomId: activeRoom?.id, userId, wpm: finalWpm });

        if (activeRoom?.status === "running") {
            const res = await finishTypingRaceAction(activeRoom.id, userId);
            if (res.success && typeof res.prize === 'number') {
                toast(`SLOT RACE WIN! +${formatRupiah(res.prize)}`, "success");
                setWallet((prev: number) => prev + (res.prize as number));
            }
        }
    }, [socket, activeRoom, userId, toast]);

    const handleTyping = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!startTime || isFinished || !activeRoom?.targetText) return;
        const val = e.target.value;
        const target = activeRoom.targetText;

        // Progress calculation
        let progressCount = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] === target[i]) progressCount++;
            else break;
        }

        const progressPercent = (progressCount / target.length) * 100;

        // WPM calculation - use performance.now() relative to startTime
        const currentTime = performance.now();
        const timeElapsed = (currentTime - (startTime || currentTime)) / 60000;
        const currentWpm = timeElapsed > 0 ? Math.round((val.split(" ").length) / timeElapsed) : 0;

        setTypedText(val);
        setWpm(currentWpm);

        socket?.emit("typing_progress", {
            roomId: activeRoom.id,
            userId,
            progress: progressPercent,
            wpm: currentWpm
        });

        if (val === target) {
            handleFinished(currentWpm);
        }
    }, [startTime, isFinished, activeRoom, socket, userId, handleFinished]);

    const handleLeave = async () => {
        if (!activeRoom) return;
        const res = await leaveTypingRoomAction(activeRoom.id);
        if (res.success) {
            if (res.action === "deleted") {
                socket?.emit("typing_room_removed", activeRoom.id);
            } else {
                socket?.emit("typing_room_updated", res.room);
            }
            setActiveRoom(null);
            setIsFinished(false);
            setTypedText("");
            setStartTime(null);
            setWpm(0);
        }
    };

    if (activeRoom) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 max-w-5xl mx-auto w-full">
                <div className="w-full flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                            <Keyboard size={24} />
                        </div>
                        <div>
                            <h2 className="font-black italic text-xl tracking-tighter">TYPING RACE #{activeRoom.roomCode}</h2>
                            <p className="text-xs text-white/40 font-mono">POOL: {formatRupiah(activeRoom.bet * activeRoom.participants.length)}</p>
                        </div>
                    </div>
                    <button onClick={handleLeave} className="px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">LEAVE ROOM</button>
                </div>

                <div className="w-full bg-black/40 border border-white/10 rounded-3xl p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 pointer-events-none" />

                    <div className="grid gap-4 relative z-10">
                        {activeRoom.participants.map((p: Participant) => (
                            <ParticipantRow key={p.id} p={p} userId={userId} />
                        ))}
                    </div>

                    <AnimatePresence>
                        {countdown && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 2 }}
                                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl"
                            >
                                <span className="text-8xl font-black italic text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">{countdown}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {activeRoom.status === "running" && activeRoom.targetText && (
                    <div className="w-full space-y-6">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl relative group">
                            <div className="absolute -top-4 left-6 px-3 py-1 bg-purple-500 rounded-lg text-[10px] font-black italic tracking-widest text-white">TARGET TEXT</div>
                            <TargetTextDisplay targetText={activeRoom.targetText} typedText={typedText} />
                        </div>

                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={typedText}
                                onChange={handleTyping}
                                disabled={isFinished || !startTime}
                                spellCheck={false}
                                autoComplete="off"
                                placeholder={isFinished ? "RACE FINISHED!" : "Type the text above as fast as you can..."}
                                className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-xl font-mono focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-white/20 disabled:opacity-50"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <Zap className="text-yellow-400 w-4 h-4 animate-pulse" />
                                <span className="text-2xl font-black italic text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]">{wpm}</span>
                                <span className="text-[10px] font-bold text-white/40 uppercase">WPM</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeRoom.status === "waiting" && (
                    <div className="w-full grid sm:grid-cols-2 gap-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-4 text-center">
                            <Users className="text-purple-400 w-12 h-12" />
                            <div>
                                <h3 className="font-bold text-lg">Waiting for Players</h3>
                                <p className="text-xs text-white/40">Need at least 2 players to start the race.</p>
                            </div>
                            <div className="flex gap-2">
                                {activeRoom.participants.map((p: any) => (
                                    <div key={p.id} className="relative">
                                        <img src={p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`} className="w-10 h-10 rounded-full border-2 border-white/10" alt={`Avatar of ${p.name}`} />
                                        {p.ready && <CheckCircle2 className="absolute -bottom-1 -right-1 w-4 h-4 text-green-400 bg-[#0F0F13] rounded-full" />}
                                    </div>
                                ))}
                                {Array.from({ length: 4 - activeRoom.participants.length }).map((_, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-white/10">
                                        <Plus size={16} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleToggleReady}
                                className={cn(
                                    "w-full py-4 rounded-2xl font-black italic tracking-widest transition-all",
                                    activeRoom.participants.find((p: any) => p.id === userId)?.ready
                                        ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30"
                                        : "bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105 active:scale-95"
                                )}
                            >
                                {activeRoom.participants.find((p: any) => p.id === userId)?.ready ? "NOT READY" : "READY TO RACE"}
                            </button>

                            {activeRoom.hostId === userId && (
                                <button
                                    onClick={handleStartGame}
                                    disabled={activeRoom.participants.length < 2 || !activeRoom.participants.every((p: any) => p.ready)}
                                    className="w-full py-4 rounded-2xl bg-purple-500 font-black italic tracking-widest text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Play size={20} /> START RACE
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto w-full p-6 space-y-12">
            <div className="text-center space-y-4">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
                    <Zap size={16} className="animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Live Multiplayer</span>
                </motion.div>
                <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                    TYPING <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">RACE</span>
                </h1>
                <p className="max-w-xl mx-auto text-white/40 font-medium">Test your velocity. Compete with others in a high-stakes typing battle and win the pool prize!</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Flag className="text-purple-400 w-5 h-5" />
                            <h2 className="font-bold text-xl uppercase tracking-tighter italic">Active Rooms</h2>
                        </div>
                        <span className="text-xs font-mono text-white/20">{rooms.length} AVAILABLE</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {rooms.map(room => (
                            <div key={room.id} className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:border-purple-500/50 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black italic text-purple-400 uppercase">Room Code</span>
                                        <span className="font-black italic text-xl tracking-tighter group-hover:text-purple-400 transition-colors">#{room.roomCode}</span>
                                    </div>
                                    <div className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest">
                                        {formatRupiah(room.bet)}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {room.participants.map((p: any) => (
                                            <img key={p.id} src={p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.id}`} className="w-8 h-8 rounded-full border-2 border-[#0F0F13]" alt={p.name || "Participant"} />
                                        ))}
                                        {Array.from({ length: 4 - room.participants.length }).map((_, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-dashed border-white/5 flex items-center justify-center text-white/5 bg-transparent" />
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleJoinRoom(room)}
                                        disabled={room.participants.length >= 4 || room.status !== "waiting"}
                                        className="px-6 py-2 bg-white text-black rounded-xl text-xs font-black italic tracking-widest hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-30"
                                    >
                                        JOIN
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {rooms.length === 0 && (
                        <div className="h-64 flex flex-col items-center justify-center bg-white/5 rounded-3xl border border-dashed border-white/10 text-white/20">
                            <Keyboard size={48} className="mb-4 opacity-20" />
                            <p className="font-bold italic">No active rooms found</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-[32px] p-6 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl -z-10" />
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black italic tracking-tighter">HOST A RACE</h3>
                            <p className="text-xs text-white/40">Set your bet and invite challengers.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 pl-2">Custom Bet Amount</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={customBetInput}
                                        onChange={handleCustomBetChange}
                                        onBlur={() => setCustomBetInput(customBet.toString())}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-2xl font-black text-yellow-400 italic outline-none focus:border-purple-500/50 transition-all focus:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        onClick={() => setCustomBet(prev => prev + 500000)}
                                        className="py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-[10px] font-black text-emerald-400 transition-all border border-emerald-500/10 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={12} /> 500K
                                    </button>
                                    <button
                                        onClick={() => setCustomBet(prev => prev + 1000000)}
                                        className="py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-[10px] font-black text-amber-400 transition-all border border-amber-500/10 flex items-center justify-center gap-2"
                                    >
                                        <Plus size={12} /> 1JT
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => handleCreateRoom(customBet)}
                                className="w-full py-4 bg-white text-black rounded-2xl font-black italic tracking-widest text-lg hover:bg-yellow-400 transition-all flex items-center justify-center gap-2 group"
                            >
                                <Play size={20} className="fill-current" />
                                BIARKAN BALAPAN DIMULAI
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
