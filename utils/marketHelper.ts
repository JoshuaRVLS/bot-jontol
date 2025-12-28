import { getMarketAssets, initMarketAsset, updateMarketAsset, getMarketAsset } from "./Database";

export interface Asset {
    id: string;
    name: string;
    type: "crypto" | "stock";
    basePrice: number;
    volatility: number; // 0.05 = 5% max change
}

const ASSET_CONFIG: Asset[] = [
    { id: "BTC", name: "Bitcoin", type: "crypto", basePrice: 1500000000, volatility: 0.15 },
    { id: "ETH", name: "Ethereum", type: "crypto", basePrice: 40000000, volatility: 0.12 },
    { id: "SOL", name: "Solana", type: "crypto", basePrice: 2000000, volatility: 0.20 },
    { id: "GOTO", name: "GoTo Gojek Tokopedia", type: "stock", basePrice: 50, volatility: 0.08 },
    { id: "BBCA", name: "Bank Central Asia", type: "stock", basePrice: 10000, volatility: 0.03 },
    { id: "TLKM", name: "Telkom Indonesia", type: "stock", basePrice: 3000, volatility: 0.04 },
    { id: "ASII", name: "Astra International", type: "stock", basePrice: 5000, volatility: 0.05 },
];

export const initializeMarket = async () => {
    for (const asset of ASSET_CONFIG) {
        await initMarketAsset(asset.id, asset.name, asset.type, asset.basePrice);
    }
};

export const updateMarketPrices = async () => {
    const assets = await getMarketAssets();
    if (assets.length === 0) {
        await initializeMarket();
        return;
    }

    const newestUpdate = Math.max(...assets.map(a => a.updatedAt.getTime()));
    if (Date.now() - newestUpdate < 5 * 60 * 1000) return;

    // Random Event Logic (5% chance)
    const eventRoll = Math.random();
    let multiplier = 1;
    let eventMsg = "";

    if (eventRoll < 0.02) {
        multiplier = 3; // Mega Bull/Bear
        eventMsg = "🚨 **MARKET KRISIS!** Volatilitas naik drastis!";
    } else if (eventRoll < 0.05) {
        multiplier = 2;
        eventMsg = "⚡ **VOLATILITY SPIKE!** Pasar lagi rame!";
    }

    for (const asset of assets) {
        const config = ASSET_CONFIG.find(a => a.id === asset.id);
        if (!config) continue;

        const maxChange = asset.price * config.volatility * multiplier;
        const change = (Math.random() * 2 - 1) * maxChange;
        let newPrice = asset.price + change;

        // Ensure price doesn't go below almost zero
        if (newPrice < config.basePrice * 0.1) newPrice = config.basePrice * 0.1;

        await updateMarketAsset(asset.id, {
            price: newPrice,
            lastPrice: asset.price
        });
    }

    return eventMsg;
};

export const getPriceTrend = (current: number, last: number) => {
    if (last === 0) return "Neutral";
    const change = ((current - last) / last) * 100;
    const arrow = change >= 0 ? "📈" : "📉";
    return `${arrow} ${change.toFixed(2)}%`;
};
