"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Filter,
    ArrowUpDown,
    CircleDollarSign,
    PackageOpen,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { sellSkinsAction } from "@/app/actions/gacha";
import { useRouter } from "next/navigation";

interface InventoryClientProps {
    initialSkins: any[];
    userId: string;
}

const RARITY_ORDER = ["Gold", "Covert", "Classified", "Restricted", "Mil-Spec", "Industrial", "Consumer"];

export const InventoryClient = ({ initialSkins }: InventoryClientProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [rarityFilter, setRarityFilter] = useState<string>("All");
    const [sortBy, setSortBy] = useState<"price-desc" | "price-asc" | "rarity">("price-desc");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isSelling, setIsSelling] = useState(false);
    const { toast } = useToast();

    const router = useRouter();

    const filteredSkins = useMemo(() => {
        let result = [...initialSkins];

        if (searchTerm) {
            result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (rarityFilter !== "All") {
            result = result.filter(s => s.rarity?.name === rarityFilter);
        }

        result.sort((a, b) => {
            if (sortBy === "price-desc") return b.marketPrice - a.marketPrice;
            if (sortBy === "price-asc") return a.marketPrice - b.marketPrice;
            if (sortBy === "rarity") {
                const aIdx = RARITY_ORDER.indexOf(a.rarity?.name || "");
                const bIdx = RARITY_ORDER.indexOf(b.rarity?.name || "");
                return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
            }
            return 0;
        });

        return result;
    }, [initialSkins, searchTerm, rarityFilter, sortBy]);

    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === filteredSkins.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSkins.map(s => s.instanceId));
        }
    };

    const handleSellSelected = async () => {
        if (selectedIds.length === 0 || isSelling) return;

        const confirmSell = confirm(`Jual ${selectedIds.length} item pilihan?`);
        if (!confirmSell) return;

        setIsSelling(true);
        const res = await sellSkinsAction(selectedIds);

        if (res.success) {
            setSelectedIds([]);
            router.refresh();
        } else {
            toast(res.error || "Gagal menjual item.", "error");
        }
        setIsSelling(false);
    };

    const rarities = ["All", ...RARITY_ORDER.filter(r => initialSkins.some(s => s.rarity?.name === r))];

    if (initialSkins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 glass-card rounded-[40px] border-white/5 bg-white/5">
                <PackageOpen size={64} className="text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-black italic uppercase">Inventory Kosong</h3>
                <p className="text-muted-foreground mt-2">Dapatkan item dari gacha atau pertempuran.</p>
                <button
                    onClick={() => router.push(`./gacha`)}
                    className="mt-8 px-8 py-3 bg-primary rounded-2xl font-black italic tracking-wider hover:scale-105 transition-all"
                >
                    BUKA GACHA
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Controls Bar */}
            <div className="flex flex-col gap-4 p-4 sm:p-6 glass-card rounded-3xl border-white/5">
                {/* Search Row */}
                <div className="relative group rotate-[-0.5deg]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-red-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Cari skin..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-12 pr-4 focus:outline-none focus:border-red-500 transition-all text-xs font-black uppercase tracking-widest placeholder:opacity-30"
                    />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <select
                            value={rarityFilter}
                            onChange={(e) => setRarityFilter(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 appearance-none focus:outline-none focus:border-primary text-xs font-bold transition-all cursor-pointer"
                        >
                            {rarities.map(r => <option key={r} value={r} className="bg-[#0f1115]">{r}</option>)}
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                    </div>

                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 appearance-none focus:outline-none focus:border-primary text-xs font-bold transition-all cursor-pointer"
                        >
                            <option value="price-desc" className="bg-[#0f1115]">Mahal</option>
                            <option value="price-asc" className="bg-[#0f1115]">Murah</option>
                            <option value="rarity" className="bg-[#0f1115]">Rarity</option>
                        </select>
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={14} />
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/5">
                    <button
                        onClick={handleSelectAll}
                        className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95"
                    >
                        {selectedIds.length === filteredSkins.length ? "BATAL ABANGKU" : "PILIH SEMUA TUMBAL"}
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSellSelected}
                        disabled={selectedIds.length === 0 || isSelling}
                        className="flex-[1.5] py-4 rounded-2xl bg-red-500 text-white font-black uppercase text-xs tracking-[0.2em] shadow-[0_15px_30px_rgba(239,68,68,0.3)] hover:bg-red-400 transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:grayscale"
                    >
                        {isSelling ? <Loader2 className="animate-spin" size={16} /> : <CircleDollarSign size={16} />}
                        JUAL SEMUA ({selectedIds.length}) → AUTO KAYA
                    </motion.button>
                </div>
            </div>

            {/* Skins Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredSkins.map((skin) => {
                        const isSelected = selectedIds.includes(skin.instanceId);
                        return (
                            <motion.div
                                layout
                                key={skin.instanceId}
                                initial={{ opacity: 0, scale: 0.9, rotate: (skin.instanceId.charCodeAt(0) % 6) - 3 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => handleToggleSelect(skin.instanceId)}
                                className={`group relative glass-card rounded-[40px] border-transparent hover:border-red-500/40 transition-all cursor-pointer overflow-hidden flex flex-col shadow-2xl ${isSelected ? "ring-4 ring-red-500 bg-red-500/10 rotate-0" : ""
                                    }`}
                            >
                                {/* Selection Indicator */}
                                <div className={`absolute top-6 right-6 z-20 w-8 h-8 rounded-2xl border-2 border-white/20 flex items-center justify-center transition-all shadow-xl ${isSelected ? "bg-red-500 border-red-400 rotate-12" : "bg-black/40"
                                    }`}>
                                    {isSelected && <CheckCircle2 size={16} className="text-white" />}
                                </div>

                                {/* Skin Preview */}
                                <div className="aspect-square p-6 relative flex items-center justify-center">
                                    <div
                                        className="absolute inset-0 opacity-10 blur-[40px] transition-transform duration-700 group-hover:scale-125"
                                        style={{ backgroundColor: skin.rarity?.color }}
                                    />
                                    <img
                                        src={skin.image}
                                        alt={skin.name}
                                        className="w-full h-full object-contain relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: skin.rarity?.color }} />
                                </div>

                                {/* Details */}
                                <div className="p-4 space-y-3 flex-1 flex flex-col">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">
                                            {skin.rarity?.name}
                                        </p>
                                        <h3 className="font-bold text-sm leading-tight line-clamp-2 h-10 group-hover:text-primary transition-colors">
                                            {skin.name}
                                        </h3>
                                    </div>

                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase">Value</span>
                                            <span className="text-xs font-black text-emerald-400">
                                                Rp {skin.marketPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[8px] font-bold text-muted-foreground uppercase">Wear</span>
                                            <span className="text-[10px] font-mono font-bold">
                                                {skin.wear}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredSkins.length === 0 && searchTerm && (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground italic">Gak nemu skin "{searchTerm}" di inventory lu bang.</p>
                </div>
            )}
        </div>
    );
};

// export default InventoryClient;
