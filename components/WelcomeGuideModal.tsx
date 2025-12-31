"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    Gamepad2,
    MousePointer2,
    TrendingUp,
    Store,
    Swords,
    Coins,
    Zap,
    Trophy,
    Terminal,
    ChevronRight,
    HelpCircle,
    X,
    BookOpen
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

export default function WelcomeGuideModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("earning");

    useEffect(() => {
        // Check if user has seen the guide
        const hasSeenGuide = localStorage.getItem("hasSeenGuide_v1");
        if (!hasSeenGuide) {
            // Small delay to make it pop up nicely after load
            setTimeout(() => setIsOpen(true), 1500);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("hasSeenGuide_v1", "true");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-4xl max-h-[90vh] bg-[#0a0b0e] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col relative">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors z-10"
                            >
                                <X size={20} />
                            </button>

                            {/* Header */}
                            <div className="p-6 sm:p-8 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 text-center relative overflow-hidden shrink-0">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-3xl pointer-events-none" />
                                <div className="relative z-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 text-primary mb-4 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse">
                                        <BookOpen size={32} />
                                    </div>
                                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">
                                        Selamat Datang, Warga Baru!
                                    </h2>
                                    <p className="text-muted-foreground text-sm font-medium max-w-md mx-auto">
                                        Biar lu gak bingung mau ngapain di sini, baca dulu panduan singkat cara main & cari duit di Habitat Jontol.
                                    </p>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex justify-center gap-2 sm:gap-4 p-4 border-b border-white/5 bg-background/50 shrink-0">
                                {GUIDE_SECTIONS.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveTab(section.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-bold uppercase tracking-tight",
                                            activeTab === section.id
                                                ? "bg-white text-black shadow-lg"
                                                : "bg-white/5 text-muted-foreground hover:text-white hover:bg-white/10"
                                        )}
                                    >
                                        <section.icon size={16} />
                                        {section.label}
                                    </button>
                                ))}
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AnimatePresence mode="popLayout">
                                        {GUIDE_SECTIONS.find(s => s.id === activeTab)?.content.map((item, i) => (
                                            <motion.div
                                                key={item.title}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="glass-card p-4 rounded-2xl border-white/5 bg-white/5 hover:border-white/10 transition-all group"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                        activeTab === "earning" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                                    )}>
                                                        <item.icon size={20} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <h3 className="font-black italic uppercase text-sm text-white mb-1">{item.title}</h3>
                                                            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground leading-tight">{item.description}</p>
                                                        </div>
                                                        <ul className="space-y-1.5 marker:text-white/20 list-disc pl-4">
                                                            {item.details.map((detail, idx) => (
                                                                <li key={idx} className="text-[10px] sm:text-xs text-gray-400 font-medium">
                                                                    {detail}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="p-4 sm:p-6 border-t border-white/5 bg-background/50 shrink-0 text-center">
                                <button
                                    onClick={handleClose}
                                    className="w-full sm:w-auto px-12 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                                >
                                    Siap, Gw Paham!
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
