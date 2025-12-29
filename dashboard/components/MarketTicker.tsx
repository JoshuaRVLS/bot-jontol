"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
    id: string;
    price: number;
    lastPrice: number;
}

export const MarketTicker = ({ items }: { items: TickerItem[] }) => {
    // Duplicate items to ensure smooth infinite loop
    const displayItems = [...items, ...items, ...items];

    if (items.length === 0) return null;

    return (
        <div className="w-full bg-black/40 border-y border-white/5 backdrop-blur-md overflow-hidden py-3">
            <div className="flex animate-marquee whitespace-nowrap">
                {displayItems.map((item, idx) => {
                    const isUp = item.price >= item.lastPrice;
                    const change = ((item.price - item.lastPrice) / item.lastPrice * 100) || 0;

                    return (
                        <div key={`${item.id}-${idx}`} className="inline-flex items-center gap-6 px-8 border-r border-white/5">
                            <span className="text-xs font-black tracking-widest uppercase italic">{item.id}</span>
                            <span className="text-sm font-mono font-bold">Rp {item.price.toLocaleString()}</span>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-black font-mono px-2 py-0.5 rounded",
                                isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            )}>
                                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {isUp ? "+" : ""}{change.toFixed(2)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
