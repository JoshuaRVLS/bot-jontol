/**
 * CS:GO Rarity Weights (Approximate to Valve's real odds)
 * Consumer: 70%
 * Industrial: 15%
 * Mil-Spec: 10%
 * Restricted: 3.5%
 * Classified: 1.2%
 * Covert: 0.25%
 * Extraordinary/Gold: 0.05%
 */
const RARITY_WEIGHTS: Record<string, number> = {
    "consumer": 4000,      // Down from 7000 (Fairer odds)
    "industrial": 2500,    // Up from 1500
    "mil-spec": 1800,      // Up from 1000
    "restricted": 1000,    // Up from 350
    "classified": 500,     // Up from 120
    "covert": 150,         // Up from 25
    "extraordinary": 30,   // Up from 5
    "contraband": 10,       // Up from 1
    "rare special": 20,    // Up from 4 (More knives!)
};

export const getWeightedSkin = (skins: any[]) => {
    const totalWeight = Object.values(RARITY_WEIGHTS).reduce((a, b) => a + b, 0);
    const random = Math.floor(Math.random() * totalWeight);

    // Determine target rarity
    let currentSum = 0;
    let targetRarity = "consumer";

    for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
        currentSum += weight;
        if (random <= currentSum) {
            targetRarity = rarity;
            break;
        }
    }

    // Filter skins by target rarity
    const possibleSkins = skins.filter(s => {
        const r = s.rarity?.name?.toLowerCase() || "";
        return r.includes(targetRarity);
    });

    // Fallback if no skins match (unlikely but possible with API changes)
    if (possibleSkins.length === 0) return skins[Math.floor(Math.random() * skins.length)];

    return possibleSkins[Math.floor(Math.random() * possibleSkins.length)];
};

export const getSkinFloat = (): { float: number, wear: string } => {
    const float = Math.random();
    let wear = "Battle-Scarred";

    if (float < 0.07) wear = "Factory New";
    else if (float < 0.15) wear = "Minimal Wear";
    else if (float < 0.38) wear = "Field-Tested";
    else if (float < 0.45) wear = "Well-Worn";

    return { float: parseFloat(float.toFixed(5)), wear };
};

export const getSkinPrice = (rarityName: string, float: number): number => {
    const r = rarityName.toLowerCase();
    let basePrice = 1000;

    if (r.includes("industrial")) basePrice = 10000 + Math.random() * 40000;
    else if (r.includes("mil-spec")) basePrice = 50000 + Math.random() * 100000;
    else if (r.includes("restricted")) basePrice = 150000 + Math.random() * 350000;
    else if (r.includes("classified")) basePrice = 500000 + Math.random() * 1500000;
    else if (r.includes("covert")) basePrice = 2000000 + Math.random() * 8000000;
    else if (r.includes("contraband") || r.includes("extraordinary") || r.includes("gold") || r.includes("rare special")) {
        basePrice = 10000000 + Math.random() * 90000000;
    } else {
        basePrice = 1000 + Math.random() * 9000;
    }

    // Wear Multiplier (Cleaner = More Expensive)
    // 0.0 (FN) to 1.0 (BS)
    // Mult: 1.5x (FN) down to 0.5x (BS)
    const wearMultiplier = 1.5 - (float * 1.0);

    return Math.floor(basePrice * wearMultiplier);
};
