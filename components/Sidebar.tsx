"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Settings,
    Wallet,
    ChevronLeft,
    ChevronDown,
    LayoutDashboard,
    ShieldAlert,
    HandCoins,
    Store,
    TrendingUp,
    Terminal,
    Zap,
    Package,
    Menu,
    X,
    Swords,
    Sliders,
    Gamepad2,
    Cog,
    Coins,
    Users,
    MousePointer2,
    RotateCcw,
    Trophy,
    Dices,
    Keyboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type MenuItem = {
    label: string;
    icon: React.ElementType;
    href: string;
    devOnly: boolean;
    highlight?: boolean;
};

type MenuCategory = {
    label: string;
    icon: React.ElementType;
    items: MenuItem[];
    defaultOpen?: boolean;
};

export const Sidebar = ({ guildId, isDeveloper = false }: { guildId: string; isDeveloper?: boolean }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [openCategories, setOpenCategories] = useState<string[]>(["Gaming"]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const menuCategories: MenuCategory[] = [
        {
            label: "EKONOMI",
            icon: Coins,
            items: [
                { label: "Ringkasan Ekonomi", icon: Wallet, href: `/dashboard/${guildId}/economy`, devOnly: false },
                { label: "Clicker Game", icon: MousePointer2, href: `/dashboard/${guildId}/clicker`, devOnly: false, highlight: true },
                { label: "Investasi", icon: TrendingUp, href: `/dashboard/${guildId}/invest`, devOnly: false },
                { label: "Toko", icon: Store, href: `/dashboard/${guildId}/shop`, devOnly: false },
            ]
        },
        {
            label: "GAMES & GACHA",
            icon: Gamepad2,
            defaultOpen: true,
            items: [
                { label: "Gacha Battle", icon: Swords, href: `/dashboard/${guildId}/battle`, devOnly: false },
                { label: "Blackjack", icon: Coins, href: `/dashboard/${guildId}/blackjack`, devOnly: false },
                { label: "Slots Machine", icon: Dices, href: `/dashboard/${guildId}/slots`, devOnly: false },
                { label: "Typing Race", icon: Keyboard, href: `/dashboard/${guildId}/typing`, devOnly: false },
                { label: "Suit Multiplayer", icon: Gamepad2, href: `/dashboard/${guildId}/suit`, devOnly: false },
                { label: "Gacha", icon: Zap, href: `/dashboard/${guildId}/gacha`, devOnly: false },
                { label: "Inventory", icon: Package, href: `/dashboard/${guildId}/inventory`, devOnly: false },
            ]
        },
        {
            label: "KOMPETISI",
            icon: Trophy,
            items: [
                { label: "Leaderboard", icon: Trophy, href: `/dashboard/${guildId}/leaderboard`, devOnly: false },
            ]
        },
        {
            label: "SISTEM",
            icon: Cog,
            items: [
                { label: "Daftar Command", icon: Terminal, href: `/dashboard/${guildId}/commands`, devOnly: false },
                { label: "Panduan Pemula", icon: ShieldAlert, href: `/dashboard/${guildId}/guide`, devOnly: false },
                { label: "Daftar User", icon: Users, href: `/dashboard/${guildId}/users`, devOnly: true },
                { label: "Pengaturan", icon: Settings, href: `/dashboard/${guildId}/settings`, devOnly: true },
                { label: "RESET DATA", icon: RotateCcw, href: `/dashboard/${guildId}/developer/reset`, devOnly: true },
                { label: "Moderasi", icon: ShieldAlert, href: `/dashboard/${guildId}/moderation`, devOnly: true },
                { label: "Konfigurasi Gacha", icon: Sliders, href: `/dashboard/${guildId}/gacha/config`, devOnly: true },
            ]
        },
    ];

    const handleToggleCategory = (label: string) => {
        setOpenCategories(prev =>
            prev.includes(label)
                ? prev.filter(c => c !== label)
                : [...prev, label]
        );
    };

    const filteredCategories = menuCategories.map(category => ({
        ...category,
        items: category.items.filter(item => !item.devOnly || isDeveloper)
    })).filter(category => category.items.length > 0);

    const sidebarContent = (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="p-6 pb-0">
                <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Kembali</span>
                </Link>
                <div className="h-px bg-border mb-6" />

                {/* Overview - Always visible */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-2"
                >
                    <Link
                        href={`/dashboard/${guildId}`}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-black uppercase text-xs tracking-widest border relative overflow-hidden group hover:rotate-2",
                            pathname === `/dashboard/${guildId}`
                                ? "bg-red-500 text-white border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)] rotate-[-2deg]"
                                : "text-muted-foreground border-white/5 hover:border-red-500/50 hover:text-white"
                        )}
                    >
                        {pathname === `/dashboard/${guildId}` && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        )}
                        <div className="relative">
                            <LayoutDashboard size={20} className={cn(pathname === `/dashboard/${guildId}` && "text-white")} />
                            {pathname === `/dashboard/${guildId}` && <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />}
                        </div>
                        COMMAND CENTER
                    </Link>
                </motion.div>

                {/* Gambling Hub - Highlighted below Command Center */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="mb-6"
                >
                    <Link
                        href={`/dashboard/${guildId}/gambling`}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-black uppercase text-xs tracking-widest border relative overflow-hidden group hover:-rotate-2",
                            pathname === `/dashboard/${guildId}/gambling`
                                ? "bg-red-500 text-white border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.5)] rotate-[2deg]"
                                : "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 hover:border-amber-500/50 hover:text-white"
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <div className="relative">
                            <Gamepad2 size={20} className={cn(pathname === `/dashboard/${guildId}/gambling` ? "text-white" : "text-amber-400")} />
                        </div>
                        PUSAT JUDI
                        <span className="ml-auto text-[7px] font-black bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-0.5 rounded-full">
                            GACOR
                        </span>
                    </Link>
                </motion.div>

                <div className="h-px bg-border mb-4" />
            </div>

            {/* Categories - Scrollable */}
            <nav className="flex-1 overflow-y-auto px-6 py-2 custom-scrollbar space-y-2">
                {filteredCategories.map((category) => {
                    const isCategoryOpen = openCategories.includes(category.label);
                    const hasActiveItem = category.items.some(item => pathname === item.href);

                    return (
                        <div key={category.label}>
                            <button
                                onClick={() => handleToggleCategory(category.label)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all font-semibold text-sm",
                                    hasActiveItem
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                )}
                                aria-expanded={isCategoryOpen}
                                aria-label={`Toggle ${category.label} menu`}
                                tabIndex={0}
                            >
                                <div className="flex items-center gap-3">
                                    <category.icon size={18} />
                                    {category.label}
                                </div>
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        "transition-transform duration-200",
                                        isCategoryOpen ? "rotate-180" : ""
                                    )}
                                />
                            </button>

                            <AnimatePresence>
                                {isCategoryOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-4">
                                            {category.items.map((item, i) => {
                                                const isActive = pathname === item.href;
                                                const isHighlight = item.highlight && !isActive;

                                                return (
                                                    <motion.div
                                                        key={item.href}
                                                        whileHover={{ x: 5, rotate: i % 2 === 0 ? 1 : -1 }}
                                                        transition={{ type: "spring", stiffness: 400 }}
                                                    >
                                                        <Link
                                                            href={item.href}
                                                            className={cn(
                                                                "relative flex items-center gap-3 px-3 py-3 rounded-[20px] transition-all text-[10px] font-black uppercase tracking-tight overflow-hidden group",
                                                                isActive
                                                                    ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] border-red-400 rotate-1 scale-[1.02]"
                                                                    : isHighlight
                                                                        ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 hover:from-amber-500/30 hover:to-orange-500/30 hover:-rotate-1"
                                                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:border-white/20 border border-transparent hover:rotate-1"
                                                            )}
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <item.icon size={18} className={cn(isActive && "animate-pulse", isHighlight && "text-amber-400")} />
                                                            {item.label}
                                                            {isHighlight && (
                                                                <span className="ml-auto text-[7px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-black px-2 py-0.5 rounded-full">
                                                                    GACOR
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </nav>

            <div className="mt-auto p-6 space-y-4">
                <div className="glass-card p-4 rounded-2xl text-[10px] space-y-2 bg-white/5 border-white/5">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest">
                        <HandCoins size={12} />
                        Status Tip
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                        Semua perubahan bakal langsung sinkron ke bot abang secara real-time.
                    </p>
                </div>
            </div>
        </div >
    );

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-xs">J</div>
                    <span className="font-black italic uppercase tracking-tighter">HABITAT JONTOL</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-primary"
                    aria-label="Toggle menu"
                    tabIndex={0}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Backdrop for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Desktop & Mobile Sliding */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen transition-transform duration-500 ease-in-out border-r border-white/5 bg-[#0a0b0e] shadow-[20px_0_50px_rgba(0,0,0,0.5)] lg:shadow-none",
                "w-72 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
                <div className="relative h-full flex flex-col">
                    {sidebarContent}
                </div>
            </aside>

            {/* Spacer for desktop */}
            <div className="hidden lg:block w-72 shrink-0" />
        </>
    );
};
