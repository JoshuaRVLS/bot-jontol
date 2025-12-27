// Define game items, prices, and properties
export interface GameItem {
    id: string;
    emoji: string;
    name: string;
    price: number;
    description: string;
    type: "collectible" | "tool" | "defense";
}

export const ITEMS: GameItem[] = [
    {
        id: "shield",
        emoji: "🛡️",
        name: "Preman Kampung (Shield)",
        price: 5000,
        description: "Melindungi dompet lu dari maling (1x pakai, 50% chance break).",
        type: "defense"
    },
    {
        id: "laptop",
        emoji: "💻",
        name: "Laptop Gaming",
        price: 15000000,
        description: "Benda wajib buat flexing.",
        type: "collectible"
    },
    {
        id: "lockpick",
        emoji: "🗝️",
        name: "Alat Maling (Lockpick)",
        price: 2000,
        description: "Nambah peluang sukses rob (+10%).",
        type: "tool"
    }
];

export const getItem = (id: string) => ITEMS.find(i => i.id === id);
