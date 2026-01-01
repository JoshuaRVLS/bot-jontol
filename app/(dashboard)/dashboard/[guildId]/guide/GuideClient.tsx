"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Gamepad2,
    MousePointer2,
    TrendingUp,
    Swords,
    Coins,
    Zap,
    Terminal,
    HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const GUIDE_SECTIONS = [
    {
        id: "earning",
        label: "Cara Dapet Duit",
        icon: Wallet,
        color: "bg-emerald-500",
        content: [
            {
                title: "Clicker Game",
                icon: MousePointer2,
                description: "Cara paling gampang buat kumpulin modal awal.",
                details: [
                    "Klik tombol buat dapet duit receh (Default: 100/klik).",
                    "Ada kesempatan Critical Hit (2x lipat) & JACKPOT!",
                    "Hati-hati! Klik terlalu cepat bakal kena cooldown.",
                    "Sistem punya deteksi Macro, jadi mending klik manual santai aja."
                ]
            },
            {
                title: "Investasi Pasar",
                icon: TrendingUp,
                description: "Putagin duit lu biar beranak pinak.",
                details: [
                    "Beli Aset Crypto (BTC, ETH, SOL) atau Saham (GOTO, BBCA, dll).",
                    "Harga berubah-ubah tiap waktu (High Risk, High Return).",
                    "Pantau grafik tren pasar sebelum beli.",
                    "Jangan All-in kalo gak siap miskin mendadak!"
                ]
            },
            {
                title: "Daily & Work (Discord)",
                icon: Terminal,
                description: "Manfaatin command di bot Discord juga.",
                details: [
                    "Gunakan command `/daily` buat gaji harian.",
                    "Cari kerjaan pake `/work`.",
                    "Berani ambil resiko? Coba `/rob` atau `/crime` (Awas denda polisi!)."
                ]
            }
        ]
    },
    {
        id: "games",
        label: "Games & Judi",
        icon: Gamepad2,
        color: "bg-red-500",
        content: [
            {
                title: "Gacha Battle (PvP)",
                icon: Swords,
                description: "Adu hoki buka case lawan player lain.",
                details: [
                    "Join atau Bikin Room Battle.",
                    "Pilih Case (Budget s/d Sultan).",
                    "Yang dapet total harga skin termahal MENANG SEMUA skin!",
                    "Mode Group: Bisa main rame-rame hingga 4 orang."
                ]
            },
            {
                title: "Suit Multiplayer (PvP)",
                icon: Gamepad2,
                description: "Pertarungan klasik Batu-Gunting-Kertas.",
                details: [
                    "Taruhan 1 vs 1 lawan player lain.",
                    "Pilih move lu (Batu/Gunting/Kertas) secara rahasia.",
                    "Menang dapet duit taruhan, kalah duit melayang.",
                    "Real-time, jadi gak ada tipu-tipu."
                ]
            },
            {
                title: "Blackjack",
                icon: Coins,
                description: "Lawan Dealer di meja kartu.",
                details: [
                    "Target: Dapet angka 21 atau lebih tinggi dari Dealer (tanpa bust).",
                    "Kartu J, Q, K bernilai 10. As bernilai 1 atau 11.",
                    "Blackjack (As + 10/J/Q/K) bayarannya 3:2!",
                    "Mikir dulu sebelum 'Hit' atau 'Stand'."
                ]
            },
            {
                title: "Gacha CS:GO",
                icon: Zap,
                description: "Buka peti iseng-iseng berhadiah.",
                details: [
                    "Beli Key & Case di menu Gacha.",
                    "Peluang dapet skin langka (Covert/Gold).",
                    "Skin bisa dijual lagi ke sistem buat balik modal (atau rugi).",
                    "Koleksi skin lu bakal masuk ke Inventory."
                ]
            }
        ]
    }
];

export default function GuideClient() {
    const [activeTab, setActiveTab] = useState("earning");

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="text-center space-y-4 py-8">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/20 flex items-center justify-center rotate-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                    <HelpCircle className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">
                    PANDUAN PEMULA
                </h1>
                <p className="text-muted-foreground font-medium max-w-lg mx-auto">
                    Bingung mau ngapain? Baca kitab suci ini biar lu paham cara jadi sultan (atau gembel) di Habitat Jontol.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center gap-4">
                {GUIDE_SECTIONS.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={cn(
                            "group relative px-6 py-4 rounded-2xl flex items-center gap-3 transition-all overflow-hidden",
                            activeTab === section.id
                                ? "bg-white text-black shadow-xl scale-105"
                                : "bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white"
                        )}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                            activeTab === section.id ? section.color : "bg-white/10 group-hover:bg-white/20"
                        )}>
                            <section.icon size={20} className={activeTab === section.id ? "text-white" : "text-current"} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">PANDUAN</p>
                            <p className="font-black italic uppercase text-sm sm:text-base">{section.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                    {GUIDE_SECTIONS.find(s => s.id === activeTab)?.content.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-6 rounded-[32px] border-white/5 bg-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-[100px] -mr-10 -mt-10 transition-all group-hover:scale-110" />

                            <div className="relative space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                                        activeTab === "earning" ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
                                    )}>
                                        <item.icon size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white">{item.title}</h3>
                                        <p className="text-xs font-bold text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {item.details.map((detail, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                                            <p className="text-xs sm:text-sm font-medium text-gray-300 leading-relaxed">{detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
