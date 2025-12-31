"use client";

import {
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
    Coffee,
    Pizza,
    ChefHat,
    Smartphone,
    Watch,
    Bitcoin,
    Fingerprint,
    Plane,
    Anchor,
    Box,
    Heart,
    Flame,
    Moon,
    Sun,
    Pickaxe,
    Magnet,
    Gamepad2,
    Palette,
    Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemIconProps {
    id: string;
    type: string;
    className?: string;
    size?: number;
}

const TYPE_MAP: Record<string, any> = {
    defense: Shield,
    tool: Wrench,
    weapon: Sword,
    vehicle: Car,
    pet: Dog,
    consumable: Zap,
    collectible: Gem,
    rare: Star,
    legendary: Trophy,
};

const SPECIFIC_MAP: Record<string, any> = {
    shield: Shield,
    shield_v2: Shield,
    coffee: Coffee,
    pizza: Pizza,
    sushi: ChefHat,
    phone: Smartphone,
    watch: Watch,
    bitcoin: Bitcoin,
    hackertool: Fingerprint,
    helicopter: Plane,
    yacht: Anchor,
    mystery_box: Box,
    heart: Heart,
    phoenix: Flame,
    moon: Moon,
    star: Sun,
    pickaxe: Pickaxe,
    magnet: Magnet,
    laptop: Gamepad2,
    painting: Palette,
    crown: Crown,
};

export const ItemIcon = ({ id, type, className, size = 24 }: ItemIconProps) => {
    const IconComponent = SPECIFIC_MAP[id] || TYPE_MAP[type] || ShoppingBag;

    // Rarity-based colors
    const rarityStyles: Record<string, string> = {
        legendary: "from-yellow-400 to-amber-600 text-amber-950 shadow-amber-500/20",
        rare: "from-purple-400 to-fuchsia-600 text-fuchsia-950 shadow-fuchsia-500/20",
        collectible: "from-blue-400 to-indigo-600 text-indigo-950 shadow-indigo-500/20",
        weapon: "from-red-400 to-rose-600 text-rose-950 shadow-rose-500/20",
        vehicle: "from-emerald-400 to-teal-600 text-teal-950 shadow-teal-500/20",
        default: "from-slate-400 to-slate-600 text-slate-950 shadow-slate-500/20",
    };

    const style = rarityStyles[type] || rarityStyles.default;

    return (
        <div className={cn(
            "relative flex items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl",
            style,
            className
        )}>
            <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <IconComponent size={size} strokeWidth={2.5} className="relative z-10" />
        </div>
    );
};
