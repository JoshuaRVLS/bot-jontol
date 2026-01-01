"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  LayoutDashboard,
  Flame,
  Dices,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session } = useSession();

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

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-black selection:bg-red-500 selection:text-white overflow-hidden relative">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[150px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-12 relative z-10">

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="space-y-4"
        >
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/10 italic leading-none">
            DASHBOARD <br />
            <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.5)]">JONTOL</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium tracking-tight">
            Panel kontrol ekonomi Discord server. <br className="hidden md:block" />
            Kelola game, gacha, dan lihat peringkat di leaderboard.
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
                    Masuk Dashboard
                    <div className="absolute inset-0 rounded-2xl border-2 border-white group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all" />
                  </motion.button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-8 py-5 border-2 border-white/5 hover:bg-white/5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all text-muted-foreground hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <motion.button
                onClick={() => signIn("discord")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(88, 101, 242, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-[#5865F2] rounded-[32px] text-xl font-black uppercase tracking-tighter flex items-center gap-4 shadow-2xl shadow-indigo-500/20"
              >
                Login dengan Discord
              </motion.button>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            {
              icon: Dices,
              title: "Gacha & Games",
              desc: "Buka case CS:GO, main blackjack, slots, dan game multiplayer lainnya.",
              color: "text-red-500",
              bg: "bg-red-500/10"
            },
            {
              icon: Flame,
              title: "Ekonomi Virtual",
              desc: "Sistem ekonomi lengkap dengan wallet, bank, dan investasi.",
              color: "text-orange-500",
              bg: "bg-orange-500/10"
            },
            {
              icon: TrendingUp,
              title: "Leaderboard",
              desc: "Pantau peringkat dan statistik semua member di server.",
              color: "text-indigo-500",
              bg: "bg-indigo-500/10"
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className="glass-card p-10 rounded-[40px] border-white/5 text-left group hover:scale-[1.05] transition-all cursor-pointer relative overflow-hidden"
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
      </div>
    </main>
  );
}
