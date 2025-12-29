const BOT_API_URL = process.env.BOT_API_URL || "http://localhost:8000";

export const getBotStats = async () => {
    try {
        const response = await fetch(`${BOT_API_URL}/api/stats`, {
            headers: {
                "x-api-key": process.env.OPENROUTER_KEY || "09071982"
            },
            next: { revalidate: 30 }
        });

        if (!response.ok) {
            console.warn(`[BotAPI] Stats fetch failed with status: ${response.status}`);
            return null;
        }
        return response.json();
    } catch (error) {
        console.error("[BotAPI] Failed to connect to bot stats API:", error);
        return null;
    }
};

export const getGuildLiveData = async (guildId: string) => {
    try {
        const response = await fetch(`${BOT_API_URL}/api/guild/${guildId}`, {
            headers: {
                "x-api-key": process.env.OPENROUTER_KEY || "09071982"
            },
            next: { revalidate: 10 }
        });

        if (!response.ok) {
            console.warn(`[BotAPI] Guild live data fetch failed with status: ${response.status} for guild ${guildId}`);
            return null;
        }
        return response.json();
    } catch (error) {
        console.error(`[BotAPI] Failed to connect for guild ${guildId}:`, error);
        return null;
    }
};
