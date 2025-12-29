import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import {
    Terminal,
    Wallet,
    Gamepad2,
    Shield,
    Music,
    Gift,
    TrendingUp,
    Settings,
    Search,
    Package
} from "lucide-react";

const CATEGORY_ICONS: Record<string, any> = {
    economy: Wallet,
    gambling: Gamepad2,
    fun: Gamepad2,
    moderation: Shield,
    music: Music,
    giveaway: Gift,
    leveling: TrendingUp,
    admin: Settings,
    utility: Terminal
};

const CATEGORY_COLORS: Record<string, string> = {
    economy: "text-amber-400",
    gambling: "text-rose-400",
    fun: "text-pink-400",
    moderation: "text-red-400",
    music: "text-purple-400",
    giveaway: "text-emerald-400",
    leveling: "text-blue-400",
    admin: "text-gray-400",
    utility: "text-cyan-400"
};

async function getDynamicCommands() {
    // Path to the bot's commands directory (one level up from dashboard)
    const commandsPath = path.join(process.cwd(), "..", "commands");

    if (!fs.existsSync(commandsPath)) {
        console.warn("Commands directory not found at:", commandsPath);
        return [];
    }

    const categories = fs.readdirSync(commandsPath).filter(f => fs.statSync(path.join(commandsPath, f)).isDirectory());

    const allCategories = categories.map(cat => {
        const catPath = path.join(commandsPath, cat);
        const files = fs.readdirSync(catPath).filter(f => f.endsWith(".ts"));

        const commands = files.map(file => {
            const filePath = path.join(catPath, file);
            const content = fs.readFileSync(filePath, "utf-8");

            // Extract name and description using regex
            const nameMatch = content.match(/\.setName\("([^"]+)"\)/) || content.match(/name:\s*"([^"]+)"/);
            const descMatch = content.match(/\.setDescription\("([^"]+)"\)/) || content.match(/description:\s*"([^"]+)"/);

            return {
                name: nameMatch ? `/${nameMatch[1]}` : `/${path.basename(file, ".ts")}`,
                description: descMatch ? descMatch[1] : "Gak ada deskripsi bang."
            };
        });

        return {
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            slug: cat,
            icon: CATEGORY_ICONS[cat] || Package,
            color: CATEGORY_COLORS[cat] || "text-primary",
            commands
        };
    });

    return allCategories;
}

export default async function CommandsPage({ params }: { params: Promise<{ guildId: string }> }) {
    const { guildId } = await params;
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    const categories = await getDynamicCommands();

    return (
        <div className="space-y-10">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <Terminal className="text-primary" />
                        Bot Commands
                    </h2>
                    <p className="text-muted-foreground mt-1">Daftar lengkap perintah real-time dari kodingan bot JONTOL.</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Cari perintah..."
                        className="bg-muted/30 border border-border rounded-2xl pl-10 pr-4 py-3 min-w-[300px] focus:outline-none focus:border-primary transition-all"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map((category) => (
                    <div key={category.name} className="glass-card p-8 rounded-3xl space-y-6">
                        <header className="flex items-center gap-3">
                            <div className={`p-3 rounded-2xl bg-muted/50 ${category.color}`}>
                                <category.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold">{category.name}</h3>
                        </header>

                        <div className="grid grid-cols-1 gap-3">
                            {category.commands.map((cmd) => (
                                <div key={cmd.name} className="p-4 bg-muted/20 hover:bg-muted/40 border border-border/50 rounded-2xl transition-all group">
                                    <div className="flex items-center justify-between mb-1">
                                        <code className="text-primary font-bold">{cmd.name}</code>
                                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Real Command</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {cmd.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
