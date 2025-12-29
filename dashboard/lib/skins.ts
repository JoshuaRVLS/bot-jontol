const API_URL = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json";

let skinsCache: any[] | null = null;

export const getSkins = async () => {
    if (skinsCache) return skinsCache;

    try {
        const response = await fetch(API_URL);
        skinsCache = await response.json();
        return skinsCache;
    } catch (error) {
        console.error("Failed to fetch skins", error);
        return [];
    }
};
