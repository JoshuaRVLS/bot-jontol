"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCcw, Info, Sliders } from "lucide-react";
import { updateGuildGachaConfig } from "@/app/actions/gacha";
import { CaseType, CASE_CONFIGS } from "@/lib/csgo";
import { useToast } from "@/components/ui/Toast";
import { motion } from "framer-motion";

interface GachaConfigEditorProps {
    guildId: string;
    initialConfig: any;
}

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

export const GachaConfigEditor = ({ guildId, initialConfig }: GachaConfigEditorProps) => {
    const [config, setConfig] = useState<any>(initialConfig || {});
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const [activeCase, setActiveCase] = useState<CaseType>("highroller");

    useEffect(() => {
        // Initialize with default weights if missing
        const newConfig = { ...config };
        let changed = false;
        (Object.keys(CASE_CONFIGS) as CaseType[]).forEach(caseId => {
            if (!newConfig[caseId]) {
                newConfig[caseId] = { ...CASE_CONFIGS[caseId].weights };
                changed = true;
            }
        });
        if (changed) setConfig(newConfig);
    }, []);

    const handleWeightChange = (caseId: CaseType, rarity: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setConfig({
            ...config,
            [caseId]: {
                ...config[caseId],
                [rarity]: numValue
            }
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateGuildGachaConfig(guildId, config);
        setIsSaving(false);

        if (res.success) {
            toast("Config gacha berhasil disimpan!", "success");
        } else {
            toast(res.error || "Gagal simpan config.", "error");
        }
    };

    const handleReset = () => {
        const defaultConfig: any = {};
        (Object.keys(CASE_CONFIGS) as CaseType[]).forEach(caseId => {
            defaultConfig[caseId] = { ...CASE_CONFIGS[caseId].weights };
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Gacha Probability Editor</h1>
                    <p className="text-muted-foreground">Atur persentase drop setiap kasta gacha.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-semibold text-sm"
                    >
                        <RefreshCcw size={16} />
                        Reset Default
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-tighter shadow-lg shadow-primary/20 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                    >
                        {isSaving ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        Simpan Perubahan
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
                {/* Editor Form */}
                <motion.div
                    key={activeCase}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-8 rounded-3xl space-y-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <Sliders size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{CASE_CONFIGS[activeCase].name} Weights</h3>
                                <p className="text-xs text-muted-foreground">Total Weight: {totalWeight.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(CASE_CONFIGS[activeCase].weights).map(([rarity]) => (
                            <div key={rarity} className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: RARITY_COLORS[rarity] || "#fff" }}
                                        />
                                        {rarity}
                                    </label>
                                    <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                        {calculatePercentage(currentWeights, rarity)}%
                                    </span>
                                </div>
                                <div className="flex gap-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="1"
                                        value={currentWeights[rarity] || 0}
                                        onChange={(e) => handleWeightChange(activeCase, rarity, e.target.value)}
                                        className="flex-1 accent-primary"
                                    />
                                    <input
                                        type="number"
                                        value={currentWeights[rarity] || 0}
                                        onChange={(e) => handleWeightChange(activeCase, rarity, e.target.value)}
                                        className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm font-mono text-center focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Visual Distribution */}
                <div className="space-y-8">
                    <div className="glass-card p-8 rounded-3xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <Info size={20} />
                            </div>
                            <h3 className="font-bold text-lg">Visual Distribution</h3>
                        </div>

                        {/* Distribution Bar */}
                        <div className="h-12 w-full flex rounded-2xl overflow-hidden bg-white/5">
                            {Object.entries(currentWeights).map(([rarity, weight]) => {
                                const percent = (weight as number / (totalWeight || 1)) * 100;
                                if (percent <= 0) return null;
                                return (
                                    <div
                                        key={rarity}
                                        style={{
                                            width: `${percent}%`,
                                            backgroundColor: RARITY_COLORS[rarity] || "#fff"
                                        }}
                                        className="h-full relative group transition-all"
                                        title={`${rarity}: ${percent.toFixed(2)}%`}
                                    >
                                        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors" />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 gap-4">
                            {Object.entries(currentWeights).map(([rarity, weight]) => (
                                <div key={rarity} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: RARITY_COLORS[rarity] || "#fff" }}
                                        />
                                        <span className="text-xs font-bold uppercase">{rarity}</span>
                                    </div>
                                    <span className="text-xs font-black">{calculatePercentage(currentWeights, rarity)}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-3xl bg-primary/5 border-primary/10 border italic">
                        <p className="text-sm text-primary leading-relaxed">
                            <span className="font-black uppercase mr-2">[Note]</span>
                            Makin gede angkanya, makin sering dapet. Kalau diset 0 berarti item itu gak bakal nongol sama sekali.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
