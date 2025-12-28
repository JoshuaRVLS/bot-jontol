import { getInventory } from "./Database";
import { ITEMS, ItemModifiers, GameItem } from "./gameItems";

export const getPlayerModifiers = async (userId: string): Promise<ItemModifiers> => {
    const inventory = await getInventory(userId);
    const modifiers: ItemModifiers = {
        workBonus: 0,
        crimeSuccess: 0,
        crimePayout: 0,
        robSuccess: 0,
        robProtection: 0,
        cooldownReduction: 0,
        dailyBonus: 0
    };

    for (const [itemId, amount] of Object.entries(inventory)) {
        const item = ITEMS.find(i => i.id === itemId);
        if (!item || !item.modifiers || amount <= 0) continue;

        // Apply modifiers (multiplied by amount? or just once?)
        // Let's assume most bonuses Stack unless specified, but limited to reasonable amounts.
        // For simplicity: persistent items with modifiers stack up to a certain point.

        if (item.modifiers.workBonus) modifiers.workBonus! += item.modifiers.workBonus * amount;
        if (item.modifiers.crimeSuccess) modifiers.crimeSuccess! += item.modifiers.crimeSuccess * amount;
        if (item.modifiers.crimePayout) modifiers.crimePayout! += item.modifiers.crimePayout * amount;
        if (item.modifiers.robSuccess) modifiers.robSuccess! += item.modifiers.robSuccess * amount;
        if (item.modifiers.robProtection) modifiers.robProtection! += item.modifiers.robProtection * amount;
        if (item.modifiers.cooldownReduction) modifiers.cooldownReduction! += item.modifiers.cooldownReduction * amount;
        if (item.modifiers.dailyBonus) modifiers.dailyBonus! += item.modifiers.dailyBonus * amount;
    }

    // Caps to prevent extreme imbalance
    if (modifiers.cooldownReduction! > 0.9) modifiers.cooldownReduction = 0.9; // Max 90% reduction
    if (modifiers.crimeSuccess! > 0.5) modifiers.crimeSuccess = 0.5; // Max 50% bonus chance
    if (modifiers.robSuccess! > 0.5) modifiers.robSuccess = 0.5;
    if (modifiers.robProtection! > 0.95 && modifiers.robProtection! < 1.0) modifiers.robProtection = 0.95; // Max 95% protection unless it's a hard shield (1.0)

    return modifiers;
};

export const applyBonus = (base: number, bonus: number) => {
    return Math.floor(base * (1 + bonus));
};

export const applyCooldown = (baseMs: number, reduction: number) => {
    return Math.floor(baseMs * (1 - reduction));
};
