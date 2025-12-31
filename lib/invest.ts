export interface MarketAssetConfig {
    id: string;
    name: string;
    type: "crypto" | "stock";
    basePrice: number;
    volatility: number;
}

export const ASSET_CONFIGS: MarketAssetConfig[] = [
    { id: "BTC", name: "Bitcoin", type: "crypto", basePrice: 1500000000, volatility: 0.15 },
    { id: "ETH", name: "Ethereum", type: "crypto", basePrice: 40000000, volatility: 0.12 },
    { id: "SOL", name: "Solana", type: "crypto", basePrice: 2000000, volatility: 0.20 },
    { id: "GOTO", name: "GoTo Gojek Tokopedia", type: "stock", basePrice: 50, volatility: 0.08 },
    { id: "BBCA", name: "Bank Central Asia", type: "stock", basePrice: 10000, volatility: 0.03 },
    { id: "TLKM", name: "Telkom Indonesia", type: "stock", basePrice: 3000, volatility: 0.04 },
    { id: "ASII", name: "Astra International", type: "stock", basePrice: 5000, volatility: 0.05 },
];

export const getTrendColor = (current: number, last: number) => {
    if (last === 0 || current === last) return "text-muted-foreground";
    return current > last ? "text-emerald-400" : "text-red-400";
};

export const calculateProfit = (currentPrice: number, avgBuyPrice: number, amount: number) => {
    const cost = avgBuyPrice * amount;
    const value = currentPrice * amount;
    return value - cost;
};

export const formatAssetAmount = (amount: number) => {
    if (amount >= 1) return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
    return amount.toLocaleString(undefined, { maximumFractionDigits: 8 });
};
