"use client";

import { useState, useEffect, useMemo } from "react";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Briefcase,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCcw,
    Search,
    Coins,
    LineChart,
    ChevronRight,
    Loader2,
    DollarSign,
    Target
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { getMarketDataAction, buyAssetAction, sellAssetAction } from "@/app/actions/invest";
import { useRouter } from "next/navigation";
import { formatAssetAmount } from "@/lib/invest";
import { cn } from "@/lib/utils";

interface MarketAsset {
    id: string;
    name: string;
    type: string;
    price: number;
    lastPrice: number;
    updatedAt: Date;
}

interface InvestClientProps {
    initialAssets: MarketAsset[];
    userWallet: number;
    userInvestments: Record<string, number>;
}

export const InvestClient = ({ initialAssets, userWallet, userInvestments }: InvestClientProps) => {
    const [assets, setAssets] = useState<MarketAsset[]>(initialAssets);
    const [searchTerm, setSearchTerm] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
    const [transactionMode, setTransactionMode] = useState<"buy" | "sell">("buy");
    const [moneyInput, setMoneyInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const fetchLatestPrices = async (silent = false) => {
        if (!silent) setIsUpdating(true);
        const res = await getMarketDataAction();
        if (res.success && res.assets) {
            setAssets(res.assets as any);
        }
        if (!silent) setIsUpdating(false);
    };

    // Poll for updates every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchLatestPrices(true);
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    const filteredAssets = assets.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const portfolioValue = useMemo(() => {
        return Object.entries(userInvestments).reduce((total, [id, amount]) => {
            const asset = assets.find(a => a.id === id);
            return total + (asset ? asset.price * amount : 0);
        }, 0);
    }, [userInvestments, assets]);

    const handleTransaction = async () => {
        if (!selectedAsset || !moneyInput) return;
        const amount = parseFloat(moneyInput);
        if (isNaN(amount) || amount <= 0) return;

        setIsProcessing(true);
        const res = transactionMode === "buy"
            ? await buyAssetAction(selectedAsset.id, amount)
            : await sellAssetAction(selectedAsset.id, amount);

        if (res.success) {
            toast(`Transaksi ${transactionMode === "buy" ? "pembelian" : "penjualan"} ${selectedAsset.id} berhasil!`, "success");
            router.refresh();
            setSelectedAsset(null);
            setMoneyInput("");
        } else {
            toast(res.error || "Transaksi gagal.", "error");
        }
        setIsProcessing(false);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header / Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 rounded-[32px] border-white/5 bg-gradient-to-br from-primary/10 to-transparent"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-primary text-white">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Portofolio</p>
                            <h2 className="text-2xl font-black italic">Rp {portfolioValue.toLocaleString()}</h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <ArrowUpRight size={14} />
                        <span>Aset Aktif: {Object.keys(userInvestments).length}</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 rounded-[32px] border-white/5"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-500 text-white">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Saldo Tunai</p>
                            <h2 className="text-2xl font-black italic">Rp {userWallet.toLocaleString()}</h2>
                        </div>
                    </div>
                    <p className="text-xs font-bold text-muted-foreground">Siap buat digas invest!</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6 rounded-[32px] border-white/5 md:hidden lg:block"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-amber-500 text-white">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"> JSX Market Status</p>
                            <h2 className="text-2xl font-black italic flex items-center gap-2">
                                OPEN
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                        <RefreshCcw size={10} className={cn(isUpdating && "animate-spin")} />
                        Auto-update every 15s
                    </div>
                </motion.div>
            </div>

            {/* Search and Refresh */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Cari emiten atau crypto (BTC, GOTO...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 pl-14 pr-6 focus:outline-none focus:border-primary transition-all text-sm font-medium backdrop-blur-md"
                    />
                </div>
                <button
                    onClick={() => fetchLatestPrices()}
                    disabled={isUpdating}
                    className="px-6 py-4 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={16} className={cn(isUpdating && "animate-spin")} />
                    Refresh
                </button>
            </div>

            {/* Market Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredAssets.map((asset) => {
                        const trend = asset.price > asset.lastPrice ? 'up' : asset.price < asset.lastPrice ? 'down' : 'neutral';
                        const holding = userInvestments[asset.id] || 0;
                        const holdingValue = holding * asset.price;

                        return (
                            <motion.div
                                key={asset.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card group p-5 rounded-[28px] border-white/5 hover:border-primary/30 transition-all flex items-center justify-between bg-white/[0.01]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg",
                                        asset.type === 'crypto' ? "bg-amber-500 shadow-amber-500/10" : "bg-blue-500 shadow-blue-500/10"
                                    )}>
                                        <span className="font-black text-xs">{asset.id}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase italic leading-none group-hover:text-primary transition-colors">{asset.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-bold">Rp {asset.price.toLocaleString()}</span>
                                            <div className={cn(
                                                "flex items-center gap-0.5 text-[10px] font-black uppercase",
                                                trend === 'up' ? "text-emerald-400" : trend === 'down' ? "text-red-400" : "text-muted-foreground"
                                            )}>
                                                {trend === 'up' ? <TrendingUp size={10} /> : trend === 'down' ? <TrendingDown size={10} /> : null}
                                                {asset.lastPrice > 0 ? (((asset.price - asset.lastPrice) / asset.lastPrice) * 100).toFixed(2) + "%" : "0%"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        {holding > 0 && (
                                            <>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Holding</p>
                                                <p className="text-xs font-bold">{formatAssetAmount(holding)} unit</p>
                                                <p className="text-[10px] font-bold text-emerald-400">Rp {holdingValue.toLocaleString()}</p>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedAsset(asset);
                                            setTransactionMode("buy");
                                        }}
                                        className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary hover:text-white transition-all group-hover:scale-110 active:scale-95"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Transaction Modal */}
            <AnimatePresence>
                {selectedAsset && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => !isProcessing && setSelectedAsset(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md glass-card rounded-[40px] border-white/10 p-8 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                                        selectedAsset.type === 'crypto' ? "bg-amber-500" : "bg-blue-500"
                                    )}>
                                        <span className="font-black text-xs">{selectedAsset.id}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black italic uppercase text-lg leading-none">{selectedAsset.name}</h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Rp {selectedAsset.price.toLocaleString()} / unit</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedAsset(null)}
                                    className="p-2 rounded-full hover:bg-white/5"
                                >
                                    <Search size={20} className="rotate-45" /> {/* Close-ish icon */}
                                </button>
                            </div>

                            <div className="flex bg-white/5 rounded-2xl p-1 mb-6">
                                <button
                                    onClick={() => setTransactionMode("buy")}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all",
                                        transactionMode === "buy" ? "bg-emerald-500 text-white shadow-lg" : "text-muted-foreground"
                                    )}
                                >
                                    BELI
                                </button>
                                <button
                                    onClick={() => setTransactionMode("sell")}
                                    className={cn(
                                        "flex-1 py-3 rounded-xl text-xs font-black uppercase transition-all",
                                        transactionMode === "sell" ? "bg-red-500 text-white shadow-lg" : "text-muted-foreground"
                                    )}
                                >
                                    JUAL
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Jumlah Rupiah</label>
                                    <div className="relative group">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-black italic">Rp</span>
                                        <input
                                            type="number"
                                            value={moneyInput}
                                            onChange={(e) => setMoneyInput(e.target.value)}
                                            placeholder="Masukin nominal..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-primary text-sm font-black transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                                        <span>Estimasi Unit</span>
                                        <span>{moneyInput ? (parseFloat(moneyInput) / selectedAsset.price).toFixed(8) : "0"} {selectedAsset.id}</span>
                                    </div>
                                    {transactionMode === "sell" && (
                                        <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground">
                                            <span>Maksimal Cair</span>
                                            <span className="text-white">Rp {((userInvestments[selectedAsset.id] || 0) * selectedAsset.price).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleTransaction}
                                    disabled={isProcessing || !moneyInput}
                                    className={cn(
                                        "w-full py-5 rounded-2xl text-white font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50",
                                        transactionMode === "buy" ? "bg-emerald-600 shadow-emerald-600/20" : "bg-red-600 shadow-red-600/20"
                                    )}
                                >
                                    {isProcessing ? <Loader2 className="animate-spin mx-auto" /> :
                                        transactionMode === "buy" ? `BELI ${selectedAsset.id}` : `JUAL ${selectedAsset.id}`
                                    }
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
