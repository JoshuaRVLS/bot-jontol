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
    Keyboard,
    Sparkles
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
    const [openCategories, setOpenCategories] = useState<string[]>(["CASINO"]);

    useEffect(() => {
        const checkMobile = () => {
            // Just for responsive behavior
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
                { label: "Ringkasan", icon: Wallet, href: `/dashboard/${guildId}/economy`, devOnly: false },
                { label: "Clicker", icon: MousePointer2, href: `/dashboard/${guildId}/clicker`, devOnly: false },
                { label: "Investasi", icon: TrendingUp, href: `/dashboard/${guildId}/invest`, devOnly: false },
                { label: "Toko", icon: Store, href: `/dashboard/${guildId}/shop`, devOnly: false },
            ]
        },
        {
            label: "CASINO",
            icon: Gamepad2,
            defaultOpen: true,
            items: [
                { label: "Gacha Battle", icon: Swords, href: `/dashboard/${guildId}/battle`, devOnly: false },
                { label: "Blackjack", icon: Coins, href: `/dashboard/${guildId}/blackjack`, devOnly: false },
                { label: "Slots", icon: Dices, href: `/dashboard/${guildId}/slots`, devOnly: false },
                { label: "Typing Race", icon: Keyboard, href: `/dashboard/${guildId}/typing`, devOnly: false },
                { label: "Suit", icon: Gamepad2, href: `/dashboard/${guildId}/suit`, devOnly: false },
                { label: "Gacha", icon: Zap, href: `/dashboard/${guildId}/gacha`, devOnly: false },
                { label: "Inventory", icon: Package, href: `/dashboard/${guildId}/inventory`, devOnly: false },
            ]
        },
        {
            label: "STATISTIK",
            icon: Trophy,
            items: [
                { label: "Leaderboard", icon: Trophy, href: `/dashboard/${guildId}/leaderboard`, devOnly: false },
            ]
        },
        {
            label: "SISTEM",
            icon: Cog,
            items: [
                { label: "Commands", icon: Terminal, href: `/dashboard/${guildId}/commands`, devOnly: false },
                { label: "Panduan", icon: ShieldAlert, href: `/dashboard/${guildId}/guide`, devOnly: false },
                { label: "Users", icon: Users, href: `/dashboard/${guildId}/users`, devOnly: true },
                { label: "Settings", icon: Settings, href: `/dashboard/${guildId}/settings`, devOnly: true },
                { label: "Reset Data", icon: RotateCcw, href: `/dashboard/${guildId}/developer/reset`, devOnly: true },
                { label: "Gacha Config", icon: Sliders, href: `/dashboard/${guildId}/gacha/config`, devOnly: true },
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
                {/* Logo */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Sparkles size={20} className="text-black" />
                    </div>
                    <div>
                        <h1 className="font-black text-lg tracking-tight text-white">JONTOL</h1>
                        <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Casino</p>
                    </div>
                </div>

                <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-amber-400 transition-colors mb-6 group text-sm">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Keluar</span>
                </Link>

                <div className="h-px bg-white/5 mb-4" />

                {/* Dashboard Button */}
                <Link
                    href={`/dashboard/${guildId}`}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold mb-2",
                        pathname === `/dashboard/${guildId}`
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>

                {/* Casino Hub Button */}
                <Link
                    href={`/dashboard/${guildId}/gambling`}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold mb-4",
                        pathname === `/dashboard/${guildId}/gambling`
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                    )}
                >
                    <Dices size={18} />
                    Casino
                    <span className="ml-auto text-[9px] font-black bg-amber-500 text-black px-2 py-0.5 rounded-full">
                        HOT
                    </span>
                </Link>

                <div className="h-px bg-white/5 mb-4" />
            </div>

            {/* Categories */}
            <nav className="flex-1 overflow-y-auto px-6 py-2 space-y-1">
                {filteredCategories.map((category) => {
                    const isCategoryOpen = openCategories.includes(category.label);
                    const hasActiveItem = category.items.some(item => pathname === item.href);

                    return (
                        <div key={category.label}>
                            <button
                                onClick={() => handleToggleCategory(category.label)}
                                className={cn(
                                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-xs font-bold uppercase tracking-wider",
                                    hasActiveItem
                                        ? "text-amber-400"
                                        : "text-gray-500 hover:text-white hover:bg-white/5"
                                )}
                                aria-expanded={isCategoryOpen}
                                aria-label={`Toggle ${category.label} menu`}
                                tabIndex={0}
                            >
                                <div className="flex items-center gap-2">
                                    <category.icon size={14} />
                                    {category.label}
                                </div>
                                <ChevronDown
                                    size={14}
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
                                        <div className="ml-3 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                                            {category.items.map((item) => {
                                                const isActive = pathname === item.href;

                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                                                            isActive
                                                                ? "bg-amber-500/20 text-amber-400 border-l-2 border-amber-500"
                                                                : "text-gray-500 hover:text-white hover:bg-white/5"
                                                        )}
                                                    >
                                                        <item.icon size={16} className={isActive ? "text-amber-400" : ""} />
                                                        {item.label}
                                                    </Link>
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

            <div className="mt-auto p-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <HandCoins size={14} />
                        Info
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">
                        Perubahan akan langsung tersinkronisasi dengan bot.
                    </p>
                </div>
            </div>
        </div >
    );

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between bg-black/90 backdrop-blur-xl border-b border-amber-500/10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                        <Sparkles size={14} className="text-black" />
                    </div>
                    <span className="font-black tracking-tight text-white">JONTOL</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-xl bg-white/5 border border-amber-500/20 text-amber-400"
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
                        className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-screen transition-transform duration-300 ease-out border-r border-amber-500/10 bg-[#0a0a0a]",
                "w-64 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    {sidebarContent}
                </div>
            </aside>

            {/* Spacer for desktop */}
            <div className="hidden lg:block w-64 shrink-0" />
        </>
    );
};
