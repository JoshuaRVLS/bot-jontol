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
    Coins
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
            label: "Economy",
            icon: Coins,
            items: [
                { label: "Economy", icon: Wallet, href: `/dashboard/${guildId}/economy`, devOnly: false },
                { label: "Investments", icon: TrendingUp, href: `/dashboard/${guildId}/invest`, devOnly: false },
                { label: "Shop & Items", icon: Store, href: `/dashboard/${guildId}/shop`, devOnly: false },
            ]
        },
        {
            label: "Gaming",
            icon: Gamepad2,
            defaultOpen: true,
            items: [
                { label: "Battle Arena", icon: Swords, href: `/dashboard/${guildId}/battle`, devOnly: false, highlight: true },
                { label: "Skin Gacha", icon: Zap, href: `/dashboard/${guildId}/gacha`, devOnly: false, highlight: true },
                { label: "Skin Inventory", icon: Package, href: `/dashboard/${guildId}/inventory`, devOnly: false },
            ]
        },
        {
            label: "System",
            icon: Cog,
            items: [
                { label: "Commands", icon: Terminal, href: `/dashboard/${guildId}/commands`, devOnly: false },
                { label: "Bot Settings", icon: Settings, href: `/dashboard/${guildId}/settings`, devOnly: true },
                { label: "Moderation", icon: ShieldAlert, href: `/dashboard/${guildId}/moderation`, devOnly: true },
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
        <div className="flex flex-col h-full">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Ganti Server</span>
                </Link>
                <div className="h-px bg-border mb-6" />

                {/* Overview - Always visible */}
                <Link
                    href={`/dashboard/${guildId}`}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-4",
                        pathname === `/dashboard/${guildId}`
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                >
                    <LayoutDashboard size={20} />
                    Overview
                </Link>

                <div className="h-px bg-border mb-4" />

                {/* Categories */}
                <nav className="space-y-2">
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
                                                {category.items.map((item) => {
                                                    const isActive = pathname === item.href;
                                                    const isHighlight = item.highlight && !isActive;

                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            className={cn(
                                                                "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                                                                isActive
                                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                                    : isHighlight
                                                                        ? "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border border-amber-500/20 hover:from-amber-500/20 hover:to-orange-500/20"
                                                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                            )}
                                                        >
                                                            <item.icon size={16} className={isHighlight ? "text-amber-400" : ""} />
                                                            {item.label}
                                                            {isHighlight && (
                                                                <span className="ml-auto text-[7px] font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 text-black px-1.5 py-0.5 rounded-full animate-pulse">
                                                                    HOT
                                                                </span>
                                                            )}
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
            </div>

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
        </div>
    );

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 p-4 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-xs">J</div>
                    <span className="font-black italic uppercase tracking-tighter">Dashboard</span>
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
                "fixed top-0 left-0 z-50 h-screen transition-transform duration-500 ease-in-out border-r border-white/5 bg-[#0f1115] shadow-2xl lg:shadow-none",
                "w-72 lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {sidebarContent}
            </aside>

            {/* Spacer for desktop */}
            <div className="hidden lg:block w-72 shrink-0" />
        </>
    );
};
