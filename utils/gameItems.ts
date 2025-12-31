export interface ItemModifiers {
    workBonus?: number;
    crimeSuccess?: number;
    crimePayout?: number;
    robSuccess?: number;
    robProtection?: number;
    cooldownReduction?: number;
    dailyBonus?: number;
}

export interface GameItem {
    id: string;
    name: string;
    price: number;
    description: string;
    type: "collectible" | "tool" | "defense" | "consumable" | "weapon" | "vehicle" | "pet" | "rare" | "legendary";
    skill?: string;
    modifiers?: ItemModifiers;
}

export const ITEMS: GameItem[] = [
    // === DEFENSE ===
    { id: "shield", name: "Preman Kampung", price: 5000, description: "Melindungi dari pencurian (1x pakai).", type: "defense", skill: "Auto-block robbery", modifiers: { robProtection: 1.0 } },
    { id: "bodyguard", name: "Bodyguard Elite", price: 50000, description: "Perlindungan maksimal.", type: "defense", skill: "+20% Rob Protection", modifiers: { robProtection: 0.2 } },
    { id: "bunker", name: "Bunker Rahasia", price: 500000, description: "Tempat aman untuk harta.", type: "defense", skill: "+50% Rob Protection", modifiers: { robProtection: 0.5 } },
    { id: "alarm", name: "Alarm Anti-Maling", price: 15000, description: "Notifikasi jika ada yang rob.", type: "defense", skill: "+5% Rob Protection", modifiers: { robProtection: 0.05 } },
    { id: "cctv", name: "CCTV 4K", price: 25000, description: "Rekam aktivitas mencurigakan.", type: "defense", skill: "+10% Rob Protection", modifiers: { robProtection: 0.1 } },

    // === TOOLS ===
    { id: "lockpick", name: "Alat Maling", price: 2000, description: "+10% sukses rob.", type: "tool", skill: "+10% Rob Success", modifiers: { robSuccess: 0.1 } },
    { id: "hackertool", name: "Hacker Kit", price: 75000, description: "Bypass keamanan digital.", type: "tool", skill: "+15% Crime Success", modifiers: { crimeSuccess: 0.15 } },
    { id: "disguise", name: "Penyamaran Pro", price: 30000, description: "Kurangin chance ketangkep.", type: "tool", skill: "+10% Crime Success", modifiers: { crimeSuccess: 0.1 } },
    { id: "scanner", name: "Money Scanner", price: 20000, description: "Lihat wallet orang.", type: "tool", skill: "+5% Rob Success", modifiers: { robSuccess: 0.05 } },
    { id: "drillkit", name: "Drill Kit Pro", price: 100000, description: "Buka brankas.", type: "tool", skill: "+20% Crime Success", modifiers: { crimeSuccess: 0.2 } },
    { id: "fishingrod", name: "Joran Emas", price: 45000, description: "Mancing ikan langka.", type: "tool", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "pickaxe", name: "Pickaxe Diamond", price: 80000, description: "Tambang lebih cepat.", type: "tool", skill: "+15% Work Bonus", modifiers: { workBonus: 0.15 } },
    { id: "magnet", name: "Magnet Uang", price: 60000, description: "Tarik koin.", type: "tool", skill: "+5% Daily Bonus", modifiers: { dailyBonus: 0.05 } },

    // === WEAPONS ===
    { id: "knife", name: "Pisau Dapur", price: 5000, description: "Senjata basic.", type: "weapon", skill: "+5% Rob Success", modifiers: { robSuccess: 0.05 } },
    { id: "katana", name: "Katana Samurai", price: 150000, description: "Senjata legendaris.", type: "weapon", skill: "+20% Rob Success", modifiers: { robSuccess: 0.2 } },
    { id: "gun", name: "Water Gun", price: 10000, description: "Untuk main-main aja.", type: "weapon", skill: "+2% Rob Success", modifiers: { robSuccess: 0.02 } },
    { id: "bat", name: "Tongkat Baseball", price: 25000, description: "Favorit preman.", type: "weapon", skill: "+8% Rob Success", modifiers: { robSuccess: 0.08 } },
    { id: "crossbow", name: "Crossbow Silent", price: 200000, description: "Serangan senyap.", type: "weapon", skill: "+10% Rob/Crime Success", modifiers: { robSuccess: 0.1, crimeSuccess: 0.1 } },
    { id: "chainsaw", name: "Chainsaw Madness", price: 300000, description: "Pekerjaan berat.", type: "weapon", skill: "+15% Work Bonus", modifiers: { workBonus: 0.15 } },

    // === VEHICLES ===
    { id: "bicycle", name: "Sepeda Onthel", price: 50000, description: "Ramah lingkungan.", type: "vehicle", skill: "-2% Cooldown", modifiers: { cooldownReduction: 0.02 } },
    { id: "motorcycle", name: "Motor Sport", price: 500000, description: "Performa tinggi.", type: "vehicle", skill: "-10% Cooldown", modifiers: { cooldownReduction: 0.1 } },
    { id: "car", name: "Sedan Mewah", price: 2000000, description: "Mobil nyaman.", type: "vehicle", skill: "-15% Cooldown", modifiers: { cooldownReduction: 0.15 } },
    { id: "supercar", name: "Supercar Lambo", price: 15000000, description: "Impian semua orang.", type: "vehicle", skill: "-20% Cooldown", modifiers: { cooldownReduction: 0.2 } },
    { id: "helicopter", name: "Helikopter Pribadi", price: 50000000, description: "Terbang bebas.", type: "vehicle", skill: "-30% Cooldown", modifiers: { cooldownReduction: 0.3 } },
    { id: "yacht", name: "Yacht Mewah", price: 100000000, description: "Berlayar stylish.", type: "vehicle", skill: "-35% Cooldown", modifiers: { cooldownReduction: 0.35 } },
    { id: "jet", name: "Private Jet", price: 250000000, description: "Jet pribadi eksekutif.", type: "vehicle", skill: "-50% Cooldown", modifiers: { cooldownReduction: 0.5 } },
    { id: "tank", name: "Tank Militer", price: 500000000, description: "Dominasi total.", type: "weapon", skill: "+40% Rob/Crime Success", modifiers: { robSuccess: 0.4, crimeSuccess: 0.4 } },

    // === PETS ===
    { id: "cat", name: "Kucing Oren", price: 25000, description: "Teman setia.", type: "pet", skill: "+5% Daily Bonus", modifiers: { dailyBonus: 0.05 } },
    { id: "dog", name: "Anjing Labrador", price: 35000, description: "Best friend.", type: "pet", skill: "+8% Daily Bonus", modifiers: { dailyBonus: 0.08 } },
    { id: "parrot", name: "Burung Beo", price: 50000, description: "Bisa ngomong!", type: "pet", skill: "+5% Work Bonus", modifiers: { workBonus: 0.05 } },
    { id: "hamster", name: "Hamster Gemuk", price: 15000, description: "Menggemaskan.", type: "pet", skill: "+3% Daily Bonus", modifiers: { dailyBonus: 0.03 } },
    { id: "dragon", name: "Baby Dragon", price: 10000000, description: "Pet legendaris.", type: "pet", skill: "+50% All, -20% Cooldown", modifiers: { workBonus: 0.5, crimePayout: 0.5, cooldownReduction: 0.2 } },
    { id: "unicorn", name: "Unicorn Ajaib", price: 25000000, description: "Langka dan magis.", type: "pet", skill: "+100% Daily Bonus", modifiers: { dailyBonus: 1.0 } },
    { id: "phoenix", name: "Phoenix Api", price: 50000000, description: "Burung abadi.", type: "pet", skill: "+50% Success All", modifiers: { crimeSuccess: 0.5, robSuccess: 0.5 } },
    { id: "robot_dog", name: "Robot Dog K9", price: 5000000, description: "AI companion.", type: "pet", skill: "+20% Work, +10% Protection", modifiers: { workBonus: 0.2, robProtection: 0.1 } },

    // === CONSUMABLES ===
    { id: "coffee", name: "Kopi Hitam", price: 500, description: "Boost energi.", type: "consumable", skill: "+20% Work Bonus", modifiers: { workBonus: 0.2 } },
    { id: "energydrink", name: "Energy Drink", price: 1000, description: "Cooldown berkurang.", type: "consumable", skill: "-50% Cooldown", modifiers: { cooldownReduction: 0.5 } },
    { id: "pizza", name: "Pizza Jumbo", price: 2500, description: "Kenyang = happy.", type: "consumable", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "sushi", name: "Sushi Premium", price: 5000, description: "Makanan sultan.", type: "consumable", skill: "+25% Work Bonus", modifiers: { workBonus: 0.25 } },
    { id: "ramen", name: "Ramen Spesial", price: 3000, description: "Comfort food.", type: "consumable", skill: "+15% Work Bonus", modifiers: { workBonus: 0.15 } },
    { id: "steak", name: "Wagyu Steak", price: 15000, description: "Daging A5.", type: "consumable", skill: "+50% Work Bonus", modifiers: { workBonus: 0.5 } },
    { id: "potion_luck", name: "Luck Potion", price: 10000, description: "Luck +50%.", type: "consumable", skill: "+30% Success All", modifiers: { crimeSuccess: 0.3, robSuccess: 0.3 } },
    { id: "potion_speed", name: "Speed Potion", price: 7500, description: "Cooldown -75%.", type: "consumable", skill: "-75% Cooldown", modifiers: { cooldownReduction: 0.75 } },

    // === COLLECTIBLES ===
    { id: "laptop", name: "Laptop Gaming", price: 1500000, description: "RTX inside.", type: "collectible", skill: "+20% Work Bonus", modifiers: { workBonus: 0.2 } },
    { id: "phone", name: "iPhone Pro Max", price: 2500000, description: "Gadget premium.", type: "collectible", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "watch", name: "Rolex Submariner", price: 10000000, description: "Jam mewah.", type: "collectible", skill: "+50% Daily Bonus", modifiers: { dailyBonus: 0.5 } },
    { id: "necklace", name: "Kalung Emas 24K", price: 5000000, description: "Perhiasan berkelas.", type: "collectible", skill: "+25% Daily Bonus", modifiers: { dailyBonus: 0.25 } },
    { id: "ring", name: "Cincin Berlian", price: 7500000, description: "Simbol kemewahan.", type: "collectible", skill: "+35% Daily Bonus", modifiers: { dailyBonus: 0.35 } },
    { id: "crown", name: "Mahkota Raja", price: 50000000, description: "Kekuasaan tertinggi.", type: "collectible", skill: "+100% All Bonus", modifiers: { workBonus: 1.0, dailyBonus: 1.0, crimePayout: 1.0 } },
    { id: "painting", name: "Lukisan Monalisa", price: 999999999, description: "Seni tak ternilai.", type: "collectible", skill: "+200% Daily Bonus", modifiers: { dailyBonus: 2.0 } },
    { id: "trophy", name: "Piala Juara 1", price: 1000000, description: "Bukti kemenangan.", type: "collectible", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "medal", name: "Medali Emas", price: 500000, description: "Penghargaan.", type: "collectible", skill: "+5% Work Bonus", modifiers: { workBonus: 0.05 } },
    { id: "gem", name: "Berlian Biru", price: 20000000, description: "Langka dan indah.", type: "collectible", skill: "+60% Daily Bonus", modifiers: { dailyBonus: 0.6 } },
    { id: "nft_monkey", name: "NFT Monkey", price: 100000, description: "Worth millions (trust me).", type: "collectible", skill: "+1% Work Bonus", modifiers: { workBonus: 0.01 } },
    { id: "bitcoin", name: "1 Bitcoin", price: 50000000, description: "Crypto king.", type: "collectible", skill: "+50% Work/Daily", modifiers: { workBonus: 0.5, dailyBonus: 0.5 } },

    // === RARE ===
    { id: "golden_ticket", name: "Golden Ticket", price: 10000000, description: "Akses VIP.", type: "rare", skill: "+50% Success All", modifiers: { crimeSuccess: 0.5, robSuccess: 0.5 } },
    { id: "mystery_box", name: "Mystery Box", price: 50000, description: "Coba aja!", type: "rare", skill: "Random", modifiers: { workBonus: 0.1 } },
    { id: "lucky_coin", name: "Koin Keberuntungan", price: 100000, description: "Double reward 10%.", type: "rare", skill: "+10% Success All", modifiers: { crimeSuccess: 0.1, robSuccess: 0.1, dailyBonus: 0.1 } },
    { id: "time_machine", name: "Mesin Waktu", price: 50000000, description: "Reset cooldown.", type: "rare", skill: "-80% Cooldown", modifiers: { cooldownReduction: 0.8 } },
    { id: "clover", name: "Four Leaf Clover", price: 250000, description: "Luck +25%.", type: "rare", skill: "+25% Success All", modifiers: { crimeSuccess: 0.25, robSuccess: 0.25 } },
    { id: "star", name: "Bintang Ajaib", price: 1000000, description: "Wish granted.", type: "rare", skill: "+100% Payout All", modifiers: { workBonus: 1.0, crimePayout: 1.0, dailyBonus: 1.0 } },
    { id: "crystal_ball", name: "Bola Kristal", price: 500000, description: "Lihat masa depan.", type: "rare", skill: "+15% Success All", modifiers: { crimeSuccess: 0.15, robSuccess: 0.15 } },

    // === LEGENDARY ===
    { id: "infinity_gauntlet", name: "Infinity Gauntlet", price: 999999999, description: "Snap!", type: "legendary", skill: "GOD MODE", modifiers: { workBonus: 5.0, dailyBonus: 5.0, crimePayout: 5.0, cooldownReduction: 0.9 } },
    { id: "excalibur", name: "Pedang Excalibur", price: 500000000, description: "Senjata raja.", type: "legendary", skill: "+200% Crime/Rob", modifiers: { crimeSuccess: 2.0, robSuccess: 2.0 } },
    { id: "holy_grail", name: "Holy Grail", price: 750000000, description: "Artefak suci.", type: "legendary", skill: "IMMORTAL", modifiers: { workBonus: 3.0, dailyBonus: 3.0, crimePayout: 3.0 } },
    { id: "mjolnir", name: "Mjolnir Thor", price: 500000000, description: "Hanya yang layak.", type: "legendary", skill: "+150% Rob, +50% Protection", modifiers: { robSuccess: 1.5, robProtection: 0.5 } },
    { id: "death_note", name: "Death Note", price: 666666666, description: "Tulis nama...", type: "legendary", skill: "100% Rob Success", modifiers: { robSuccess: 1.0 } },
    { id: "dragon_egg", name: "Dragon Egg", price: 100000000, description: "Akan menetas.", type: "legendary", skill: "+50% All Stats", modifiers: { workBonus: 0.5, crimeSuccess: 0.5, robSuccess: 0.5, cooldownReduction: 0.5, dailyBonus: 0.5 } },

    // === MISC TOOLS ===
    { id: "fake_id", name: "KTP Palsu", price: 50000, description: "Identitas baru.", type: "tool", skill: "+10% Crime", modifiers: { crimeSuccess: 0.1 } },
    { id: "rope", name: "Tali Tambang", price: 1000, description: "Multi-purpose.", type: "tool", skill: "+2% Work", modifiers: { workBonus: 0.02 } },
    { id: "flashlight", name: "Senter Terang", price: 1500, description: "Penerangan.", type: "tool", skill: "+3% Crime", modifiers: { crimeSuccess: 0.03 } },
    { id: "binoculars", name: "Teropong", price: 3500, description: "Lihat jauh.", type: "tool", skill: "+7% Rob", modifiers: { robSuccess: 0.07 } },
    { id: "map", name: "Peta Harta", price: 10000, description: "Menuju kekayaan.", type: "tool", skill: "+15% Daily", modifiers: { dailyBonus: 0.15 } },
    { id: "compass", name: "Kompas Ajaib", price: 7500, description: "Arah benar.", type: "tool", skill: "+10% Success All", modifiers: { crimeSuccess: 0.1, robSuccess: 0.1 } },

    // === MISC CONSUMABLES ===
    { id: "beer", name: "Bir Dingin", price: 1500, description: "+10% keberanian.", type: "consumable", skill: "+10% Rob", modifiers: { robSuccess: 0.1 } },
    { id: "wine", name: "Wine Premium", price: 10000, description: "Minuman elite.", type: "consumable", skill: "+20% Daily", modifiers: { dailyBonus: 0.2 } },
    { id: "champagne", name: "Champagne Dom", price: 25000, description: "Merayakan.", type: "consumable", skill: "+50% Daily", modifiers: { dailyBonus: 0.5 } },
    { id: "burger", name: "Burger Triple", price: 2000, description: "Isi perut.", type: "consumable", skill: "+12% Work", modifiers: { workBonus: 0.12 } },
    { id: "taco", name: "Taco Spicy", price: 1800, description: "Pedas nampol.", type: "consumable", skill: "+10% Work", modifiers: { workBonus: 0.1 } },
    { id: "ice_cream", name: "Es Krim Gelato", price: 2500, description: "Manis segar.", type: "consumable", skill: "+8% Daily", modifiers: { dailyBonus: 0.08 } },
    { id: "cake", name: "Birthday Cake", price: 7500, description: "Spesial ultah.", type: "consumable", skill: "+30% Daily", modifiers: { dailyBonus: 0.3 } },
    { id: "donut", name: "Donut Glazed", price: 1200, description: "Homer's fav.", type: "consumable", skill: "+5% Work", modifiers: { workBonus: 0.05 } },

    // === MISC COLLECTIBLES ===
    { id: "guitar", name: "Gitar Elektrik", price: 500000, description: "Rock n roll!", type: "collectible", skill: "+15% Work", modifiers: { workBonus: 0.15 } },
    { id: "piano", name: "Grand Piano", price: 2500000, description: "Klasik.", type: "collectible", skill: "+30% Work", modifiers: { workBonus: 0.3 } },
    { id: "camera", name: "Kamera DSLR", price: 1000000, description: "Abadikan momen.", type: "collectible", skill: "+10% Work", modifiers: { workBonus: 0.1 } },
    { id: "vr_headset", name: "VR Headset", price: 800000, description: "Dunia virtual.", type: "collectible", skill: "+12% Work", modifiers: { workBonus: 0.12 } },
    { id: "drone", name: "Drone Pro", price: 1200000, description: "Terbang tinggi.", type: "collectible", skill: "+15% Crime", modifiers: { crimeSuccess: 0.15 } },
    { id: "console", name: "PS5 Pro", price: 1000000, description: "Next-gen gaming.", type: "collectible", skill: "+10% Work", modifiers: { workBonus: 0.1 } },
    { id: "tv", name: "TV 85 inch OLED", price: 5000000, description: "Bioskop rumah.", type: "collectible", skill: "+20% Daily", modifiers: { dailyBonus: 0.2 } },
    { id: "speaker", name: "Speaker JBL", price: 300000, description: "Bass menggelegar.", type: "collectible", skill: "+5% Work", modifiers: { workBonus: 0.05 } },
    { id: "headphones", name: "Headphone Sony", price: 500000, description: "Audio premium.", type: "collectible", skill: "+7% Work", modifiers: { workBonus: 0.07 } },

    // === SPECIAL ===
    { id: "love_letter", name: "Surat Cinta", price: 100, description: "Untuk gebetan.", type: "collectible", skill: "+1% Daily", modifiers: { dailyBonus: 0.01 } },
    { id: "rose", name: "Mawar Merah", price: 500, description: "Simbol cinta.", type: "collectible", skill: "+2% Daily", modifiers: { dailyBonus: 0.02 } },
    { id: "teddy", name: "Teddy Bear", price: 2500, description: "Pelukan hangat.", type: "collectible", skill: "+5% Daily", modifiers: { dailyBonus: 0.05 } },
    { id: "balloon", name: "Balon Warna-warni", price: 200, description: "Dekorasi.", type: "collectible", skill: "+0.5% Daily", modifiers: { dailyBonus: 0.005 } },
    { id: "firework", name: "Kembang Api", price: 5000, description: "Meriah!", type: "consumable", skill: "+10% Daily", modifiers: { dailyBonus: 0.1 } },
    { id: "sunglasses", name: "Kacamata Hitam", price: 10000, description: "Stay cool.", type: "collectible", skill: "+2% Rob", modifiers: { robSuccess: 0.02 } },
    { id: "sneakers", name: "Sneakers Limited", price: 500000, description: "Hypebeast.", type: "collectible", skill: "+10% Work", modifiers: { workBonus: 0.1 } },
    { id: "bag", name: "Tas Hermes", price: 5000000, description: "Luxury fashion.", type: "collectible", skill: "+25% Daily", modifiers: { dailyBonus: 0.25 } },
    { id: "perfume", name: "Parfum Dior", price: 200000, description: "Wangi mewah.", type: "collectible", skill: "+8% Daily", modifiers: { dailyBonus: 0.08 } },
];

export const getItem = (id: string) => ITEMS.find(i => i.id === id);
export const ITEMS_PER_PAGE = 10;
