"use client";

import { useState } from "react";
import { GachaConfigEditor } from "./GachaConfigEditor";
import { UserGachaEditor } from "./UserGachaEditor";
import { motion, AnimatePresence } from "framer-motion";

export const ConfigTabs = ({ guildId, guildConfig, guildError }: {
    guildId: string;
    guildConfig: any;
    guildError: any;
}) => {
    const [activeTab, setActiveTab] = useState<"server" | "user">("server");

    return (
        <div className="space-y-8">
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab("server")}
                    className={`px-8 py-3 rounded-xl font-black uppercase tracking-tighter italic transition-all ${activeTab === "server" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Server Weights
                </button>
                <button
                    onClick={() => setActiveTab("user")}
                    className={`px-8 py-3 rounded-xl font-black uppercase tracking-tighter italic transition-all ${activeTab === "user" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    User Specific
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "server" ? (
                    <motion.div
                        key="server"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {guildError ? (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                                {guildError}
                            </div>
                        ) : (
                            <GachaConfigEditor guildId={guildId} initialConfig={guildConfig} />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="user"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <UserGachaEditor />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
