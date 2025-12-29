"use client";

import { useState, useEffect, useRef } from "react";
import { CaseConfig } from "@/lib/csgo";
import { getSkins } from "@/lib/skins";
import { Zap, X, Trophy, Loader2, Sparkles, AlertCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { openCaseAction, sellSkinsAction } from "@/app/actions/gacha";
import { useRouter } from "next/navigation";

interface GachaModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: CaseConfig;
    guildId: string;
}

const GachaModal = ({ isOpen, onClose, config, guildId }: GachaModalProps) => {
    const [step, setStep] = useState<"idle" | "shuffling" | "revealed" | "result" | "error">("idle");
    const [results, setResults] = useState<any[]>([]);
    const [displayedSkins, setDisplayedSkins] = useState<any[]>([]);
    const [bestSkin, setBestSkin] = useState<any>(null);
    const [currentSkin, setCurrentSkin] = useState<any>(null); // Skin being revealed right now
    const [amount, setAmount] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [skins, setSkins] = useState<any[]>([]);
    const [isOpening, setIsOpening] = useState(false);
    const [reel, setReel] = useState<any[]>([]);
    const [isSelling, setIsSelling] = useState(false);
    const [isFastOpen, setIsFastOpen] = useState(false);
    const [currentAnimIdx, setCurrentAnimIdx] = useState(0);

    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            getSkins().then((data) => setSkins(data || []));
            setStep("idle");
            setResults([]);
            setDisplayedSkins([]);
            setBestSkin(null);
            setErrorMessage("");
            setCurrentAnimIdx(0);
        }
    }, [isOpen]);

    const startAnimationSequence = (allSkins: any[], index: number) => {
        if (index >= allSkins.length) {
            setStep("result");
            router.refresh();
            return;
        }

        setCurrentAnimIdx(index);
        setCurrentSkin(null);

        // Generate a fresh random reel for this specific opening
        const tempReel = [];
        for (let i = 0; i < 50; i++) {
            tempReel.push(skins[Math.floor(Math.random() * skins.length)]);
        }
        tempReel[45] = allSkins[index]; // Place result
        setReel(tempReel);
        setStep("shuffling");

        const duration = index === 0 ? 8000 : 5000; // Longer for the first one to build tension

        // Calculate precise offset to center the winning item (index 45)
        // Each item is 160px + 16px gap = 176px
        // Target is the center of 46th item (index 45)
        const itemWidth = 160;
        const gap = 16;
        const targetIdx = 45;
        // Half the item width to center it, then add slight random jitter for realism
        const jitter = (Math.random() - 0.5) * 60;
        const targetOffset = targetIdx * (itemWidth + gap) + jitter;

        animationTimeoutRef.current = setTimeout(() => {
            // Animation finished, show the "Revealed" state for this specific skin
            setCurrentSkin(allSkins[index]);
            setDisplayedSkins(prev => [...prev, allSkins[index]]);
            setStep("revealed");

            // Wait 2.5 seconds for the user to appreciate the drop before moving on
            animationTimeoutRef.current = setTimeout(() => {
                if (index === allSkins.length - 1) {
                    setStep("result");
                    router.refresh();
                } else {
                    startAnimationSequence(allSkins, index + 1);
                }
            }, 2500);
        }, duration + 500); // 500ms extra buffer for the slow ease-out to fully stop
    };

    const handleOpen = async () => {
        if (skins.length === 0 || isOpening) return;

        setIsOpening(true);
        setErrorMessage("");
        setDisplayedSkins([]);
        setCurrentAnimIdx(0);

        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

        try {
            const res = await openCaseAction(config.id, amount);

            if (res.error) {
                setErrorMessage(res.error);
                setStep("error");
            } else {
                setResults(res.skins || []);
                setBestSkin(res.bestSkin);

                if (isFastOpen) {
                    setStep("result");
                    router.refresh();
                } else {
                    startAnimationSequence(res.skins || [], 0);
                }
            }
        } catch (err) {
            setErrorMessage("Gagal buka case bang. Server lagi pusing.");
            setStep("error");
        } finally {
            setIsOpening(false);
        }
    };

    const handleSkipAnimation = () => {
        if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
        setStep("result");
        setDisplayedSkins(results);
        router.refresh();
    };

    const handleSellResult = async () => {
        if (!results.length || isSelling) return;
        setIsSelling(true);

        const ids = results.map(s => s.instanceId);
        const res = await sellSkinsAction(ids);

        if (res.success) {
            onClose();
            router.refresh();
        } else {
            setErrorMessage(res.error || "Gagal jual skin.");
            setStep("error");
        }
        setIsSelling(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={step === "shuffling" ? undefined : onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative w-full max-w-2xl glass-card rounded-[40px] border-white/10 overflow-hidden"
            >
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl uppercase italic leading-none">{config.name}</h3>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">
                                    {isOpening ? "Syncing Transaction..." : "Rolling the dice..."}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={step === "shuffling"}
                            className="p-2 rounded-full hover:bg-white/5 disabled:opacity-30"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="min-h-[350px] flex flex-col items-center justify-center relative">
                        <AnimatePresence mode="wait">
                            {step === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-8 w-full max-w-md"
                                >
                                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-[40px] border border-white/5 flex items-center justify-center relative group">
                                        <div className="absolute inset-4 rounded-[30px] border border-dashed border-white/10 animate-[spin_20s_linear_infinite]" />
                                        <Zap size={64} className="text-primary animate-pulse" />
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black uppercase italic tracking-tight">Pilih Jumlah Case</h4>

                                        <div className="flex flex-wrap justify-center gap-2">
                                            {[1, 5, 10].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setAmount(val)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${amount === val
                                                        ? "bg-primary text-white scale-110 shadow-lg"
                                                        : "bg-white/5 text-muted-foreground hover:bg-white/10"
                                                        }`}
                                                >
                                                    {val}X
                                                </button>
                                            ))}
                                            <input
                                                type="number"
                                                min="1"
                                                max="50"
                                                value={amount}
                                                onChange={(e) => setAmount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                                                className="w-16 bg-white/5 border border-white/10 rounded-xl px-2 text-center text-xs font-black focus:outline-none focus:border-primary"
                                            />
                                        </div>

                                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                            Total Biaya: <span className="text-white font-black">Rp {(config.cost * amount).toLocaleString()}</span>
                                        </p>

                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <button
                                                onClick={() => setIsFastOpen(!isFastOpen)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isFastOpen
                                                    ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                                    : "bg-white/5 border-white/10 text-muted-foreground"
                                                    }`}
                                            >
                                                <Zap size={14} className={isFastOpen ? "fill-amber-500" : ""} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Fast Open</span>
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleOpen}
                                        disabled={skins.length === 0}
                                        className="w-full py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(59,130,246,0.3)] active:scale-95"
                                    >
                                        {skins.length === 0 ? "Loading Skins..." : `BUKA ${amount}X CASE`}
                                    </button>
                                </motion.div>
                            )}

                            {step === "shuffling" && (
                                <motion.div
                                    key="shuffling"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full relative py-12 overflow-hidden"
                                >
                                    {/* Animation Info */}
                                    {amount > 1 && (
                                        <div className="absolute top-0 right-0 p-2 text-[10px] font-black uppercase tracking-widest text-primary/50">
                                            Case {currentAnimIdx + 1} of {amount}
                                        </div>
                                    )}

                                    {/* Arrow Indicator */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                                        <ChevronDown size={40} className="fill-primary" />
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 rotate-180 text-primary drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                                        <ChevronDown size={40} className="fill-primary" />
                                    </div>

                                    {/* Carousel Reel */}
                                    <div className="relative h-40 w-full overflow-hidden border-y border-white/5 bg-black/40 backdrop-blur-sm">
                                        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-primary/50 z-10 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />

                                        <motion.div
                                            key={currentAnimIdx} // Re-animate for each case
                                            initial={{ x: "0px" }}
                                            animate={{ x: `-${45 * 176 + (Math.random() - 0.5) * 60}px` }}
                                            transition={{
                                                duration: currentAnimIdx === 0 ? 8 : 5,
                                                ease: [0.2, 0.8, 0.1, 1], // Heavy ease-out
                                            }}
                                            className="flex items-center gap-4 px-[50%] h-full whitespace-nowrap"
                                        >
                                            {reel.map((skin, idx) => (
                                                <div
                                                    key={`${currentAnimIdx}-${idx}`}
                                                    className="inline-block w-40 h-32 flex-shrink-0 bg-white/5 rounded-2xl border border-white/10 p-2 relative group overflow-hidden"
                                                >
                                                    <div
                                                        className="absolute inset-0 opacity-20"
                                                        style={{ backgroundColor: skin.rarity?.color }}
                                                    />
                                                    <img src={skin.image} alt="" className="w-full h-full object-contain relative z-10" />
                                                    <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: skin.rarity?.color }} />
                                                </div>
                                            ))}
                                        </motion.div>
                                    </div>

                                    <div className="text-center mt-12 space-y-4">
                                        <h4 className="text-2xl font-black uppercase italic tracking-[0.2em] animate-pulse text-white/50">Mencari Keberuntungan...</h4>

                                        {!isFastOpen && (
                                            <button
                                                onClick={handleSkipAnimation}
                                                className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all text-muted-foreground"
                                            >
                                                Skip All
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === "revealed" && currentSkin && (
                                <motion.div
                                    key={`revealed-${currentAnimIdx}`}
                                    initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                    exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                                    className="text-center space-y-6"
                                >
                                    <div className="relative">
                                        <div
                                            className="absolute inset-0 blur-[80px] opacity-40 animate-pulse"
                                            style={{ backgroundColor: currentSkin.rarity?.color }}
                                        />
                                        <img
                                            src={currentSkin.image}
                                            alt=""
                                            className="w-48 h-48 mx-auto object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span
                                            className="text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full border bg-white/5"
                                            style={{ borderColor: `${currentSkin.rarity?.color}40`, color: currentSkin.rarity?.color }}
                                        >
                                            {currentSkin.rarity?.name}
                                        </span>
                                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">{currentSkin.name}</h3>
                                        <div className="flex items-center justify-center gap-3 text-sm font-mono text-emerald-400 font-black">
                                            <span>{currentSkin.wear}</span>
                                            <span className="text-white/20">|</span>
                                            <span>Rp {currentSkin.marketPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {amount > 1 && (
                                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                            Case {currentAnimIdx + 1} of {amount}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {step === "result" && bestSkin && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center w-full space-y-8"
                                >
                                    {/* Best Drop Featured */}
                                    <div className="relative group mb-6">
                                        <div
                                            className="absolute inset-0 blur-[120px] opacity-30 transition-all pointer-events-none"
                                            style={{ backgroundColor: bestSkin.rarity?.color || "#fff" }}
                                        />
                                        <motion.img
                                            initial={{ y: 20 }}
                                            animate={{ y: 0 }}
                                            transition={{ repeat: Infinity, repeatType: "mirror", duration: 3 }}
                                            src={bestSkin.image}
                                            alt={bestSkin.name}
                                            className="w-48 h-48 mx-auto object-contain relative z-10 drop-shadow-2xl"
                                        />
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                            <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                                                <Sparkles className="text-amber-400" size={16} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">BEST DROP</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none" style={{ color: bestSkin.rarity?.color }}>{bestSkin.name}</h4>
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex flex-col items-center">
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Wear</p>
                                                <p className="font-mono text-[10px] font-black">{bestSkin.wear}</p>
                                            </div>
                                            <div className="w-px h-6 bg-border/50" />
                                            <div className="flex flex-col items-center">
                                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Value</p>
                                                <p className="font-mono text-xs font-black text-emerald-400">Rp {bestSkin.marketPrice.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Grid of all results */}
                                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-[160px] overflow-y-auto p-3 glass-card rounded-2xl border-white/5 shadow-inner custom-scrollbar">
                                        {results.map((skin, idx) => (
                                            <div key={`${skin.instanceId}-${idx}`} className="relative group/skin aspect-square bg-white/5 rounded-lg border border-white/5 p-1 flex items-center justify-center hover:bg-white/10 transition-colors cursor-help">
                                                <img src={skin.image} className="w-full h-full object-contain" alt={skin.name} />
                                                <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-lg transition-all duration-500" style={{ backgroundColor: skin.rarity?.color }} />

                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover/skin:block z-50">
                                                    <div className="bg-black/95 p-2 rounded-lg border border-white/10 text-[8px] font-bold shadow-2xl">
                                                        <p className="uppercase leading-tight">{skin.name}</p>
                                                        <p className="text-emerald-400 mt-1">Rp {skin.marketPrice.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        {results.length > 0 && (
                                            <button
                                                onClick={handleSellResult}
                                                disabled={isSelling}
                                                className="flex-[0.6] py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500/20 transition-all flex flex-col items-center justify-center active:scale-95 disabled:opacity-50"
                                            >
                                                {isSelling ? <Loader2 size={12} className="animate-spin" /> : (
                                                    <>
                                                        <span>JUAL SEMUA</span>
                                                        <span className="opacity-70 text-[8px]">Rp {results.reduce((acc, s) => acc + (s.marketPrice || 0), 0).toLocaleString()}</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        <button
                                            onClick={handleOpen}
                                            className="flex-1 py-4 rounded-full bg-white/5 border border-white/10 font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Loader2 size={16} />
                                            Buka Lagi
                                        </button>
                                        <button
                                            onClick={onClose}
                                            className="flex-1 py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-[0_10px_20px_rgba(59,130,246,0.2)] active:scale-95"
                                        >
                                            Simpan Aset
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === "error" && (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center space-y-6"
                                >
                                    <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                        <AlertCircle size={48} />
                                    </div>
                                    <div className="space-y-2 px-10">
                                        <h4 className="text-xl font-black uppercase italic tracking-tight">Waduh Bang!</h4>
                                        <p className="text-red-400/80 text-sm font-medium">
                                            {errorMessage}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setStep("idle")}
                                        className="px-10 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold uppercase text-xs"
                                    >
                                        COBA LAGI
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer status */}
                <div className="px-8 py-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sistem Gacha Jontol v2.0</span>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                        Secure SSL Transactions
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default GachaModal;
