"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { LayoutDashboard, LogIn, LogOut, Shield, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-4xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium inline-block mb-6">
            The Ultimate Discord Economy Bot
          </span>
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            JONTOL BOT <br /> DASHBOARD
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Kelola ekonomi server, atur investasi market, dan pantau leaderboard secara real-time lewat satu dashboard premium.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {session ? (
              <>
                <Link href="/dashboard">
                  <button className="glow-btn flex items-center gap-2 px-8 py-4 bg-primary rounded-xl font-bold">
                    <LayoutDashboard size={20} />
                    Go to Dashboard
                  </button>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-8 py-4 bg-muted hover:bg-muted/80 rounded-xl font-bold transition-colors"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="glow-btn flex items-center gap-2 px-10 py-5 bg-primary rounded-xl text-lg font-bold"
              >
                <LogIn size={24} />
                Login with Discord
              </button>
            )}
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-20"
        >
          <div className="glass-card p-8 rounded-3xl text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold">Market Control</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Atur harga saham dan crypto, pantau volatilitas market TRX secara live dari web.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold">Server Guard</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Konfigurasi welcome message dan filter keamanan server cuma lewat klik-klik doang.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl text-left space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">Elite Economy</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Edit saldo, manage inventory, dan pantau aktivitas gacha user dengan transparansi penuh.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
