"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FloatingEmoji = ({ emoji, delay }: { emoji: string; delay: number }) => (
    <motion.div
        initial={{ y: "110vh", x: Math.random() * 100 + "%", opacity: 0 }}
        animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
            rotate: [0, 360],
            x: (Math.random() * 100) + "%"
        }}
        transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay,
            ease: "linear"
        }}
        className="fixed pointer-events-none text-2xl sm:text-4xl z-[-1] opacity-20"
    >
        {emoji}
    </motion.div>
);

export const TrollChaos = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const emojis = ["💀", "🔥", "🤡", "💰", "📉", "🎰", "💩", "🚀", "🤣", "🤔"];

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Chaotic Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[150px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[150px] animate-pulse delay-700" />

            {/* Floating Emojis */}
            {emojis.map((emoji, i) => (
                <FloatingEmoji key={i} emoji={emoji} delay={i * 2} />
            ))}

            {/* Subtle Grid Texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
    );
};
