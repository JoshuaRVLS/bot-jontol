"use client";

import { useState, useEffect } from "react";
import { Search, User, Save, RefreshCcw, Sliders, Info } from "lucide-react";
import { searchUsersAction, getUserGachaConfig, updateUserGachaConfig } from "@/app/actions/gacha";
import { CaseType, CASE_CONFIGS } from "@/lib/csgo";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";

const RARITY_COLORS: Record<string, string> = {
    "consumer": "#b0c3d9",
    "industrial": "#5e98d9",
    "mil-spec": "#4b69ff",
    "restricted": "#8847ff",
    "classified": "#d32ce6",
    "covert": "#eb4b4b",
    "extraordinary": "#ffd700",
    "rare special": "#ffd700",
};

export const UserGachaEditor = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [foundUsers, setFoundUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [config, setConfig] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);
    const [activeCase, setActiveCase] = useState<CaseType>("elite");
    const { toast } = useToast();

    const handleSearch = async () => {
        if (!searchQuery) return;
        const res = await searchUsersAction(searchQuery);
        if (res.success) {
            setFoundUsers(res.users || []);
        }
    };

    const handleSelectUser = async (user: any) => {
        setSelectedUser(user);
        const res = await getUserGachaConfig(user.id);
        if (res.success) {
            const userConfig = res.config ?? {};
            const newConfig: Record<string, Record<string, number>> = { ...(userConfig as Record<string, Record<string, number>>) };
            (Object.keys(CASE_CONFIGS) as CaseType[]).forEach(caseId => {
                if (!newConfig[caseId]) {
                    const weights = CASE_CONFIGS[caseId].weights;
                    newConfig[caseId] = { ...weights };
                }
            });
            setConfig(newConfig);
        }
    };

    const handleWeightChange = (caseId: CaseType, rarity: string, value: string) => {
        const numValue = parseInt(value) || 0;
        const currentCaseConfig = (config[caseId] ?? {}) as Record<string, number>;
        setConfig({
            ...config,
            [caseId]: {
                ...currentCaseConfig,
                [rarity]: numValue
            }
        });
    };

    const handleSave = async () => {
        if (!selectedUser) return;
        setIsSaving(true);
        const res = await updateUserGachaConfig(selectedUser.id, config);
        setIsSaving(false);
        if (res.success) {
            toast(`Config gacha untuk ${selectedUser.name} berhasil disimpan!`, "success");
        } else {
            toast(res.error || "Gagal simpan config.", "error");
        }
    };

    const handleReset = () => {
        const defaultConfig: Record<string, Record<string, number>> = {};
        (Object.keys(CASE_CONFIGS) as CaseType[]).forEach(caseId => {
            const weights = CASE_CONFIGS[caseId].weights;
            defaultConfig[caseId] = { ...weights };
        });
        setConfig(defaultConfig);
        toast("Config di-reset ke default (belum disimpan)", "info");
    };

    const calculatePercentage = (weights: Record<string, number>, rarity: string) => {
        const total = Object.values(weights).reduce((a, b) => a + b, 0);
        if (total === 0) return "0.00";
        return ((weights[rarity] / total) * 100).toFixed(2);
    };

    const currentWeights = config[activeCase] || {};
    const totalWeight = Object.values(currentWeights).reduce((a: number, b: any) => a + (b as number), 0);

    return (
        <div className="space-y-8">
            <div className="glass-card p-6 rounded-3xl border-white/5 bg-white/5">
                <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">Cari User</h3>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Username atau ID User..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-all font-medium"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                        Cari
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
                    {foundUsers.map(user => (
                        <button
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${selectedUser?.id === user.id
                                ? "bg-primary/20 border-primary shadow-lg"
                                : "bg-white/5 border-white/5 hover:bg-white/10"
                                }`}
                        >
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><User size={20} /></div>
                                )}
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="font-bold truncate">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono truncate">{user.id}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {selectedUser && (
                    <motion.div
                        key={selectedUser.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                                    Editor: <span className="text-primary">{selectedUser.name}</span>
                                </h2>
                                <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Override probabilities for this specific player.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleReset}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black uppercase text-xs tracking-tighter"
                                >
                                    <RefreshCcw size={18} />
                                    Reset Default
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    <Save size={20} />
                                    Simpan Gacha User
                                </button>
                            </div>
                        </div>

                        {/* Case Selector Tabs */}
                        <div className="flex flex-wrap gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                            {(Object.keys(CASE_CONFIGS) as CaseType[]).map((caseId) => (
                                <button
                                    key={caseId}
                                    onClick={() => setActiveCase(caseId)}
                                    className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeCase === caseId
                                        ? "bg-white/10 text-primary shadow-inner"
                                        : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {CASE_CONFIGS[caseId].name}
                                </button>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="glass-card p-8 rounded-3xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <Sliders size={20} className="text-primary" />
                                    <h3 className="font-bold text-lg">{CASE_CONFIGS[activeCase].name} Overlay</h3>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(CASE_CONFIGS[activeCase].weights).map(([rarity]) => (
                                        <div key={rarity} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RARITY_COLORS[rarity] }} />
                                                    {rarity}
                                                </label>
                                                <span className="text-xs font-mono text-primary">{calculatePercentage(currentWeights, rarity)}%</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="10000"
                                                    value={currentWeights[rarity] || 0}
                                                    onChange={(e) => handleWeightChange(activeCase, rarity, e.target.value)}
                                                    className="flex-1 accent-primary"
                                                />
                                                <input
                                                    type="number"
                                                    className="w-20 bg-black/40 border border-white/5 rounded-lg px-2 py-1 text-center font-mono text-xs focus:outline-none"
                                                    value={currentWeights[rarity] || 0}
                                                    onChange={(e) => handleWeightChange(activeCase, rarity, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col">
                                <div className="flex items-center gap-3">
                                    <Info size={20} className="text-primary" />
                                    <h3 className="font-bold text-lg">Distribution Info</h3>
                                </div>

                                <div className="h-10 w-full flex rounded-xl overflow-hidden bg-white/5 mb-6">
                                    {Object.entries(currentWeights).map(([rarity, weight]) => {
                                        const percent = (weight as number / (totalWeight || 1)) * 100;
                                        if (percent <= 0) return null;
                                        return <div key={rarity} style={{ width: `${percent}%`, backgroundColor: RARITY_COLORS[rarity] }} className="h-full border-r border-black/20" />;
                                    })}
                                </div>

                                <div className="grid grid-cols-2 gap-3 flex-1">
                                    {Object.entries(currentWeights).map(([rarity, weight]) => (
                                        <div key={rarity} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-center">
                                            <p className="text-[8px] font-black uppercase text-muted-foreground leading-none mb-1">{rarity}</p>
                                            <p className="font-black text-sm">{calculatePercentage(currentWeights, rarity)}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
