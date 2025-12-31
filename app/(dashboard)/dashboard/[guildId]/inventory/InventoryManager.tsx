"use client";

import { useState } from "react";
import { Package, Briefcase, Sparkles } from "lucide-react";
import { InventoryClient } from "./inventory-client";
import { ItemsInventoryClient } from "./items-inventory-client";
import { motion, AnimatePresence } from "framer-motion";

interface InventoryManagerProps {
    skins: any[];
    items: Record<string, number>;
    userId: string;
}

export default function InventoryManager({ skins, items, userId }: InventoryManagerProps) {
    const [activeTab, setActiveTab] = useState<"skins" | "items">("skins");

    const tabs = [
        { id: "skins", label: "Skin Koleksi", icon: Sparkles, count: skins.length },
        { id: "items", label: "Barang Tas", icon: Briefcase, count: Object.keys(items).filter(k => k !== "csSkins").length },
    ];

    return (
        <div className="space-y-8">
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-3xl w-fit backdrop-blur-xl">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`relative flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-500 overflow-hidden ${isActive ? "text-white" : "text-muted-foreground hover:text-white"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-primary shadow-lg shadow-primary/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <Icon size={18} className="relative z-10" />
                            <span className="relative z-10">{tab.label}</span>
                            <span className={`relative z-10 ml-1 px-2 py-0.5 rounded-lg text-[10px] ${isActive ? "bg-white/20" : "bg-white/5"
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === "skins" ? (
                            <InventoryClient initialSkins={skins} userId={userId} />
                        ) : (
                            <ItemsInventoryClient userItems={items} userId={userId} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
