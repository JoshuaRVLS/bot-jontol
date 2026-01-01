"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Plus,
    Users,
    Lock,
    Globe,
    Loader2,
    Swords,
    Trophy,
    Eye,
    X,
    Zap
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "@/components/SocketProvider";
import { createBattleRoomAction } from "@/app/actions/battle";
import { CASE_CONFIGS, CaseType } from "@/lib/csgo";
import { cn } from "@/lib/utils";

interface BattleRoom {
    id: string;
    roomCode: string;
    hostId: string;
    hostName: string;
    hostAvatar?: string;
    caseType: string;
    crateCount: number;
    maxPlayers: number;
    isPrivate: boolean;
    status: string;
    participants: { id: string; name: string; avatar?: string; ready: boolean }[];
    createdAt: string;
}

interface BattleLobbyProps {
    guildId: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    userWallet: number;
    initialRooms: BattleRoom[];
}

const CASE_OPTIONS: { id: CaseType; label: string; color: string }[] = [
    { id: "elite", label: "Special (500K)", color: "bg-red-500" },
    { id: "sultan", label: "Omega (2JT)", color: "bg-amber-500" },
    { id: "godtier", label: "Divine (5Miliar)", color: "bg-indigo-500" },
];

export const BattleLobby = ({
    guildId,
    userWallet,
    initialRooms
}: BattleLobbyProps) => {
    const [rooms, setRooms] = useState<BattleRoom[]>(initialRooms);
    const { toast } = useToast();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newRoom, setNewRoom] = useState({
        caseType: "elite" as CaseType,
        crateCount: 1,
        maxPlayers: 2,
        isPrivate: false,
        crazyMode: false,
        isTeamMode: false
    });
    const { socket, isConnected } = useSocket();
    const router = useRouter();

    useEffect(() => {
        if (!socket) return;

        socket.emit("get_rooms", guildId);

        socket.on("room_list", (data: BattleRoom[]) => {
            setRooms(data);
        });

        socket.on("room_list_update", (data: { action: string; room?: BattleRoom; roomId?: string }) => {
            if (data.action === "add" && data.room) {
                setRooms(prev => [data.room!, ...prev]);
            } else if (data.action === "update" && data.room) {
                setRooms(prev => prev.map(r => r.id === data.room!.id ? data.room! : r));
            } else if (data.action === "remove" && data.roomId) {
                setRooms(prev => prev.filter(r => r.id !== data.roomId));
            }
        });

        return () => {
            socket.off("room_list");
            socket.off("room_list_update");
        };
    }, [socket, guildId]);

    const handleCreateRoom = async () => {
        const caseConfig = CASE_CONFIGS[newRoom.caseType];
        const totalCost = caseConfig.cost * newRoom.crateCount;

        if (userWallet < totalCost) {
            toast(`Saldo tidak mencukupi! Butuh Rp ${totalCost.toLocaleString()}`, "error");
            return;
        }

        setIsCreating(true);
        const res = await createBattleRoomAction({
            guildId,
            caseType: newRoom.caseType,
            crateCount: newRoom.crateCount,
            maxPlayers: newRoom.maxPlayers,
            isPrivate: newRoom.isPrivate,
            crazyMode: newRoom.crazyMode,
            isTeamMode: newRoom.isTeamMode
        });

        if (res.success && res.room) {
            socket?.emit("battle_room_created", res.room); // Notify everyone
            router.push(`/dashboard/${guildId}/battle/${res.room.id}`);
        } else {
            toast(res.error || "Gagal membuat ruangan!", "error");
        }
        setIsCreating(false);
        setIsCreateModalOpen(false);
    };

    const handleJoinRoom = (roomId: string) => {
        router.push(`/dashboard/${guildId}/battle/${roomId}`);
    };

    const totalCost = CASE_CONFIGS[newRoom.caseType]?.cost * newRoom.crateCount || 0;

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-3 h-3 rounded-full animate-pulse",
                        isConnected ? "bg-emerald-400" : "bg-red-500"
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {isConnected ? "LIVE" : "CONNECTING..."}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                        {rooms.length} Ruangan Aktif
                    </span>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-3 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-red-500/20 hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus size={18} />
                    BUAT RUANGAN
                </button>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                    {rooms.map((room) => {
                        const caseOption = CASE_OPTIONS.find(c => c.id === room.caseType);
                        return (
                            <motion.div
                                key={room.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, rotate: (room.id.charCodeAt(0) % 4) - 2 }}
                                animate={{ opacity: 1, scale: 1, rotate: (room.id.charCodeAt(1) % 2) - 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{
                                    scale: 1.05,
                                    rotate: 0,
                                    boxShadow: "0 0 40px rgba(239, 68, 68, 0.2)"
                                }}
                                className="glass-card rounded-[40px] border-white/5 overflow-hidden group hover:border-red-500/50 transition-all relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[40px] pointer-events-none" />
                                <div className={cn("h-2", caseOption?.color || "bg-gray-500")} />
                                <div className="p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {room.hostAvatar ? (
                                                <img src={room.hostAvatar} alt={room.hostName} className="w-10 h-10 rounded-xl object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs">
                                                    {room.hostName[0]}
                                                </div>
                                            )}
                                            <div>
                                                <h4 className="font-black uppercase text-sm leading-none">{room.hostName}</h4>
                                                <p className="text-[10px] font-bold text-muted-foreground mt-1">#{room.roomCode}</p>
                                            </div>
                                        </div>
                                        {room.isPrivate ? (
                                            <Lock size={16} className="text-amber-500" />
                                        ) : (
                                            <Globe size={16} className="text-emerald-500" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 text-xs font-bold">
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Zap size={12} />
                                            <span>{caseOption?.label.split(" ")[0]} {caseOption?.label.split(" ")[1]}</span>
                                        </div>
                                        <span className="text-white/20">|</span>
                                        <div className="flex items-center gap-1 text-muted-foreground">
                                            <Trophy size={12} />
                                            <span>{room.crateCount}x Cases</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <Users size={14} className="text-muted-foreground" />
                                            <span className="text-xs font-black">{room.participants.length}/{room.maxPlayers}</span>
                                        </div>
                                        <button
                                            onClick={() => handleJoinRoom(room.id)}
                                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase hover:bg-red-500 hover:border-red-500 transition-all flex items-center gap-2 group-hover:scale-105"
                                        >
                                            {room.participants.length >= room.maxPlayers ? (
                                                <>
                                                    <Eye size={14} />
                                                    Tonton
                                                </>
                                            ) : (
                                                <>
                                                    <Swords size={14} />
                                                    Join
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                {rooms.length === 0 && (
                    <div className="col-span-full text-center py-16 space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                            <Swords size={40} className="text-red-500 drop-shadow-glow" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-black uppercase italic text-3xl text-white tracking-tighter">ARENA KOSONG</h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">Belum ada tumbal yang siap bertarung...</p>
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-6 px-8 py-3 rounded-2xl bg-white/5 border border-white/10 font-black uppercase text-xs hover:bg-white/10 transition-all hover:scale-105"
                        >
                            TANTANG SEKARANG
                        </button>
                    </div>
                )}
            </div>

            {/* Create Room Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => !isCreating && setIsCreateModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 1.2, rotate: 10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            className="relative w-full max-w-lg glass-card rounded-[60px] border-white/10 p-10 overflow-y-auto max-h-[90vh] shadow-[0_0_100px_rgba(239,68,68,0.2)]"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center text-white rotate-6 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                                        <Swords size={28} />
                                    </div>
                                    <h3 className="font-black italic uppercase text-3xl tracking-tighter">BUAT RUANGAN</h3>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-3 rounded-full hover:bg-white/5 hover:text-red-500 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Case Type */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pilih Tipe Case</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {CASE_OPTIONS.map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => setNewRoom(prev => ({ ...prev, caseType: opt.id }))}
                                                className={cn(
                                                    "p-3 rounded-xl border text-left font-bold text-sm transition-all",
                                                    newRoom.caseType === opt.id
                                                        ? "border-red-500 bg-red-500/10"
                                                        : "border-white/10 bg-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-3 h-3 rounded-full", opt.color)} />
                                                    {opt.label}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Crate Count */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jumlah Case</label>
                                    <div className="flex gap-2">
                                        {[1, 3, 5, 10].map((n) => (
                                            <button
                                                key={n}
                                                onClick={() => setNewRoom(prev => ({ ...prev, crateCount: n }))}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl font-black text-sm transition-all",
                                                    newRoom.crateCount === n
                                                        ? "bg-red-500 text-white"
                                                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                {n}x
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Max Players */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Jumlah Player</label>
                                    <div className="flex gap-2">
                                        {[2, 3, 4].map((n) => (
                                            <button
                                                key={n}
                                                onClick={() => setNewRoom(prev => ({ ...prev, maxPlayers: n }))}
                                                className={cn(
                                                    "flex-1 py-3 rounded-xl font-black text-sm transition-all",
                                                    newRoom.maxPlayers === n
                                                        ? "bg-red-500 text-white"
                                                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                                                )}
                                            >
                                                {n} Players
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Private Toggle */}
                                <button
                                    onClick={() => setNewRoom(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                                    className={cn(
                                        "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                                        newRoom.isPrivate ? "border-amber-500 bg-amber-500/10" : "border-white/10 bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {newRoom.isPrivate ? <Lock size={18} className="text-amber-500" /> : <Globe size={18} className="text-emerald-500" />}
                                        <span className="font-bold text-sm">{newRoom.isPrivate ? "Private Room" : "Public Room"}</span>
                                    </div>
                                    <div className={cn(
                                        "w-10 h-6 rounded-full p-1 transition-all",
                                        newRoom.isPrivate ? "bg-amber-500" : "bg-white/20"
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 rounded-full bg-white transition-all",
                                            newRoom.isPrivate ? "translate-x-4" : "translate-x-0"
                                        )} />
                                    </div>
                                </button>

                                {/* Team Mode Toggle */}
                                <button
                                    onClick={() => {
                                        const nextVal = !newRoom.isTeamMode;
                                        setNewRoom(prev => ({
                                            ...prev,
                                            isTeamMode: nextVal,
                                            maxPlayers: nextVal ? 4 : prev.maxPlayers
                                        }));
                                    }}
                                    className={cn(
                                        "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                                        newRoom.isTeamMode ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "border-white/10 bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Users size={18} className={newRoom.isTeamMode ? "text-blue-500" : "text-muted-foreground"} />
                                        <div className="text-left">
                                            <span className="font-bold text-sm block">Team Mode (2vs2)</span>
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase text-blue-400">Battle CT vs T (Max 4 Players)</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "w-10 h-6 rounded-full p-1 transition-all",
                                        newRoom.isTeamMode ? "bg-blue-500" : "bg-white/20"
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 rounded-full bg-white transition-all",
                                            newRoom.isTeamMode ? "translate-x-4" : "translate-x-0"
                                        )} />
                                    </div>
                                </button>

                                {/* Crazy Mode Toggle */}
                                <button
                                    onClick={() => setNewRoom(prev => ({ ...prev, crazyMode: !prev.crazyMode }))}
                                    className={cn(
                                        "w-full p-4 rounded-xl border flex items-center justify-between transition-all",
                                        newRoom.crazyMode ? "border-red-500 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]" : "border-white/10 bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Zap size={18} className={newRoom.crazyMode ? "text-red-500 fill-red-500" : "text-muted-foreground"} />
                                        <div className="text-left">
                                            <span className="font-bold text-sm block">Crazy Mode</span>
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase text-red-400">Yang paling miskin/murah yang menang!</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "w-10 h-6 rounded-full p-1 transition-all",
                                        newRoom.crazyMode ? "bg-red-500" : "bg-white/20"
                                    )}>
                                        <div className={cn(
                                            "w-4 h-4 rounded-full bg-white transition-all",
                                            newRoom.crazyMode ? "translate-x-4" : "translate-x-0"
                                        )} />
                                    </div>
                                </button>

                                {/* Cost Summary */}
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-muted-foreground">Entry Fee</span>
                                        <span>Rp {totalCost.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-muted-foreground">Saldo Anda</span>
                                        <span className={userWallet < totalCost ? "text-red-400" : "text-emerald-400"}>
                                            Rp {userWallet.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCreateRoom}
                                    disabled={isCreating || userWallet < totalCost}
                                    className="w-full py-5 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isCreating ? <Loader2 className="animate-spin mx-auto" /> : "BUAT PERTEMPURAN"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
