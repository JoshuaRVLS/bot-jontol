import prisma from "./Database";

export const TICK_INTERVAL = 30 * 1000; // 30 seconds
const MAX_HISTORY = 50;

/**
 * Simulates a realistic market movement for all assets.
 */
export const updateMarketPrices = async () => {
    const assets = await prisma.marketAsset.findMany();

    for (const asset of assets) {
        let currentPrice = asset.price;
        let history = [...((asset as any).priceHistory as number[] || [])];

        // Seed initial history if empty
        if (history.length === 0) {
            console.log(`[Market] Seeding initial history for ${asset.id}`);
            for (let i = 0; i < MAX_HISTORY; i++) {
                const noise = (Math.random() * 0.1) - 0.05; // -5% to +5%
                history.push(parseFloat((currentPrice * (1 + noise)).toFixed(2)));
            }
        }

        const volatility = (asset as any).volatility || 0.08;

        const randomWalk = (Math.random() * 2) - 1;
        const changePercent = randomWalk * volatility;

        let newPrice = currentPrice * (1 + changePercent);

        if (newPrice < 1) newPrice = 1 + Math.random();

        history.push(currentPrice);
        if (history.length > MAX_HISTORY) history.shift();

        await (prisma.marketAsset as any).update({
            where: { id: asset.id },
            data: {
                price: parseFloat(newPrice.toFixed(2)),
                lastPrice: currentPrice,
                priceHistory: history,
                updatedAt: new Date()
            }
        });
    }
};

/**
 * Starts the automated market background process.
 */
export const startMarketSimulation = () => {
    console.log("[Market] Starting realistic simulation (Tick: 30s)");
    setInterval(updateMarketPrices, TICK_INTERVAL);
};
