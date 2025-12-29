"use client";

import { useState, useMemo } from "react";
import {
    Search,
    Filter,
    Zap,
    PackageOpen,
    SearchX,
    Trash2,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ITEMS, GameItem } from "@/lib/items";
import { useRouter } from "next/navigation";
import { ItemIcon } from "@/components/ItemIcon";

interface ItemsInventoryClientProps {
    userItems: Record<string, number>;
    userId: string;
}

export const ItemsInventoryClient = ({ userItems, userId }: ItemsInventoryClientProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const router = useRouter();

    const inventoryItems = useMemo(() => {
        const result: (GameItem & { quantity: number })[] = [];

        Object.entries(userItems).forEach(([id, quantity]) => {
            if (id === "csSkins") return;
            const item = ITEMS.find(i => i.id === id);
            if (item && quantity > 0) {
                result.push({ ...item, quantity });
            }
        });

        return result.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === "all" || item.type === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [userItems, searchTerm, activeCategory]);

    const categories = ["all", ...new Set(ITEMS.filter(i => userItems[i.id]).map(i => i.type))];

    if (Object.keys(userItems).filter(k => k !== "csSkins").length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 glass-card rounded-[40px] border-white/5 bg-white/5">
                <PackageOpen size={64} className="text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-xl font-black italic uppercase">Tas Lu Masih Kosong</h3>
                <p className="text-muted-foreground mt-2">Belanja dulu gih di pasar jontol bang.</p>
                <button
                    onClick={() => router.push(`./shop`)}
                    className="mt-8 px-8 py-3 bg-primary rounded-2xl font-black italic tracking-wider hover:scale-105 transition-all"
                >
                    KE PASAR!
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Cari barang di tas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-sm font-medium shadow-inner"
                />
            </div>

            {/* Category Filter */}
            <div className="relative group pt-2">
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase text-muted-foreground">
                        <Filter size={14} />
                        Filter:
                    </div>
                    <select
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 appearance-none focus:outline-none focus:border-primary text-xs font-bold transition-all cursor-pointer min-w-[120px]"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat} className="bg-[#0f1115]">
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {inventoryItems.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative glass-card rounded-[32px] border-white/5 hover:border-white/10 transition-all flex flex-col bg-white/[0.02]"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                        {item.type}
                                    </span>
                                    <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black">
                                        x{item.quantity}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mb-4">
                                    <ItemIcon id={item.id} type={item.type} className="w-14 h-14 shrink-0" size={24} />
                                    <h3 className="text-lg font-black italic uppercase leading-tight">{item.name}</h3>
                                </div>
                                <p className="text-sm text-muted-foreground font-medium h-10 line-clamp-2">
                                    {item.description}
                                </p>

                                {item.skill && (
                                    <div className="mt-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-primary mb-1">
                                            <Zap size={8} />
                                            Effect
                                        </div>
                                        <p className="text-[10px] font-bold text-white/80">{item.skill}</p>
                                    </div>
                                ) || (
                                        <div className="mt-4 h-11" />
                                    )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {inventoryItems.length === 0 && (
                <div className="py-20 text-center">
                    <SearchX size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
                    <p className="text-muted-foreground italic">Barang kaga ketemu di tas lu bang.</p>
                </div>
            )}
        </div>
    );
};
