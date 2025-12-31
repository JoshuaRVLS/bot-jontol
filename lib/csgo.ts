export type CaseType = "budget" | "classic" | "highroller" | "elite" | "sultan";

export interface CaseConfig {
    id: CaseType;
    name: string;
    cost: number;
    description: string;
    weights: Record<string, number>;
}

export const CASE_CONFIGS: Record<CaseType, CaseConfig> = {
    budget: {
        id: "budget",
        name: "Kasta Najis",
        cost: 5000,
        description: "Case murah buat yang bokek. Mostly sampah tapi kadang ada hoki.",
        weights: {
            "consumer": 6000,
            "industrial": 2500,
            "mil-spec": 1200,
            "restricted": 250,
            "classified": 40,
            "covert": 10,
        }
    },
    classic: {
        id: "classic",
        name: "Kasta Rendah",
        cost: 25000,
        description: "Case standar dengan odds yang balanced.",
        weights: {
            "consumer": 5000,
            "industrial": 2500,
            "mil-spec": 1500,
            "restricted": 700,
            "classified": 250,
            "covert": 45,
            "extraordinary": 5,
        }
    },
    highroller: {
        id: "highroller",
        name: "Kasta Menengah",
        cost: 100000,
        description: "Minimal drop Mil-Spec. Peluang item langka lebih tinggi.",
        weights: {
            "mil-spec": 5000,
            "restricted": 3000,
            "classified": 1500,
            "covert": 400,
            "extraordinary": 100,
        }
    },
    elite: {
        id: "elite",
        name: "Kasta Tinggi",
        cost: 500000,
        description: "Case premium dengan drop minimal Restricted.",
        weights: {
            "restricted": 5000,
            "classified": 3500,
            "covert": 1300,
            "extraordinary": 200,
        }
    },
    sultan: {
        id: "sultan",
        name: "Kasta Sultan",
        cost: 2000000,
        description: "Case terbaik. Minimal Classified dengan peluang jackpot tinggi.",
        weights: {
            "classified": 5500,
            "covert": 3500,
            "extraordinary": 1000,
        }
    }
};

export const getWeightedSkin = (skins: any[], caseType: CaseType = "classic", pityCount: number = 0, customWeights?: any) => {
    const weights = customWeights?.[caseType] ? { ...customWeights[caseType] } : { ...CASE_CONFIGS[caseType].weights };

    const pityMultiplier = 1 + (pityCount * 0.08);

    if (weights["covert"]) weights["covert"] = Math.floor(weights["covert"] * pityMultiplier);
    if (weights["extraordinary"]) weights["extraordinary"] = Math.floor(weights["extraordinary"] * pityMultiplier);

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
    let basePrice = 500;

    if (r.includes("industrial")) basePrice = 2000 + Math.random() * 3000;
    else if (r.includes("mil-spec")) basePrice = 8000 + Math.random() * 17000;
    else if (r.includes("restricted")) basePrice = 30000 + Math.random() * 70000;
    else if (r.includes("classified")) basePrice = 150000 + Math.random() * 350000;
    else if (r.includes("covert")) basePrice = 800000 + Math.random() * 1200000;
    else if (r.includes("contraband") || r.includes("extraordinary") || r.includes("gold")) {
        basePrice = 5000000 + Math.random() * 15000000;
    } else {
        basePrice = 300 + Math.random() * 1200;
    }

    const wearMultiplier = 1.5 - (float * 0.8);
    return Math.floor(basePrice * wearMultiplier);
};
