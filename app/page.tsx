"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Zap,
  TrendingUp,
  Skull,
  Flame,
  Ghost,
  Dices,
  Pointer,
  AlertTriangle,
  PartyPopper
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";



export default function LandingPage() {
  const { data: session } = useSession();
  const [scare, setScare] = useState(false);
  const [noTarget, setNoTarget] = useState({ x: 0, y: 0 });
  const [funnyText, setFunnyText] = useState("Info Gacor Abangku 🔥");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleDontClickHover = () => {
    const randomX = (Math.random() - 0.5) * 400;
    const randomY = (Math.random() - 0.5) * 400;
    setNoTarget({ x: randomX, y: randomY });
    const texts = ["Kaburrr!", "Gak bisa kenaaa", "Wlee 😛", "Coba lagi!", "Mendang-mending"];
    setFunnyText(texts[Math.floor(Math.random() * texts.length)]);
  };

  const triggerTroll = () => {
    setScare(true);
    setTimeout(() => setScare(false), 1500);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-black selection:bg-red-500 selection:text-white overflow-hidden relative">

      {/* Chaotic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[150px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>



      {/* Custom Cursor Text */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="fixed top-0 left-0 pointer-events-none z-[100] hidden lg:block"
      >
        <div className="ml-4 mt-4 px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-full shadow-2xl">
          {funnyText}
        </div>
      </motion.div>

      {/* Troll Jump Scare Component */}
      <AnimatePresence>
        {scare && (
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 5, rotate: 0, opacity: 1 }}
            exit={{ scale: 10, opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
          >
            <h1 className="text-white font-black text-9xl italic drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]">GACORRRRR!</h1>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="space-y-4"
        >
          <motion.div
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="inline-block"
          >
            <span className="px-6 py-2 rounded-full border-2 border-red-500 bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              ⚠️ PERINGATAN: TERLALU GACOR UNTUK PEMULA ⚠️
            </span>
          </motion.div>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/10 italic leading-none">
            DASHBOARD <br />
            <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">JONTOL</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium tracking-tight">
            Tempat pembersihan dosa ekonomi Discord. <br className="hidden md:block" />
            Atur judi, nimbun gacha, dan liat kasta lu di leaderboard.
            <span className="text-white font-bold italic ml-1 underline decoration-red-500">Gak profit? Skip aja abangku.</span>
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_20px_40px_rgba(255,255,255,0.15)] flex items-center gap-3"
                  >
                    <LayoutDashboard size={20} />
                    MASUK ARENA
                    <div className="absolute inset-0 rounded-2xl border-2 border-white group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all" />
                  </motion.button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-8 py-5 border-2 border-white/5 hover:bg-white/5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all text-muted-foreground hover:text-white"
                >
                  LOGOUT (PULANG)
                </button>
              </>
            ) : (
              <motion.button
                onClick={() => signIn("discord")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(88, 101, 242, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-[#5865F2] rounded-[32px] text-xl font-black uppercase tracking-tighter flex items-center gap-4 shadow-2xl shadow-indigo-500/20"
              >
                <Skull size={28} />
                GAS LOGIN ABANGKU 🔥
              </motion.button>
            )}
          </div>

          {/* Troll Button */}
          <motion.button
            animate={{ x: noTarget.x, y: noTarget.y }}
            onMouseEnter={handleDontClickHover}
            onClick={triggerTroll}
            className="px-4 py-2 border border-white/10 rounded-xl text-[10px] font-black text-white/20 uppercase hover:text-red-500 hover:border-red-500 transition-colors"
          >
            Jangan Di Klik
          </motion.button>
        </div>

        {/* Funny Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            {
              icon: Dices,
              title: "INFO GACOR",
              desc: "Manipulasi market TRX sampe mampus biar user lu nangis. Profit no 1, integritas no sekian.",
              color: "text-red-500",
              bg: "bg-red-500/10"
            },
            {
              icon: Flame,
              title: "PENCUCIAN UANG",
              desc: "Edit saldo user secara diam-diam. Cocok buat yang mau pamer kaya di depan admin lain.",
              color: "text-orange-500",
              bg: "bg-orange-500/10"
            },
            {
              icon: Skull,
              title: "SATPOL PP BOT",
              desc: "Kick user beban yang cuma menuh-menuhin server. Bersihkan habitat server abangku!",
              color: "text-indigo-500",
              bg: "bg-indigo-500/10"
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="glass-card p-10 rounded-[40px] border-white/5 text-left group hover:scale-[1.05] transition-all cursor-crosshair relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
                <f.icon size={28} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                {f.desc}
              </p>
              <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-white/5 blur-[50px] group-hover:bg-white/10 transition-all rounded-full" />
            </motion.div>
          ))}
        </div>

        {/* Footer Meme */}
        <div className="pt-20 opacity-20 hover:opacity-100 transition-opacity">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-4">Mendang-mending Club dilarang masuk</p>
          <div className="flex justify-center gap-8">
            <Ghost size={20} className="animate-bounce" />
            <Skull size={20} className="animate-bounce delay-150" />
            <Ghost size={20} className="animate-bounce delay-300" />
          </div>
        </div>
      </div>

      {/* Hidden Message Layer */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="group relative">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-help">
            ?
          </div>
          <div className="absolute bottom-full right-0 mb-4 w-48 p-4 glass-card rounded-2xl text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0">
            Kenapa liat-liat? Mau gacha ya? <br /> <br />
            <span className="text-red-500">Saldo lu sisa Rp 200 perak tuh.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
