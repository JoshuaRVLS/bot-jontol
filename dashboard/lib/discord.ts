export interface DiscordGuild {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    features: string[];
}

const ADMIN_PERMISSION = BigInt(0x8);
const MANAGE_GUILD = BigInt(0x20);

export const fetchUserGuilds = async (accessToken: string): Promise<DiscordGuild[]> => {
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch guilds");
    }

    return response.json();
};

export const hasAdminPermission = (permissions: string): boolean => {
    return (BigInt(permissions) & ADMIN_PERMISSION) === ADMIN_PERMISSION;
};

export const hasManageGuildPermission = (permissions: string): boolean => {
    const perms = BigInt(permissions);
    return (perms & ADMIN_PERMISSION) === ADMIN_PERMISSION || (perms & MANAGE_GUILD) === MANAGE_GUILD;
};

export const checkGuildPermissions = async (accessToken: string, guildId: string): Promise<{
    isAdmin: boolean;
    canManageGuild: boolean;
}> => {
    try {
        const guilds = await fetchUserGuilds(accessToken);
        const guild = guilds.find(g => g.id === guildId);

        if (!guild) {
            return { isAdmin: false, canManageGuild: false };
        }

        const perms = BigInt(guild.permissions);
        return {
            isAdmin: (perms & ADMIN_PERMISSION) === ADMIN_PERMISSION,
            canManageGuild: (perms & ADMIN_PERMISSION) === ADMIN_PERMISSION || (perms & MANAGE_GUILD) === MANAGE_GUILD,
        };
    } catch (error) {
        console.error("[Discord] Permission check error:", error);
        return { isAdmin: false, canManageGuild: false };
    }
};
