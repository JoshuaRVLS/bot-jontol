"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Dices,
  Coins,
  Trophy,
  Sparkles,
  CreditCard
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black via-[#0d0d0d] to-black overflow-hidden relative">

      {/* Casino Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[200px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-amber-500/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-500/10 rounded-full" />
      </div>

      {/* Floating Cards Decoration */}
      <div className="absolute top-20 left-20 text-amber-500/20 rotate-12 hidden lg:block">
        <span className="text-8xl">♠</span>
      </div>
      <div className="absolute bottom-20 right-20 text-red-500/20 -rotate-12 hidden lg:block">
        <span className="text-8xl">♦</span>
      </div>
      <div className="absolute top-40 right-40 text-amber-500/15 rotate-6 hidden lg:block">
        <span className="text-6xl">♣</span>
      </div>
      <div className="absolute bottom-40 left-40 text-red-500/15 -rotate-6 hidden lg:block">
        <span className="text-6xl">♥</span>
      </div>

      <div className="max-w-5xl w-full text-center space-y-12 relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Casino Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Premium Casino</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent leading-none">
            JONTOL
          </h1>
          <p className="text-lg text-amber-100/40 font-medium tracking-wide uppercase">
            Casino & Gaming Platform
          </p>

          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Platform gaming lengkap dengan gacha, blackjack, slots, dan berbagai game multiplayer.
            Kelola ekonomi virtual dan raih peringkat tertinggi.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="flex flex-wrap items-center justify-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black rounded-2xl font-black uppercase tracking-wider text-sm shadow-[0_0_30px_rgba(251,191,36,0.3)] flex items-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <LayoutDashboard size={20} className="relative z-10" />
                    <span className="relative z-10">Enter Casino</span>
                  </motion.button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="px-8 py-5 border border-white/10 hover:border-amber-500/30 hover:bg-amber-500/5 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all text-gray-400 hover:text-amber-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <motion.button
                onClick={() => signIn("discord")}
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(251, 191, 36, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl text-xl text-black font-black uppercase tracking-tight flex items-center gap-4 shadow-[0_0_40px_rgba(251,191,36,0.3)]"
              >
                <CreditCard size={24} />
                Login dengan Discord
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8"
        >
          {[
            {
              icon: Dices,
              title: "Casino Games",
              desc: "Blackjack, Slots, Suit, dan berbagai game casino klasik."
            },
            {
              icon: Coins,
              title: "Gacha System",
              desc: "Buka case CS:GO dengan sistem pity dan skin langka."
            },
            {
              icon: Trophy,
              title: "Leaderboard",
              desc: "Bersaing dengan pemain lain dan raih peringkat tertinggi."
            }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="casino-card p-8 rounded-3xl text-left group hover:border-amber-500/40 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3 text-white group-hover:text-amber-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Decoration */}
        <div className="pt-12 flex justify-center gap-4 opacity-30">
          <span className="text-2xl text-amber-500">♠</span>
          <span className="text-2xl text-red-500">♥</span>
          <span className="text-2xl text-amber-500">♣</span>
          <span className="text-2xl text-red-500">♦</span>
        </div>
      </div>
    </main>
  );
}
