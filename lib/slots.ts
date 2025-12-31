export type SymbolID = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SlotSymbol {
    id: SymbolID;
    name: string;
    multiplier: number[]; // Payout for 3, 4, 5 matches
    weight: number; // For weighted RNG
}

/*
    Weights (Total ~1000):
    0: Cherry (Common)
    1: Lemon
    2: Orange
    3: Plum
    4: Bell
    5: Bar
    6: 7 (Seven)
    7: Diamond (Rare)
    8: Wild (Special)
*/

export const SYMBOLS: SlotSymbol[] = [
    { id: 0, name: "Cherry", multiplier: [0, 0, 5, 20, 100], weight: 250 }, // Very Common
    { id: 1, name: "Lemon", multiplier: [0, 0, 10, 30, 150], weight: 200 },
    { id: 2, name: "Orange", multiplier: [0, 0, 15, 50, 200], weight: 180 },
    { id: 3, name: "Plum", multiplier: [0, 0, 20, 60, 300], weight: 150 },
    { id: 4, name: "Bell", multiplier: [0, 0, 25, 80, 400], weight: 100 },
    { id: 5, name: "Bar", multiplier: [0, 0, 30, 100, 500], weight: 60 },
    { id: 6, name: "Seven", multiplier: [0, 0, 50, 200, 1000], weight: 40 },
    { id: 7, name: "Diamond", multiplier: [0, 0, 100, 500, 2500], weight: 15 },
    { id: 8, name: "Wild", multiplier: [0, 0, 100, 500, 2500], weight: 5 },
];

export const FINAL_PAYLINES = [
    [5, 6, 7, 8, 9],       // Line 1: Middle
    [0, 1, 2, 3, 4],       // Line 2: Top
    [10, 11, 12, 13, 14],  // Line 3: Bottom
    [0, 6, 12, 8, 4],      // Line 4: V
    [10, 6, 0, 8, 14],     // Line 5: ^
    [5, 0, 5, 10, 5],      // Line 6: Vertical alternating
    [0, 1, 7, 13, 14],     // Line 7: Zigzag down
    [10, 11, 7, 3, 4],     // Line 8: Zigzag up
    [5, 1, 7, 13, 9],      // Line 9: M-ish
    [5, 11, 7, 3, 9],      // Line 10: W-ish
];
