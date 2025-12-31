export type CaseType = "highroller" | "elite" | "sultan" | "godtier";

export interface CaseConfig {
    id: CaseType;
    name: string;
    cost: number;
    description: string;
    weights: Record<string, number>;
}

export const CASE_CONFIGS: Record<CaseType, CaseConfig> = {
    highroller: {
        id: "highroller",
        name: "Standard Case",
        cost: 100000,
        description: "Standard tier. Min: Rp 20k - 60k (Mil-Spec). Target: Restricted (75k+).",
        weights: {
            "mil-spec": 4500,
            "restricted": 3500,
            "classified": 1500,
            "covert": 400,
            "extraordinary": 100,
        }
    },
    elite: {
        id: "elite",
        name: "Special Case",
        cost: 500000,
        description: "Premium tier. Min: Rp 75k - 250k (Restricted). Target: Classified (350k+).",
        weights: {
            "restricted": 4000,
            "classified": 4500,
            "covert": 1300,
            "extraordinary": 200,
        }
    },
    sultan: {
        id: "sultan",
        name: "Omega Case",
        cost: 2000000,
        description: "God-tier. Min: Rp 350k - 1.1M (Classified). Target: Covert (2M+).",
        weights: {
            "classified": 5000,
            "covert": 4000,
            "extraordinary": 1000,
        }
    },
    godtier: {
        id: "godtier",
        name: "Kasta Tuhan",
        cost: 5000000000,
        description: "The divine choice. Chance for Gold is extremely high.",
        weights: {
            "covert": 2000,
            "extraordinary": 8000,
        }
    }
};

export const getWeightedSkin = (skins: any[], caseType: CaseType = "highroller", pityCount: number = 0, customWeights?: any, streak: number = 0) => {
    const weights = customWeights?.[caseType] ? { ...customWeights[caseType] } : { ...CASE_CONFIGS[caseType].weights };

    const pityMultiplier = 1 + (pityCount * 0.08);

    // Streak Logic: Freshness vs Greed
    let streakMultiplier = 1;
    if (streak < 5) {
        // Freshness Boost (Kasih menang dulu)
        streakMultiplier = 1.3; // 30% boost chance
    } else if (streak >= 15) {
        // Greed Penalty (Nafsu kalahin) - starts at 15
        const penaltyFactor = Math.min(0.7, (streak - 15) * 0.05);
        streakMultiplier = Math.max(0.3, 1 - penaltyFactor);
    }

    if (weights["covert"]) weights["covert"] = Math.floor(weights["covert"] * pityMultiplier);
    if (weights["extraordinary"]) weights["extraordinary"] = Math.floor(weights["extraordinary"] * pityMultiplier);

    // Apply Streak Multiplier
    const highTiers = ["restricted", "classified", "covert", "extraordinary"];
    highTiers.forEach(tier => {
        if (weights[tier]) {
            weights[tier] = Math.floor(weights[tier] * streakMultiplier);
        }
    });

    const totalWeight = Object.values(weights).reduce((a, b) => (a as number) + (b as number), 0) as number;
    const random = Math.floor(Math.random() * totalWeight);

    let currentSum = 0;
    let targetRarity = "consumer";

    for (const [rarity, weight] of Object.entries(weights)) {
        currentSum += weight as number;
        if (random <= currentSum) {
            targetRarity = rarity;
            break;
        }
    }

    const possibleSkins = skins.filter(s => {
        const r = s.rarity?.name?.toLowerCase() || "";
        if (targetRarity === "extraordinary") {
            return r.includes("extraordinary") || r.includes("gold") || r.includes("contraband");
        }
        return r.includes(targetRarity);
    });

    if (possibleSkins.length === 0) {
        const lowestRarity = Object.keys(weights)[0];
        const fallbackSkins = skins.filter(s => s.rarity?.name?.toLowerCase()?.includes(lowestRarity));

        if (fallbackSkins.length > 0) {
            return fallbackSkins[Math.floor(Math.random() * fallbackSkins.length)];
        }
        return skins[Math.floor(Math.random() * skins.length)];
    }

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
    let basePrice = 500;

    if (r.includes("industrial")) basePrice = 3000 + Math.random() * 8000; // 3k - 11k
    else if (r.includes("mil-spec")) basePrice = 20000 + Math.random() * 40000; // 20k - 60k
    else if (r.includes("restricted")) basePrice = 75000 + Math.random() * 175000; // 75k - 250k
    else if (r.includes("classified")) basePrice = 350000 + Math.random() * 750000; // 350k - 1.1M
    else if (r.includes("covert")) basePrice = 2000000 + Math.random() * 5000000; // 2M - 7M
    else if (r.includes("contraband") || r.includes("extraordinary") || r.includes("gold")) {
        basePrice = 15000000 + Math.random() * 35000000; // 15M - 50M
    } else {
        basePrice = 1000 + Math.random() * 2000; // 1k - 3k
    }

    const wearMultiplier = 1.5 - (float * 0.8);
    return Math.floor(basePrice * wearMultiplier);
};
