"use client";

import { useState } from "react";
import { MessageSquare, Bell, Save, CheckCircle, AlertCircle } from "lucide-react";
import { saveGuildConfig } from "@/app/actions/settings";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
    guildId: string;
    channels: { id: string; name: string }[];
    initialConfig: {
        welcomeChannelId: string | null;
        leaveChannelId: string | null;
        welcomeMessage: string | null;
        leaveMessage: string | null;
    } | null;
}

export const SettingsForm = ({ guildId, channels, initialConfig }: SettingsFormProps) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        welcomeChannelId: initialConfig?.welcomeChannelId || "",
        leaveChannelId: initialConfig?.leaveChannelId || "",
        welcomeMessage: initialConfig?.welcomeMessage || "Selamat datang {user} di {server}!",
        leaveMessage: initialConfig?.leaveMessage || "{user} baru aja cabut dari {server}. Sedih banget."
    });

    const handleSave = async () => {
        setLoading(true);
        const result = await saveGuildConfig(guildId, formData);

        setLoading(false);
        if (result.success) {
            toast("Pengaturan berhasil disimpan!", "success");
        } else {
            toast("Gagal menyimpan. Coba lagi nanti.", "error");
        }
    };

    return (
        <div className="space-y-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Welcome Settings */}
                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <MessageSquare className="text-primary" />
                        Auto Welcome
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Welcome Channel</label>
                            <select
                                value={formData.welcomeChannelId}
                                onChange={(e) => setFormData({ ...formData, welcomeChannelId: e.target.value })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">--- Pilih Channel ---</option>
                                {channels.map(c => (
                                    <option key={c.id} value={c.id}># {c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Custom Welcome Message
                                <span className="block text-[10px] text-primary/60 font-mono mt-1">Gunakan {"{user}"} dan {"{server}"}</span>
                            </label>
                            <textarea
                                rows={4}
                                value={formData.welcomeMessage}
                                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Leave Settings */}
                <div className="glass-card p-8 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Bell className="text-primary" />
                        Auto Leave
                    </h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">Leave Channel</label>
                            <select
                                value={formData.leaveChannelId}
                                onChange={(e) => setFormData({ ...formData, leaveChannelId: e.target.value })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">--- Pilih Channel ---</option>
                                {channels.map(c => (
                                    <option key={c.id} value={c.id}># {c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Custom Leave Message
                                <span className="block text-[10px] text-primary/60 font-mono mt-1">Gunakan {"{user}"} dan {"{server}"}</span>
                            </label>
                            <textarea
                                rows={4}
                                value={formData.leaveMessage}
                                onChange={(e) => setFormData({ ...formData, leaveMessage: e.target.value })}
                                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={cn(
                        "glow-btn bg-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 min-w-[200px] justify-center transition-all",
                        loading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <Save size={20} />
                            Simpan Perubahan
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
