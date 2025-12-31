"use client";

import { useState } from "react";
import { Search, User, Wallet, Landmark, Package, RefreshCw, Trash2, RotateCcw, Save, Loader2 } from "lucide-react";
import { searchUsers, getUserById, updateUserBalance, updateUserPity, clearUserSkins, resetUserData, UserData } from "@/app/actions/users";
import { useToast } from "@/components/ui/Toast";

export default function UserManagementClient({ guildId }: { guildId: string }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserData[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const [editWallet, setEditWallet] = useState(0);
    const [editBank, setEditBank] = useState(0);
    const [editPity, setEditPity] = useState(0);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
    };

    const handleSelectUser = async (userId: string) => {
        const user = await getUserById(userId);
        if (user) {
            setSelectedUser(user);
            setEditWallet(user.wallet);
            setEditBank(user.bank);
            setEditPity(user.scPity);
        }
    };

    const handleSaveBalance = async () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const result = await updateUserBalance(selectedUser.id, editWallet, editBank);
        if (result.success) {
            toast("Balance updated!", "success");
            await handleSelectUser(selectedUser.id);
        } else {
            toast(result.error || "Failed to update", "error");
        }
        setIsSaving(false);
    };

    const handleSavePity = async () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const result = await updateUserPity(selectedUser.id, editPity);
        if (result.success) {
            toast("Pity updated!", "success");
            await handleSelectUser(selectedUser.id);
        } else {
            toast(result.error || "Failed to update", "error");
        }
        setIsSaving(false);
    };

    const handleClearSkins = async () => {
        if (!selectedUser) return;
        if (!confirm("Yakin mau hapus semua skins user ini?")) return;
        setIsSaving(true);
        const result = await clearUserSkins(selectedUser.id);
        if (result.success) {
            toast("Skins cleared!", "success");
            await handleSelectUser(selectedUser.id);
        } else {
            toast(result.error || "Failed to clear", "error");
        }
        setIsSaving(false);
    };

    const handleResetUser = async () => {
        if (!selectedUser) return;
        if (!confirm("YAKIN MAU RESET SEMUA DATA USER INI? Ini ga bisa di-undo!")) return;
        setIsSaving(true);
        const result = await resetUserData(selectedUser.id);
        if (result.success) {
            toast("User reset!", "success");
            await handleSelectUser(selectedUser.id);
        } else {
            toast(result.error || "Failed to reset", "error");
        }
        setIsSaving(false);
    };

    const skinCount = selectedUser?.inventory?.csSkins?.length || 0;
    const itemCount = Object.keys(selectedUser?.inventory || {}).filter(k => k !== "csSkins").length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Search Panel */}
            <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                <h3 className="font-black uppercase text-sm tracking-widest text-muted-foreground">Search User</h3>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="User ID atau nama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-primary"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="px-4 py-2 bg-primary rounded-xl font-bold text-sm disabled:opacity-50"
                    >
                        {isSearching ? <Loader2 className="animate-spin" size={16} /> : "Cari"}
                    </button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {searchResults.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleSelectUser(user.id)}
                            className={`w-full p-3 rounded-xl text-left transition-all ${selectedUser?.id === user.id
                                ? "bg-primary/20 border border-primary/40"
                                : "bg-white/5 border border-white/5 hover:bg-white/10"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                                    <User size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{user.name || "Unknown"}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono">{user.id}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                    {searchResults.length === 0 && searchQuery && !isSearching && (
                        <p className="text-center text-muted-foreground text-sm py-8">No users found</p>
                    )}
                </div>
            </div>

            {/* User Editor Panel */}
            <div className="lg:col-span-2 space-y-6">
                {selectedUser ? (
                    <>
                        {/* User Info Header */}
                        <div className="glass-card p-6 rounded-3xl border-white/5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                                        <User size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black">{selectedUser.name || "Unknown User"}</h2>
                                        <p className="text-xs text-muted-foreground font-mono">{selectedUser.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleSelectUser(selectedUser.id)}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                    title="Refresh"
                                >
                                    <RefreshCw size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Balance Editor */}
                        <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                            <h3 className="font-black uppercase text-sm tracking-widest text-muted-foreground flex items-center gap-2">
                                <Wallet size={14} /> Balance
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Wallet</label>
                                    <input
                                        type="number"
                                        value={editWallet}
                                        onChange={(e) => setEditWallet(parseInt(e.target.value) || 0)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm font-mono font-bold focus:outline-none focus:border-primary mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Bank</label>
                                    <input
                                        type="number"
                                        value={editBank}
                                        onChange={(e) => setEditBank(parseInt(e.target.value) || 0)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm font-mono font-bold focus:outline-none focus:border-primary mt-1"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSaveBalance}
                                disabled={isSaving}
                                className="px-6 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                Save Balance
                            </button>
                        </div>

                        {/* Pity Editor */}
                        <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                            <h3 className="font-black uppercase text-sm tracking-widest text-muted-foreground flex items-center gap-2">
                                <Landmark size={14} /> Gacha Pity
                            </h3>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Pity Counter</label>
                                    <input
                                        type="number"
                                        value={editPity}
                                        onChange={(e) => setEditPity(parseInt(e.target.value) || 0)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm font-mono font-bold focus:outline-none focus:border-primary mt-1"
                                    />
                                </div>
                                <button
                                    onClick={handleSavePity}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                    Save
                                </button>
                            </div>
                        </div>

                        {/* Inventory Stats */}
                        <div className="glass-card p-6 rounded-3xl border-white/5 space-y-4">
                            <h3 className="font-black uppercase text-sm tracking-widest text-muted-foreground flex items-center gap-2">
                                <Package size={14} /> Inventory
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">CS Skins</p>
                                    <p className="text-2xl font-black">{skinCount}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl">
                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Items</p>
                                    <p className="text-2xl font-black">{itemCount}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClearSkins}
                                disabled={isSaving}
                                className="px-6 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
                                Clear All Skins
                            </button>
                        </div>

                        {/* Danger Zone */}
                        <div className="glass-card p-6 rounded-3xl border-red-500/20 bg-red-500/5 space-y-4">
                            <h3 className="font-black uppercase text-sm tracking-widest text-red-400">Danger Zone</h3>
                            <p className="text-xs text-muted-foreground">Reset semua data user ke default. Wallet = 100k, Bank = 0, Inventory = kosong.</p>
                            <button
                                onClick={handleResetUser}
                                disabled={isSaving}
                                className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <RotateCcw size={14} />}
                                Reset User Data
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="glass-card p-12 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center">
                        <User size={48} className="text-muted-foreground opacity-20 mb-4" />
                        <p className="text-muted-foreground font-medium">Pilih user dari hasil search untuk mulai edit.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
