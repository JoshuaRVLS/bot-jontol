"use client";

import { useState } from "react";
import { Search, RotateCcw, ShieldAlert, Loader2, User as UserIcon, Wallet, Package, Zap, TrendingUp, Sparkles, Globe, AlertTriangle } from "lucide-react";
import { searchUsers, UserData } from "@/app/actions/users";
import { resetUserDataAction, resetGlobalDataAction } from "@/app/actions/developer";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type ResetMode = "individual" | "global";

export default function ResetDataClient({ guildId }: { guildId: string }) {
    const [mode, setMode] = useState<ResetMode>("individual");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserData[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const { toast } = useToast();

    // Global reset confirmation state
    const [globalConfirmText, setGlobalConfirmText] = useState("");
    const CONFIRM_TEXT = "RESET SEMUA DATA";

    const categories = [
        { id: "economy", label: "Economy", icon: Wallet, description: "Reset balance ke default (100k) & bank ke 0" },
        { id: "inventory", label: "Inventory", icon: Package, description: "Hapus semua item & skin di inventory" },
        { id: "leveling", label: "Leveling", icon: TrendingUp, description: "Reset level ke 1 & XP ke 0" },
        { id: "investments", label: "Investments", icon: Zap, description: "Hapus semua data investasi" },
        { id: "pity", label: "Pity", icon: Sparkles, description: "Reset gacha pity ke 0" },
    ];

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
    };

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleReset = async () => {
        if (selectedCategories.length === 0) return;

        if (mode === "individual") {
            if (!selectedUser) return;
            const confirmMsg = `YAKIN MAU RESET ${selectedCategories.length} KATEGORI DATA BUAT ${selectedUser.name || selectedUser.id}?\n\nIni ga bisa di-undo bang!`;
            if (!confirm(confirmMsg)) return;

            setIsResetting(true);
            const result = await resetUserDataAction(selectedUser.id, selectedCategories);
            if (result.success) {
                toast("Data berhasil direset!", "success");
                setSelectedCategories([]);
            } else {
                toast(result.error || "Gagal reset data", "error");
            }
            setIsResetting(false);
        } else {
            // Global Reset
            if (globalConfirmText !== CONFIRM_TEXT) {
                toast("Ketik konfirmasi dulu bang!", "error");
                return;
            }

            const confirmMsg = `PERINGATAN KERAS!!!\n\nAbang mau reset data ${selectedCategories.join(", ")} buat SEMUA USER di database.\n\nLanjut abis ngetik ini?`;
            if (!confirm(confirmMsg)) return;

            setIsResetting(true);
            const result = await resetGlobalDataAction(selectedCategories);
            if (result.success) {
                toast("DATA GLOBAL BERHASIL DIRESET!", "success");
                setSelectedCategories([]);
                setGlobalConfirmText("");
            } else {
                toast(result.error || "Gagal reset data global", "error");
            }
            setIsResetting(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Mode Switcher */}
            <div className="flex bg-white/5 p-1 rounded-2xl w-fit mx-auto border border-white/5">
                <button
                    onClick={() => setMode("individual")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        mode === "individual" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                    )}
                >
                    <UserIcon size={16} />
                    Reset Individu
                </button>
                <button
                    onClick={() => setMode("global")}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        mode === "global" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "text-muted-foreground hover:text-white"
                    )}
                >
                    <Globe size={16} />
                    Reset Global
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Target Selection */}
                <div className="space-y-6">
                    {mode === "individual" ? (
                        <div className="glass-card p-8 rounded-[40px] border-white/5 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                                    <Search size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Cari User</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Temukan target individu</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="ID User atau Nama..."
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="bg-primary hover:bg-primary/80 text-white px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSearching ? <Loader2 className="animate-spin" /> : <Search size={20} />}
                                </button>
                            </div>

                            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                                {searchResults.map((user) => (
                                    <button
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                                            selectedUser?.id === user.id
                                                ? "bg-primary/20 border-primary/50"
                                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                        )}
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                <UserIcon size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black truncate">{user.name || "Anonymous"}</p>
                                                <p className="text-[10px] font-mono opacity-50 truncate">{user.id}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                                {searchResults.length === 0 && !isSearching && searchQuery && (
                                    <p className="text-center py-10 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-30">User gak ketemu bang</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card p-10 rounded-[48px] border-red-500/30 bg-red-500/5 space-y-8 relative overflow-hidden h-full flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none" />
                            <div className="relative z-10 space-y-6 text-center">
                                <AlertTriangle size={64} className="mx-auto text-red-500 animate-bounce" />
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-red-500">GLOBAL RESET ACTIVE</h3>
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                                        Abang lagi ada di mode <span className="text-red-500">Hazard</span>. Semua tindakan reset bakal ngefek ke SEMUA user di database.
                                    </p>
                                </div>

                                <div className="space-y-4 pt-8">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400">Ketik konfirmasi di bawah buat aktivasi tombol:</p>
                                    <input
                                        type="text"
                                        placeholder={`Ketik "${CONFIRM_TEXT}"`}
                                        className="w-full bg-red-500/10 border border-red-500/30 rounded-2xl px-6 py-5 text-center text-sm font-bold text-red-500 focus:outline-none focus:border-red-500 transition-all placeholder:text-red-900/50"
                                        value={globalConfirmText}
                                        onChange={(e) => setGlobalConfirmText(e.target.value)}
                                    />
                                    {globalConfirmText === CONFIRM_TEXT && (
                                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                            Konfirmasi terverifikasi bang ✓
                                        </motion.p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel: Category Selection & Execution */}
                <AnimatePresence mode="wait">
                    {(selectedUser || mode === "global") ? (
                        <motion.div
                            key={mode === "individual" ? selectedUser?.id : "global"}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            <div className={cn(
                                "glass-card p-8 rounded-[40px] space-y-8 relative overflow-hidden",
                                mode === "global" ? "border-red-500/50 bg-red-950/20" : "border-red-500/20 bg-red-500/5"
                            )}>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] pointer-events-none" />

                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-red-500 rounded-2xl text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                            <RotateCcw size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black uppercase italic tracking-tighter">RESET CATEGORIES</h3>
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mt-1">
                                                Target: {mode === "global" ? "SEMUA USER" : (selectedUser?.name || selectedUser?.id)}
                                            </p>
                                        </div>
                                    </div>
                                    {mode === "individual" && (
                                        <button
                                            onClick={() => setSelectedUser(null)}
                                            className="text-muted-foreground hover:text-white transition-colors text-[10px] font-black"
                                        >
                                            BATAL
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-4 relative z-10">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon;
                                        const isSelected = selectedCategories.includes(cat.id);
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                className={cn(
                                                    "flex items-center gap-4 p-5 rounded-3xl border transition-all text-left group",
                                                    isSelected
                                                        ? "bg-red-500/20 border-red-500/50"
                                                        : "bg-black/20 border-white/5 hover:border-white/20"
                                                )}
                                            >
                                                <div className={cn(
                                                    "p-3 rounded-2xl transition-all",
                                                    isSelected ? "bg-red-500 text-white" : "bg-white/5 text-muted-foreground group-hover:text-white"
                                                )}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-black uppercase italic">{cat.label}</p>
                                                    <p className="text-[10px] text-muted-foreground font-medium">{cat.description}</p>
                                                </div>
                                                <div className={cn(
                                                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                    isSelected ? "bg-red-500 border-red-500" : "border-white/10"
                                                )}>
                                                    {isSelected && <AnimatePresence><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-full" /></AnimatePresence>}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={handleReset}
                                    disabled={selectedCategories.length === 0 || isResetting || (mode === "global" && globalConfirmText !== CONFIRM_TEXT)}
                                    className={cn(
                                        "w-full py-6 rounded-[24px] text-xs font-black uppercase tracking-[0.3em] transition-all relative overflow-hidden group shadow-2xl disabled:grayscale",
                                        selectedCategories.length > 0
                                            ? "bg-red-500 text-white hover:scale-[1.02] active:scale-95 shadow-red-500/20"
                                            : "bg-white/5 text-muted-foreground cursor-not-allowed"
                                    )}
                                >
                                    {isResetting ? (
                                        <Loader2 className="animate-spin mx-auto" />
                                    ) : (
                                        <span className="flex items-center justify-center gap-3">
                                            <RotateCcw size={16} />
                                            {mode === "global" ? "EKSEKUSI RESET GLOBAL !!!" : "EKSEKUSI RESET DATA"}
                                        </span>
                                    )}
                                    {selectedCategories.length > 0 && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center glass-card rounded-[40px] border-white/5 opacity-50 grayscale p-12 text-center"
                        >
                            <ShieldAlert size={64} className="mb-6 opacity-20" />
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Pilih User</h3>
                            <p className="text-sm font-medium text-muted-foreground max-w-[250px]">
                                Cari dan pilih user buat ngatur reset datanya di sini bang.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
