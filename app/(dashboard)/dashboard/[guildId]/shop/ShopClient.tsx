"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Filter,
    Shield,
    Wrench,
    Sword,
    Car,
    Dog,
    Zap,
    Gem,
    Star,
    Trophy,
    ShoppingBag,
    Loader2,
    CheckCircle2,
    Coins,
    ChevronRight,
    SearchX
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { ITEMS, GameItem } from "@/lib/items";
import { buyItemAction } from "@/app/actions/items";
import { useRouter } from "next/navigation";
import { ItemIcon } from "@/components/ItemIcon";

interface ShopClientProps {
    userWallet: number;
}

const CATEGORIES = [
    { id: "all", label: "Semua", icon: ShoppingBag },
    { id: "defense", label: "Defense", icon: Shield },
    { id: "tool", label: "Tools", icon: Wrench },
    { id: "weapon", label: "Weapons", icon: Sword },
    { id: "vehicle", label: "Vehicles", icon: Car },
    { id: "pet", label: "Pets", icon: Dog },
    { id: "consumable", label: "Consumables", icon: Zap },
    { id: "collectible", label: "Collectibles", icon: Gem },
    { id: "rare", label: "Rare Items", icon: Star },
    { id: "legendary", label: "Legendary", icon: Trophy },
];

export default function ShopClient({ userWallet }: ShopClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [isBuying, setIsBuying] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const filteredItems = useMemo(() => {
        return ITEMS.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === "all" || item.type === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeCategory]);

    const handleBuy = async (item: GameItem) => {
        if (userWallet < item.price) {
            toast("Duit lu kaga cukup bang! Kerja dulu gih.", "warning");
            return;
        }

        const confirmBuy = confirm(`Yakin mau beli ${item.name} seharga Rp ${item.price.toLocaleString()}?`);
        if (!confirmBuy) return;

        setIsBuying(item.id);
        const res = await buyItemAction(item.id, 1);

        if (res.success) {
            toast(`Berhasil beli ${item.name}!`, "success");
            router.refresh();
        } else {
            toast(res.error || "Gagal beli item. Coba lagi deh.", "error");
        }
        setIsBuying(null);
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Cari perlengkapan pro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-6 focus:outline-none focus:border-primary transition-all text-base font-medium backdrop-blur-md shadow-inner"
                />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 pt-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 border ${activeCategory === cat.id
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                            : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            }`}
                    >
                        <cat.icon size={14} />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="group relative glass-card rounded-[32px] border-white/5 hover:border-primary/30 transition-all duration-500 overflow-hidden flex flex-col bg-white/[0.02]"
                        >
                            {/* Rarity & Header */}
                            <div className="p-6 pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${item.type === 'legendary' ? 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5' :
                                        item.type === 'rare' ? 'border-purple-500/30 text-purple-500 bg-purple-500/5' :
                                            'border-white/10 text-muted-foreground'
                                        }`}>
                                        {item.type}
                                    </span>
                                    <span className="text-xs font-mono font-bold text-muted-foreground opacity-50">#{item.id}</span>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <ItemIcon id={item.id} type={item.type} className="w-16 h-16 shrink-0" size={32} />
                                    <h3 className="text-xl font-black italic uppercase leading-tight group-hover:text-primary transition-colors decoration-primary/30 underline-offset-4">
                                        {item.name}
                                    </h3>
                                </div>
                            </div>

                            {/* Description & Skill */}
                            <div className="p-6 pt-2 flex-1 space-y-4">
                                <p className="text-sm text-muted-foreground font-medium min-h-[40px] leading-relaxed">
                                    {item.description}
                                </p>

                                {item.skill && (
                                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                                            <Zap size={10} />
                                            Skill Pasif
                                        </div>
                                        <p className="text-xs font-bold text-white/90">{item.skill}</p>
                                    </div>
                                )}
                            </div>

                            {/* Price & Buy Section */}
                            <div className="p-6 bg-white/[0.03] border-t border-white/5">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Harga</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-lg font-black italic text-emerald-400">
                                                Rp {item.price.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleBuy(item)}
                                        disabled={isBuying !== null || userWallet < item.price}
                                        className={`px-6 py-4 rounded-2xl font-black italic tracking-wider flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${userWallet < item.price
                                            ? "bg-white/5 border border-white/10 text-muted-foreground"
                                            : "bg-primary hover:bg-primary/80 text-white shadow-xl shadow-primary/20"
                                            }`}
                                    >
                                        {isBuying === item.id ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : (
                                            <>
                                                BELI <ChevronRight size={18} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center glass-card rounded-[40px] border-white/5">
                    <div className="bg-white/5 p-8 rounded-full mb-6">
                        <SearchX size={64} className="text-muted-foreground opacity-20" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase">Kaga ada barangnya bang!</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">Coba cari pake keyword lain atau ganti kategori deh.</p>
                </div>
            )}
        </div>
    );
}
