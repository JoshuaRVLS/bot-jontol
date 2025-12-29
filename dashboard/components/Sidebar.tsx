"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    Settings,
    Wallet,
    ChevronLeft,
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
    Swords
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const Sidebar = ({ guildId, isAdmin = false }: { guildId: string; isAdmin?: boolean }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    const allMenuItems = [
        { label: "Overview", icon: LayoutDashboard, href: `/dashboard/${guildId}`, adminOnly: false },
        { label: "Bot Settings", icon: Settings, href: `/dashboard/${guildId}/settings`, adminOnly: true },
        { label: "Economy", icon: Wallet, href: `/dashboard/${guildId}/economy`, adminOnly: false },
        { label: "Investments", icon: TrendingUp, href: `/dashboard/${guildId}/invest`, adminOnly: false },
        { label: "Battle Arena", icon: Swords, href: `/dashboard/${guildId}/battle`, adminOnly: false },
        { label: "Skin Gacha", icon: Zap, href: `/dashboard/${guildId}/gacha`, adminOnly: false },
        { label: "Skin Inventory", icon: Package, href: `/dashboard/${guildId}/inventory`, adminOnly: false },
        { label: "Shop & items", icon: Store, href: `/dashboard/${guildId}/shop`, adminOnly: false },
        { label: "Commands", icon: Terminal, href: `/dashboard/${guildId}/commands`, adminOnly: false },
        { label: "Moderation", icon: ShieldAlert, href: `/dashboard/${guildId}/moderation`, adminOnly: true },
    ];

    const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);

    const sidebarContent = (
        <div className="flex flex-col h-full">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group">
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Ganti Server</span>
                </Link>
                <div className="h-px bg-border mb-8" />

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                )}
                            >
                                <item.icon size={20} />
                                {item.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                                    />
                                )}
                            </Link>
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
