"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coins, Swords, RefreshCw, Trophy, AlertTriangle, User as UserIcon, Shield, Zap, Info, HandIcon, Plus, Minus, Check, Play } from "lucide-react";
import { startBJAction, hitBJAction, standBJAction, doubleBJAction, BlackjackState, Card, Suit, Rank } from "@/app/actions/blackjack";
import { formatRupiah, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";

interface BlackjackClientProps {
    guildId: string;
    initialWallet: number;
}

const CardIcon = ({ suit, rank }: { suit: Suit; rank: Rank }) => {
    const isRed = suit === "hearts" || suit === "diamonds";
    const suitIcons: Record<Suit, string> = {
        hearts: "♥️",
        diamonds: "♦️",
        clubs: "♣️",
        spades: "♠️"
    };

    return (
        <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            className={cn(
                "w-16 h-24 sm:w-24 sm:h-36 bg-white rounded-xl shadow-2xl flex flex-col justify-between p-2 sm:p-3 relative border-2 border-white/20 overflow-hidden select-none",
                isRed ? "text-red-500" : "text-slate-900"
            )}
        >
            <div className="flex flex-col items-start leading-none">
                <span className="text-sm sm:text-xl font-black">{rank}</span>
                <span className="text-xs sm:text-base">{suitIcons[suit]}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="text-4xl sm:text-6xl">{suitIcons[suit]}</span>
            </div>
            <div className="flex flex-col items-end leading-none rotate-180">
                <span className="text-sm sm:text-xl font-black">{rank}</span>
                <span className="text-xs sm:text-base">{suitIcons[suit]}</span>
            </div>
        </motion.div>
    );
};

const CardBack = () => (
    <motion.div
        initial={{ rotateY: 0 }}
        className="w-16 h-24 sm:w-24 sm:h-36 bg-gradient-to-br from-red-600 to-red-900 rounded-xl shadow-2xl flex items-center justify-center p-2 border-2 border-white/40"
    >
        <div className="w-full h-full border border-white/20 rounded-lg flex items-center justify-center opacity-40 overflow-hidden">
            <div className="grid grid-cols-4 gap-1 rotate-12">
                {[...Array(20)].map((_, i) => (
                    <Trophy key={i} size={20} className="text-white" />
                ))}
            </div>
        </div>
    </motion.div>
);

export default function BlackjackClient({ guildId, initialWallet }: BlackjackClientProps) {
    const { toast } = useToast();
    const [gameState, setGameState] = useState<BlackjackState | null>(null);
    const [wallet, setWallet] = useState(initialWallet);
    const [bet, setBet] = useState(10000);
    const [loading, setLoading] = useState(false);
    const [isDealing, setIsDealing] = useState(false);

    const handleStart = async () => {
        if (bet < 1000) return toast("Minimal bet Rp 1.000 bang!", "error");
        if (wallet < bet) return toast("Saldo gak cukup!", "error");

        setLoading(true);
        setIsDealing(true);
        const result = await startBJAction(bet);
        setLoading(false);

        if (result.error) {
            toast(result.error, "error");
            setIsDealing(false);
        } else if (result.state) {
            setGameState(result.state);
            setWallet(prev => prev - bet);
            setTimeout(() => setIsDealing(false), 1000);
        }
    };

    const handleHit = async () => {
        if (!gameState || gameState.status !== "playing") return;
        setLoading(true);
        const result = await hitBJAction();
        setLoading(false);

        if (result.error) toast(result.error, "error");
        else if (result.state) setGameState(result.state);
    };

    const handleStand = async () => {
        if (!gameState || gameState.status !== "playing") return;
        setLoading(true);
        const result = await standBJAction();
        setLoading(true); // Keep loading UI until finish

        if (result.error) {
            toast(result.error, "error");
            setLoading(false);
        } else if (result.state) {
            // Fake dealer logic delay
            setGameState(result.state);
            setTimeout(() => {
                setLoading(false);
                // Check if won and update wallet
                if (result.state?.status === "win") {
                    setWallet(prev => prev + result.state!.bet * 2);
                } else if (result.state?.status === "push") {
                    setWallet(prev => prev + result.state!.bet);
                }
            }, 800);
        }
    };

    const handleDouble = async () => {
        if (!gameState || gameState.status !== "playing") return;
        if (wallet < gameState.bet) return toast("Saldo gak cukup buat Double!", "error");

        setLoading(true);
        const result = await doubleBJAction();
        setLoading(false);

        if (result.error) toast(result.error, "error");
        else if (result.state) {
            setWallet(prev => prev - (gameState.bet)); // Second part of bet
            setGameState(result.state);
            if (result.state.status === "win") {
                setWallet(prev => prev + result.state.bet * 2);
            } else if (result.state.status === "push") {
                setWallet(prev => prev + result.state.bet);
            }
        }
    };

    const resetGame = () => setGameState(null);

    return (
        <div className="min-h-screen bg-[#073318] relative overflow-hidden flex flex-col pt-24 pb-12 sm:pb-20">
            {/* Background Texture/Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

            {/* Table Branding */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none text-center">
                <Trophy size={200} className="text-white mx-auto" />
                <h1 className="text-6xl font-black italic tracking-tighter text-white">BLACKJACK</h1>
            </div>

            {/* Wallet & Bet Info */}
            <div className="absolute top-8 left-0 right-0 px-6 sm:px-12 flex justify-between items-center z-20">
                <div className="glass-card p-3 sm:px-6 sm:py-4 rounded-3xl border-amber-500/20 bg-black/40 backdrop-blur-xl">
                    <p className="text-[10px] font-black uppercase text-amber-500/60 tracking-[0.2em] mb-1">YOUR BANKROLL</p>
                    <div className="flex items-center gap-3">
                        <Coins className="text-amber-500 animate-pulse" size={20} />
                        <span className="text-xl sm:text-3xl font-black italic text-white tracking-tighter">{formatRupiah(wallet)}</span>
                    </div>
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-4 relative z-10">

                {/* Dealer Area */}
                <div className="flex flex-col items-center space-y-6 pt-10 sm:pt-0">
                    <div className="text-center relative">
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-3">DEALER</h3>
                        <div className="flex justify-center -space-x-8 sm:-space-x-12">
                            {gameState ? (
                                <>
                                    {gameState.dealerHand.map((card, i) => (
                                        <div key={i}>
                                            {i === 1 && gameState.status === "playing" ? <CardBack /> : <CardIcon {...card} />}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="flex -space-x-12">
                                    <CardBack />
                                    <CardBack />
                                </div>
                            )}
                        </div>
                        {gameState && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/5 text-[10px] sm:text-xs font-black text-white italic"
                            >
                                SCORE: {gameState.dealerValue}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Message & Payout Display */}
                <div className="text-center h-20 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {gameState && (
                            <motion.div
                                key={gameState.status}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-2 px-4"
                            >
                                <p className={cn(
                                    "text-lg sm:text-2xl font-black uppercase italic tracking-tighter",
                                    gameState.status === "win" || gameState.status === "blackjack" ? "text-green-400" :
                                        gameState.status === "lose" || gameState.status === "bust" ? "text-red-400" :
                                            "text-white"
                                )}>
                                    {gameState.message}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Player Area */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="text-center relative">
                        <div className="flex justify-center -space-x-8 sm:-space-x-12 min-h-[96px] sm:min-h-[144px]">
                            {gameState ? (
                                gameState.playerHand.map((card, i) => (
                                    <CardIcon key={i} {...card} />
                                ))
                            ) : (
                                <div className="text-white/20 font-black italic text-4xl sm:text-6xl flex items-center justify-center p-12 uppercase tracking-tighter animate-pulse">
                                    Siapkan Bet Lu
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col items-center gap-3 mt-4">
                            {gameState && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary shadow-lg border border-white/20 text-white"
                                >
                                    <span className="text-sm font-black italic">SCORE: {gameState.playerValue}</span>
                                </motion.div>
                            )}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 text-white">
                                <UserIcon size={14} className="text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest">
                                    {gameState?.status === "playing" ? "GILIRAN ANDA" : "YOU"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="mt-10 sm:mt-16 bg-black/40 backdrop-blur-2xl p-6 sm:p-10 rounded-[40px] border border-white/10 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {!gameState ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col sm:flex-row items-center gap-6"
                            >
                                <div className="flex-1 w-full space-y-4">
                                    <div className="flex items-center justify-between px-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/60">JUMLAH BET</label>
                                        <span className="text-amber-500 font-bold text-xs">{formatRupiah(bet)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/5">
                                        <button
                                            onClick={() => setBet(Math.max(1000, bet - 10000))}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <Minus size={20} className="text-white" />
                                        </button>
                                        <input
                                            type="number"
                                            value={bet}
                                            onChange={(e) => setBet(parseInt(e.target.value) || 0)}
                                            className="flex-1 bg-transparent text-center font-black text-2xl text-white outline-none"
                                        />
                                        <button
                                            onClick={() => setBet(bet + 10000)}
                                            className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <Plus size={20} className="text-white" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[1000, 50000, 100000, 1000000].map(val => (
                                            <button
                                                key={val}
                                                onClick={() => setBet(val)}
                                                className="py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black text-white/60 hover:text-white transition-all border border-white/5"
                                            >
                                                {formatNumber(val)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={handleStart}
                                    disabled={loading || wallet < bet}
                                    className="w-full sm:w-64 h-24 sm:h-full bg-gradient-to-br from-primary to-blue-700 rounded-3xl flex flex-col items-center justify-center gap-2 shadow-[0_20px_40px_rgba(59,130,246,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all group disabled:opacity-50 disabled:grayscale"
                                >
                                    <Play size={24} className="text-white group-hover:scale-110 transition-transform" />
                                    <span className="text-sm font-black uppercase tracking-widest text-white">DEAL CARDS</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full flex flex-col sm:flex-row gap-4"
                            >
                                {gameState.status === "playing" ? (
                                    <>
                                        <button
                                            onClick={handleHit}
                                            disabled={loading}
                                            className="flex-1 h-20 bg-white/10 hover:bg-white/20 text-white rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all border border-white/10"
                                        >
                                            <Zap size={20} className="text-emerald-400" />
                                            Hit
                                        </button>
                                        <button
                                            onClick={handleDouble}
                                            disabled={loading || wallet < gameState.bet}
                                            className="flex-1 h-20 bg-amber-500 hover:bg-amber-600 text-black rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(245,158,11,0.3)] disabled:opacity-50"
                                        >
                                            <Plus size={20} />
                                            Double
                                        </button>
                                        <button
                                            onClick={handleStand}
                                            disabled={loading}
                                            className="flex-1 h-20 bg-primary hover:bg-blue-600 text-white rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)]"
                                        >
                                            <HandIcon size={20} />
                                            Stand
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={resetGame}
                                        className="w-full h-20 bg-white hover:bg-slate-100 text-black rounded-3xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all shadow-2xl"
                                    >
                                        <RefreshCw size={20} />
                                        Main Lagi Bang
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Rules Info Footer */}
            <div className="mt-12 text-center opacity-30 px-6 max-w-lg mx-auto space-y-2">
                <p className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">
                    6-Deck Shuffle • Dealer Stands on 17 • Blackjack Pays 3:2
                </p>
                <p className="text-[8px] font-medium text-white/60 leading-relaxed uppercase tracking-widest">
                    Pemain melakukan aksi (Hit/Stand/Double) sampai selesai, barulah Dealer akan membuka kartu dan bermain.
                </p>
            </div>
        </div>
    );
}
