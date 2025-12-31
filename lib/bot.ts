interface BotStats {
    uptime: number;
    guilds: number;
    users: number;
    readyTimestamp: number;
}

interface GuildLiveData {
    id: string;
    name: string;
    memberCount: number;
    onlineMembers: number;
    channels: { id: string; name: string }[];
}

export const getBotStats = async (): Promise<BotStats | null> => {
    return null;
};

export const getGuildLiveData = async (guildId: string): Promise<GuildLiveData | null> => {
    return null;
};
