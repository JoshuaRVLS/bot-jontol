export type CaseType = "budget" | "classic" | "highroller" | "elite" | "sultan";

export interface CaseConfig {
    name: string;
    cost: number;
    description: string;
    weights: Record<string, number>;
}

export const CASE_CONFIGS: Record<CaseType, CaseConfig> = {
    budget: {
        name: "Kasta Najis",
        cost: 15000,
        description: "Case murah dengan peluang item consumer grade yang tinggi.",
        weights: {
            "consumer": 8000,
            "industrial": 1500,
            "mil-spec": 450,
            "restricted": 45,
            "classified": 4,
            "covert": 1,
        }
    },
    classic: {
        name: "Kasta Rendah",
        cost: 100000,
        description: "Case standar dengan odds yang mirip dengan official CS:GO.",
        weights: {
            "consumer": 7500,
            "industrial": 1500,
            "mil-spec": 800,
            "restricted": 150,
            "classified": 40,
            "covert": 8,
            "extraordinary": 1,
            "rare special": 1,
        }
    },
    highroller: {
        name: "Kasta Menengah Kebawah",
        cost: 1000000,
        description: "Minimal drop Mil-Spec. Peluang item langka lebih tinggi.",
        weights: {
            "mil-spec": 8000,
            "restricted": 1500,
            "classified": 400,
            "covert": 80,
            "extraordinary": 10,
            "rare special": 10,
        }
    },
    elite: {
        name: "Kasta Tinggi",
        cost: 10000000,
        description: "Case eksklusif dengan drop minimal item Classified.",
        weights: {
            "classified": 8500,
            "covert": 1400,
            "extraordinary": 50,
            "rare special": 50,
        }
    },
    sultan: {
        name: "Kasta Sultan",
        cost: 100000000,
        description: "High risk high reward. 10% chance JACKPOT, 90% chance rugi.",
        weights: {
            "covert": 9000, // 90% - mostly loss
            "extraordinary": 500, // 5% - jackpot
            "rare special": 500, // 5% - jackpot
        }
    }
};

export const getWeightedSkin = (skins: any[], caseType: CaseType = "classic", pityCount: number = 0) => {
    const weights = { ...CASE_CONFIGS[caseType].weights };

    // Apply pity: increase weights for Rare items
    // Every 1 pity count increases rare odds by 5% (multiplicative)
    const pityMultiplier = 1 + (pityCount * 0.05);

    if (weights["covert"]) weights["covert"] = Math.floor(weights["covert"] * pityMultiplier);
    if (weights["extraordinary"]) weights["extraordinary"] = Math.floor(weights["extraordinary"] * pityMultiplier);
    if (weights["rare special"]) weights["rare special"] = Math.floor(weights["rare special"] * pityMultiplier);

    const totalWeight = Object.values(weights).reduce((a, b) => (a as number) + (b as number), 0) as number;
    const random = Math.floor(Math.random() * totalWeight);

    // Determine target rarity
    let currentSum = 0;
    let targetRarity = "consumer";

    for (const [rarity, weight] of Object.entries(weights)) {
        currentSum += weight as number;
        if (random <= currentSum) {
            targetRarity = rarity;
            break;
        }
    }

    // Filter skins by target rarity
    const possibleSkins = skins.filter(s => {
        const r = s.rarity?.name?.toLowerCase() || "";
        // Special mapping for gold/knives
        if (targetRarity === "rare special" || targetRarity === "extraordinary") {
            return r.includes("extraordinary") || r.includes("gold") || r.includes("rare special");
        }
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

    if (r.includes("industrial")) basePrice = 5000 + Math.random() * 15000;
    else if (r.includes("mil-spec")) basePrice = 20000 + Math.random() * 80000;
    else if (r.includes("restricted")) basePrice = 100000 + Math.random() * 400000;
    else if (r.includes("classified")) basePrice = 2000000 + Math.random() * 8000000; // 2M - 10M
    else if (r.includes("covert")) basePrice = 15000000 + Math.random() * 70000000; // 15M - 85M (avg 50M, mostly loss on Sultan)
    else if (r.includes("contraband") || r.includes("extraordinary") || r.includes("gold") || r.includes("rare special")) {
        basePrice = 300000000 + Math.random() * 700000000; // 300M - 1B JACKPOT!
    } else {
        basePrice = 500 + Math.random() * 4500;
    }

    // Wear Multiplier (Cleaner = More Expensive)
    // 0.0 (FN) to 1.0 (BS)
    // Mult: 1.5x (FN) down to 0.5x (BS)
    const wearMultiplier = 1.5 - (float * 1.0);

    return Math.floor(basePrice * wearMultiplier);
};
