export const getBotStats = async () => {
    try {
        const response = await fetch("http://localhost:4000/api/stats", {
            headers: {
                "x-api-key": process.env.OPENROUTER_KEY || "09071982" // Temporary fallback for internal dev
            },
            next: { revalidate: 30 } // Cache for 30 seconds
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
        const response = await fetch(`http://localhost:4000/api/guild/${guildId}`, {
            headers: {
                "x-api-key": process.env.OPENROUTER_KEY || "09071982"
            },
            next: { revalidate: 10 } // Cache for 10 seconds
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
