export interface ItemModifiers {
    workBonus?: number;       // e.g. 0.1 means +10% salary
    crimeSuccess?: number;   // e.g. 0.05 means +5% success
    crimePayout?: number;    // e.g. 0.2 means +20% money from crime
    robSuccess?: number;     // e.g. 0.05 means +5% success
    robProtection?: number;  // e.g. 0.1 means -10% chance to be robbed
    cooldownReduction?: number; // e.g. 0.1 means -10% cooldown time
    dailyBonus?: number;     // e.g. 500 fixed bonus or multiplier? Let's use multiplier 0.1 (+10%)
}

export interface GameItem {
    id: string;
    name: string;
    price: number;
    description: string;
    type: "collectible" | "tool" | "defense" | "consumable" | "weapon" | "vehicle" | "pet" | "rare" | "legendary";
    skill?: string;           // Display text for the skill
    modifiers?: ItemModifiers; // The actual logic data
}

export const ITEMS: GameItem[] = [
    // === DEFENSE ===
    { id: "shield", name: "Preman Kampung", price: 5000, description: "Melindungi dompet dari maling (1x pakai).", type: "defense", skill: "Auto-block robbery", modifiers: { robProtection: 1.0 } },
    { id: "bodyguard", name: "Bodyguard Elite", price: 50000, description: "Perlindungan maksimal dari serangan.", type: "defense", skill: "+20% Rob Protection", modifiers: { robProtection: 0.2 } },
    { id: "bunker", name: "Bunker Rahasia", price: 500000, description: "Tempat aman untuk simpan harta.", type: "defense", skill: "+50% Rob Protection", modifiers: { robProtection: 0.5 } },
    { id: "alarm", name: "Alarm Anti-Maling", price: 15000, description: "Notifikasi instan jika ada yang rob.", type: "defense", skill: "+5% Rob Protection", modifiers: { robProtection: 0.05 } },
    { id: "cctv", name: "CCTV 4K", price: 25000, description: "Rekam semua aktivitas mencurigakan.", type: "defense", skill: "+10% Rob Protection", modifiers: { robProtection: 0.1 } },

    // === TOOLS ===
    { id: "lockpick", name: "Alat Maling", price: 2000, description: "Nambah peluang sukses rob (+10%).", type: "tool", skill: "+10% Rob Success", modifiers: { robSuccess: 0.1 } },
    { id: "hackertool", name: "Hacker Kit", price: 75000, description: "Bypass sistem keamanan digital.", type: "tool", skill: "+15% Crime Success", modifiers: { crimeSuccess: 0.15 } },
    { id: "disguise", name: "Penyamaran Pro", price: 30000, description: "Kurangi chance tertangkap polisi.", type: "tool", skill: "+10% Crime Success", modifiers: { crimeSuccess: 0.1 } },
    { id: "scanner", name: "Money Scanner", price: 20000, description: "Lihat isi wallet orang lain.", type: "tool", skill: "+5% Rob Success", modifiers: { robSuccess: 0.05 } },
    { id: "drillkit", name: "Drill Kit Pro", price: 100000, description: "Buka brankas dengan mudah.", type: "tool", skill: "+20% Crime Success", modifiers: { crimeSuccess: 0.2 } },
    { id: "fishingrod", name: "Joran Emas", price: 45000, description: "Mancing ikan langka.", type: "tool", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "pickaxe", name: "Pickaxe Diamond", price: 80000, description: "Tambang crypto lebih cepat.", type: "tool", skill: "+15% Work Bonus", modifiers: { workBonus: 0.15 } },
    { id: "magnet", name: "Magnet Uang", price: 60000, description: "Tarik koin dari sekitar.", type: "tool", skill: "+5% Daily Bonus", modifiers: { dailyBonus: 0.05 } },

    // === WEAPONS ===
    { id: "knife", name: "Pisau Dapur", price: 5000, description: "Senjata basic untuk pemula.", type: "weapon", skill: "+5% Rob Success", modifiers: { robSuccess: 0.05 } },
    { id: "katana", name: "Katana Samurai", price: 150000, description: "Senjata legendaris dari Jepang.", type: "weapon", skill: "+20% Rob Success", modifiers: { robSuccess: 0.2 } },
    { id: "gun", name: "Water Gun", price: 10000, description: "Untuk main-main aja.", type: "weapon", skill: "+2% Rob Success", modifiers: { robSuccess: 0.02 } },
    { id: "bat", name: "Tongkat Baseball", price: 25000, description: "Favorit preman jalanan.", type: "weapon", skill: "+8% Rob Success", modifiers: { robSuccess: 0.08 } },
    { id: "crossbow", name: "Crossbow Silent", price: 200000, description: "Serangan diam-diam.", type: "weapon", skill: "+10% Rob Success, +10% Crime Success", modifiers: { robSuccess: 0.1, crimeSuccess: 0.1 } },
    { id: "chainsaw", name: "Chainsaw Madness", price: 300000, description: "Untuk pekerjaan berat.", type: "weapon", skill: "+15% Work Bonus", modifiers: { workBonus: 0.15 } },

    // === VEHICLES ===
    { id: "bicycle", name: "Sepeda Onthel", price: 50000, description: "Kendaraan ramah lingkungan.", type: "vehicle", skill: "-2% Cooldown", modifiers: { cooldownReduction: 0.02 } },
    { id: "motorcycle", name: "Motor Sport", price: 500000, description: "Kecepatan tinggi, style mantap.", type: "vehicle", skill: "-10% Cooldown", modifiers: { cooldownReduction: 0.1 } },
    { id: "car", name: "Sedan Mewah", price: 2000000, description: "Mobil keluarga berkelas.", type: "vehicle", skill: "-15% Cooldown", modifiers: { cooldownReduction: 0.15 } },
    { id: "supercar", name: "Supercar Lambo", price: 15000000, description: "Impian setiap orang.", type: "vehicle", skill: "-20% Cooldown", modifiers: { cooldownReduction: 0.2 } },
    { id: "helicopter", name: "Helikopter Pribadi", price: 50000000, description: "Terbang bebas tanpa macet.", type: "vehicle", skill: "-30% Cooldown", modifiers: { cooldownReduction: 0.3 } },
    { id: "yacht", name: "Yacht Mewah", price: 100000000, description: "Berlayar dengan gaya.", type: "vehicle", skill: "-35% Cooldown", modifiers: { cooldownReduction: 0.35 } },
    { id: "jet", name: "Private Jet", price: 250000000, description: "Sultan mode: ON.", type: "vehicle", skill: "-50% Cooldown", modifiers: { cooldownReduction: 0.5 } },
    { id: "submarine", name: "Kapal Selam Mini", price: 75000000, description: "Eksplorasi bawah laut.", type: "vehicle", skill: "-25% Cooldown", modifiers: { cooldownReduction: 0.25 } },
    { id: "tank", name: "Tank Militer", price: 500000000, description: "Dominasi total.", type: "weapon", skill: "+40% Rob Success, +40% Crime Success", modifiers: { robSuccess: 0.4, crimeSuccess: 0.4 } },

    // === PETS ===
    { id: "cat", name: "Kucing Oren", price: 25000, description: "Teman setia yang lucu.", type: "pet", skill: "+5% Daily Bonus", modifiers: { dailyBonus: 0.05 } },
    { id: "dog", name: "Anjing Labrador", price: 35000, description: "Best friend forever.", type: "pet", skill: "+8% Daily Bonus", modifiers: { dailyBonus: 0.08 } },
    { id: "parrot", name: "Burung Beo", price: 50000, description: "Bisa ngomong!", type: "pet", skill: "+5% Work Bonus", modifiers: { workBonus: 0.05 } },
    { id: "hamster", name: "Hamster Gemuk", price: 15000, description: "Kecil tapi menggemaskan.", type: "pet", skill: "+3% Daily Bonus", modifiers: { dailyBonus: 0.03 } },
    { id: "dragon", name: "Baby Dragon", price: 10000000, description: "Pet legendaris dari mitos.", type: "pet", skill: "+50% Payout All, -20% Cooldown", modifiers: { workBonus: 0.5, crimePayout: 0.5, cooldownReduction: 0.2 } },
    { id: "unicorn", name: "Unicorn Ajaib", price: 25000000, description: "Langka dan magis.", type: "pet", skill: "+100% Daily Bonus", modifiers: { dailyBonus: 1.0 } },
    { id: "phoenix", name: "Phoenix Api", price: 50000000, description: "Burung abadi dari legenda.", type: "pet", skill: "+50% Success All", modifiers: { crimeSuccess: 0.5, robSuccess: 0.5 } },
    { id: "robot_dog", name: "Robot Dog K9", price: 5000000, description: "AI companion masa depan.", type: "pet", skill: "+20% Work Bonus, +10% Rob Protection", modifiers: { workBonus: 0.2, robProtection: 0.1 } },

    // === CONSUMABLES ===
    { id: "coffee", name: "Kopi Hitam", price: 5000, description: "Boost energi +20%.", type: "consumable", skill: "+20% Work Bonus", modifiers: { workBonus: 0.2 } },
    { id: "energydrink", name: "Energy Drink", price: 10000, description: "Cooldown berkurang 50%.", type: "consumable", skill: "-50% Cooldown", modifiers: { cooldownReduction: 0.5 } },
    { id: "pizza", name: "Pizza Jumbo", price: 25000, description: "Kenyang = happy.", type: "consumable", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "sushi", name: "Sushi Premium", price: 50000, description: "Makanan sultan.", type: "consumable", skill: "+25% Work Bonus", modifiers: { workBonus: 0.25 } },
    { id: "ramen", name: "Ramen Spesial", price: 30000, description: "Comfort food terbaik.", type: "consumable", skill: "+15% Work Bonus", modifiers: { workBonus: 0.15 } },
    { id: "steak", name: "Wagyu Steak", price: 150000, description: "Daging grade A5.", type: "consumable", skill: "+50% Work Bonus", modifiers: { workBonus: 0.5 } },
    { id: "potion_luck", name: "Luck Potion", price: 100000, description: "Luck +50% selama 1 jam.", type: "consumable", skill: "+30% Success All", modifiers: { crimeSuccess: 0.3, robSuccess: 0.3 } },
    { id: "potion_speed", name: "Speed Potion", price: 75000, description: "Cooldown -75%.", type: "consumable", skill: "-75% Cooldown", modifiers: { cooldownReduction: 0.75 } },

    // === COLLECTIBLES ===
    { id: "laptop", name: "Laptop Gaming", price: 15000000, description: "RTX 4090 inside.", type: "collectible", skill: "+20% Work Bonus", modifiers: { workBonus: 0.2 } },
    { id: "phone", name: "iPhone Pro Max", price: 25000000, description: "Gadget premium.", type: "collectible", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "watch", name: "Rolex Submariner", price: 100000000, description: "Jam tangan mewah.", type: "collectible", skill: "+50% Daily Bonus", modifiers: { dailyBonus: 0.5 } },
    { id: "necklace", name: "Kalung Emas 24K", price: 50000000, description: "Perhiasan berkelas.", type: "collectible", skill: "+25% Daily Bonus", modifiers: { dailyBonus: 0.25 } },
    { id: "ring", name: "Cincin Berlian", price: 75000000, description: "Simbol kemewahan.", type: "collectible", skill: "+35% Daily Bonus", modifiers: { dailyBonus: 0.35 } },
    { id: "crown", name: "Mahkota Raja", price: 500000000, description: "Hanya untuk yang terpilih.", type: "collectible", skill: "+100% All Bonus", modifiers: { workBonus: 1.0, dailyBonus: 1.0, crimePayout: 1.0 } },
    { id: "painting", name: "Lukisan Monalisa", price: 999999999, description: "Karya seni tak ternilai.", type: "collectible", skill: "+200% Daily Bonus", modifiers: { dailyBonus: 2.0 } },
    { id: "trophy", name: "Piala Juara 1", price: 1000000, description: "Bukti kemenangan.", type: "collectible", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "medal", name: "Medali Emas", price: 500000, description: "Penghargaan tertinggi.", type: "collectible", skill: "+5% Work Bonus", modifiers: { workBonus: 0.05 } },
    { id: "gem", name: "Berlian Biru", price: 200000000, description: "Langka dan indah.", type: "collectible", skill: "+60% Daily Bonus", modifiers: { dailyBonus: 0.6 } },
    { id: "nft_monkey", name: "NFT Monkey", price: 1000000, description: "Worth millions (trust me bro).", type: "collectible", skill: "+1% Work Bonus (LMAO)", modifiers: { workBonus: 0.01 } },
    { id: "bitcoin", name: "1 Bitcoin", price: 500000000, description: "Crypto king.", type: "collectible", skill: "+50% Work Bonus, +50% Daily Bonus", modifiers: { workBonus: 0.5, dailyBonus: 0.5 } },

    // === RARE ===
    { id: "golden_ticket", name: "Golden Ticket", price: 10000000, description: "Akses VIP ke event spesial.", type: "rare", skill: "+50% Success All", modifiers: { crimeSuccess: 0.5, robSuccess: 0.5 } },
    { id: "mystery_box", name: "Mystery Box", price: 50000, description: "Apa isinya? Coba aja!", type: "rare", skill: "Random Modifier (Wait for usage)", modifiers: { workBonus: 0.1 } },
    { id: "lucky_coin", name: "Koin Keberuntungan", price: 100000, description: "Double reward 10% chance.", type: "rare", skill: "+10% Success All", modifiers: { crimeSuccess: 0.1, robSuccess: 0.1, dailyBonus: 0.1 } },
    { id: "time_machine", name: "Mesin Waktu", price: 50000000, description: "Reset cooldown semua command.", type: "rare", skill: "-80% Cooldown", modifiers: { cooldownReduction: 0.8 } },
    { id: "clover", name: "Four Leaf Clover", price: 250000, description: "Luck +25% permanent.", type: "rare", skill: "+25% Success All", modifiers: { crimeSuccess: 0.25, robSuccess: 0.25 } },
    { id: "star", name: "Bintang Ajaib", price: 1000000, description: "Wish granted (1x).", type: "rare", skill: "+100% Payout All", modifiers: { workBonus: 1.0, crimePayout: 1.0, dailyBonus: 1.0 } },
    { id: "crystal_ball", name: "Bola Kristal", price: 500000, description: "Lihat masa depan.", type: "rare", skill: "+15% Success All", modifiers: { crimeSuccess: 0.15, robSuccess: 0.15 } },
    { id: "ancient_scroll", name: "Scroll Kuno", price: 750000, description: "Rahasia tersembunyi.", type: "rare", skill: "+10% Success All, +20% Payout All", modifiers: { crimeSuccess: 0.1, robSuccess: 0.1, workBonus: 0.2, dailyBonus: 0.2 } },

    // === LEGENDARY ===
    { id: "infinity_gauntlet", name: "Infinity Gauntlet", price: 999999999, description: "Snap dan semuanya hilang.", type: "legendary", skill: "GOD MODE: +500% All Payout, -90% Cooldown", modifiers: { workBonus: 5.0, dailyBonus: 5.0, crimePayout: 5.0, cooldownReduction: 0.9 } },
    { id: "excalibur", name: "Pedang Excalibur", price: 500000000, description: "Senjata legendaris Raja Arthur.", type: "legendary", skill: "+200% Crime/Rob Success", modifiers: { crimeSuccess: 2.0, robSuccess: 2.0 } },
    { id: "holy_grail", name: "Holy Grail", price: 750000000, description: "Artefak suci.", type: "legendary", skill: "IMMORTAL: No Fine on Fail, +300% Payout", modifiers: { workBonus: 3.0, dailyBonus: 3.0, crimePayout: 3.0 } },
    { id: "philosophers_stone", name: "Philosopher's Stone", price: 999999999, description: "Ubah apapun jadi emas.", type: "legendary", skill: "ALCHEMIST: +1000% Work Bonus", modifiers: { workBonus: 10.0 } },
    { id: "mjolnir", name: "Mjolnir Thor", price: 500000000, description: "Hanya yang layak bisa angkat.", type: "legendary", skill: "+150% Rob Success, +50% Protection", modifiers: { robSuccess: 1.5, robProtection: 0.5 } },
    { id: "death_note", name: "Death Note", price: 666666666, description: "Tulis nama... yah gitu deh.", type: "legendary", skill: "100% Rob Success", modifiers: { robSuccess: 1.0 } },
    { id: "one_ring", name: "The One Ring", price: 999999999, description: "One ring to rule them all.", type: "legendary", skill: "INVISIBLE: No Rob Fail, +200% Success", modifiers: { robSuccess: 2.0, crimeSuccess: 2.0 } },
    { id: "dragon_egg", name: "Dragon Egg", price: 100000000, description: "Akan menetas jadi naga.", type: "legendary", skill: "DORMANT POWER: +50% All Stats", modifiers: { workBonus: 0.5, crimeSuccess: 0.5, robSuccess: 0.5, cooldownReduction: 0.5, dailyBonus: 0.5 } },

    // === MORE TOOLS ===
    { id: "fake_id", name: "KTP Palsu", price: 50000, description: "Identitas baru.", type: "tool", skill: "+10% Crime Success", modifiers: { crimeSuccess: 0.1 } },
    { id: "rope", name: "Tali Tambang", price: 10000, description: "Untuk berbagai keperluan.", type: "tool", skill: "+2% Work Bonus", modifiers: { workBonus: 0.02 } },
    { id: "flashlight", name: "Senter Terang", price: 15000, description: "Penerangan malam.", type: "tool", skill: "+3% Crime Success", modifiers: { crimeSuccess: 0.03 } },
    { id: "binoculars", name: "Teropong", price: 35000, description: "Lihat dari jauh.", type: "tool", skill: "+7% Rob Success", modifiers: { robSuccess: 0.07 } },
    { id: "map", name: "Peta Harta Karun", price: 100000, description: "Menuju kekayaan.", type: "tool", skill: "+15% Daily Bonus", modifiers: { dailyBonus: 0.15 } },
    { id: "compass", name: "Kompas Ajaib", price: 75000, description: "Selalu tunjuk arah benar.", type: "tool", skill: "+10% Success All", modifiers: { crimeSuccess: 0.1, robSuccess: 0.1 } },

    // === MORE CONSUMABLES ===
    { id: "beer", name: "Bir Dingin", price: 15000, description: "+10% keberanian.", type: "consumable", skill: "+10% Rob Success", modifiers: { robSuccess: 0.1 } },
    { id: "wine", name: "Wine Premium", price: 100000, description: "Minuman kaum elite.", type: "consumable", skill: "+20% Daily Bonus", modifiers: { dailyBonus: 0.2 } },
    { id: "champagne", name: "Champagne Dom", price: 250000, description: "Untuk merayakan kemenangan.", type: "consumable", skill: "+50% Daily Bonus", modifiers: { dailyBonus: 0.5 } },
    { id: "burger", name: "Burger Triple", price: 20000, description: "Isi perut dengan cepat.", type: "consumable", skill: "+12% Work Bonus", modifiers: { workBonus: 0.12 } },
    { id: "taco", name: "Taco Spicy", price: 18000, description: "Pedasnya nampol.", type: "consumable", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "ice_cream", name: "Es Krim Gelato", price: 25000, description: "Manis dan segar.", type: "consumable", skill: "+8% Daily Bonus", modifiers: { dailyBonus: 0.08 } },
    { id: "cake", name: "Birthday Cake", price: 75000, description: "Spesial untuk ultah.", type: "consumable", skill: "+30% Daily Bonus", modifiers: { dailyBonus: 0.3 } },
    { id: "donut", name: "Donut Glazed", price: 12000, description: "Favorit Homer Simpson.", type: "consumable", skill: "+5% Work Bonus", modifiers: { workBonus: 0.05 } },

    // === MORE COLLECTIBLES ===
    { id: "guitar", name: "Gitar Elektrik", price: 5000000, description: "Rock n roll!", type: "collectible", skill: "+15% Work Bonus", modifiers: { workBonus: 0.15 } },
    { id: "piano", name: "Grand Piano", price: 25000000, description: "Instrumen klasik.", type: "collectible", skill: "+30% Work Bonus", modifiers: { workBonus: 0.3 } },
    { id: "camera", name: "Kamera DSLR", price: 10000000, description: "Abadikan momen.", type: "collectible", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "telescope", name: "Teleskop Luar Angkasa", price: 15000000, description: "Lihat bintang.", type: "collectible", skill: "+15% Daily Bonus", modifiers: { dailyBonus: 0.15 } },
    { id: "vr_headset", name: "VR Headset", price: 8000000, description: "Masuk ke dunia virtual.", type: "collectible", skill: "+12% Work Bonus", modifiers: { workBonus: 0.12 } },
    { id: "drone", name: "Drone Pro", price: 12000000, description: "Terbang tinggi.", type: "collectible", skill: "+15% Crime Success", modifiers: { crimeSuccess: 0.15 } },
    { id: "console", name: "PS5 Pro", price: 10000000, description: "Next-gen gaming.", type: "collectible", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "tv", name: "TV 85 inch OLED", price: 50000000, description: "Bioskop di rumah.", type: "collectible", skill: "+20% Daily Bonus", modifiers: { dailyBonus: 0.2 } },
    { id: "speaker", name: "Speaker JBL", price: 3000000, description: "Bass yang menggelegar.", type: "collectible", skill: "+5% Work Bonus", modifiers: { workBonus: 0.05 } },
    { id: "headphones", name: "Headphone Sony", price: 5000000, description: "Audio premium.", type: "collectible", skill: "+7% Work Bonus", modifiers: { workBonus: 0.07 } },

    // === SPECIAL ===
    { id: "love_letter", name: "Surat Cinta", price: 1000, description: "Untuk gebetan.", type: "collectible", skill: "+1% Daily Bonus", modifiers: { dailyBonus: 0.01 } },
    { id: "rose", name: "Mawar Merah", price: 5000, description: "Simbol cinta.", type: "collectible", skill: "+2% Daily Bonus", modifiers: { dailyBonus: 0.02 } },
    { id: "teddy", name: "Teddy Bear", price: 25000, description: "Pelukan hangat.", type: "collectible", skill: "+5% Daily Bonus", modifiers: { dailyBonus: 0.05 } },
    { id: "balloon", name: "Balon Warna-warni", price: 2000, description: "Untuk dekorasi.", type: "collectible", skill: "+0.5% Daily Bonus", modifiers: { dailyBonus: 0.005 } },
    { id: "firework", name: "Kembang Api", price: 50000, description: "Meriah!", type: "consumable", skill: "+10% Daily Bonus", modifiers: { dailyBonus: 0.1 } },
    { id: "party_hat", name: "Topi Pesta", price: 10000, description: "Party time!", type: "collectible", skill: "+3% Daily Bonus", modifiers: { dailyBonus: 0.03 } },
    { id: "sunglasses", name: "Kacamata Hitam", price: 100000, description: "Stay cool.", type: "collectible", skill: "+2% Rob Success", modifiers: { robSuccess: 0.02 } },
    { id: "sneakers", name: "Sneakers Limited", price: 5000000, description: "Hypebeast essential.", type: "collectible", skill: "+10% Work Bonus", modifiers: { workBonus: 0.1 } },
    { id: "bag", name: "Tas Hermes", price: 50000000, description: "Luxury fashion.", type: "collectible", skill: "+25% Daily Bonus", modifiers: { dailyBonus: 0.25 } },
    { id: "perfume", name: "Parfum Dior", price: 2000000, description: "Wangi mewah.", type: "collectible", skill: "+8% Daily Bonus", modifiers: { dailyBonus: 0.08 } },
];

export const getItem = (id: string) => ITEMS.find(i => i.id === id);
export const ITEMS_PER_PAGE = 10;
