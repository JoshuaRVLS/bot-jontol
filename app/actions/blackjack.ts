"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
    suit: Suit;
    rank: Rank;
    value: number;
}

export interface BlackjackState {
    deck: Card[];
    playerHand: Card[];
    dealerHand: Card[];
    bet: number;
    status: "playing" | "win" | "lose" | "push" | "blackjack" | "bust";
    message: string;
    playerValue: number;
    dealerValue: number;
}

// In-memory state storage (Temporary for dev)
const activeGames = new Map<string, BlackjackState>();

const createDeck = (): Card[] => {
    const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
    const ranks: { rank: Rank; value: number }[] = [
        { rank: "A", value: 11 },
        { rank: "2", value: 2 },
        { rank: "3", value: 3 },
        { rank: "4", value: 4 },
        { rank: "5", value: 5 },
        { rank: "6", value: 6 },
        { rank: "7", value: 7 },
        { rank: "8", value: 8 },
        { rank: "9", value: 9 },
        { rank: "10", value: 10 },
        { rank: "J", value: 10 },
        { rank: "Q", value: 10 },
        { rank: "K", value: 10 },
    ];

    const deck: Card[] = [];
    // 6 Decks
    for (let i = 0; i < 6; i++) {
        for (const suit of suits) {
            for (const r of ranks) {
                deck.push({ suit, rank: r.rank, value: r.value });
            }
        }
    }

    // Shuffle
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
};

const calculateHandValue = (hand: Card[]): number => {
    let value = hand.reduce((acc, card) => acc + card.value, 0);
    let aces = hand.filter(card => card.rank === "A").length;

    while (value > 21 && aces > 0) {
        value -= 10;
        aces -= 1;
    }

    return value;
};

export const startBJAction = async (bet: number) => {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const userId = session.user.id;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return { error: "User gak ada!" };
        if (user.wallet < bet) return { error: "Saldo wallet lu gak cukup bang!" };
        if (bet < 1000) return { error: "Minimal bet Rp 1.000 bang!" };

        // Deduct bet immediately
        await prisma.user.update({
            where: { id: userId },
            data: { wallet: { decrement: bet } }
        });

        const deck = createDeck();
        const playerHand = [deck.pop()!, deck.pop()!];
        const dealerHand = [deck.pop()!, deck.pop()!];

        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);
        let status: BlackjackState["status"] = "playing";
        let message = "Mainkan kartu lu bang!";

        if (playerValue === 21) {
            status = "blackjack";
            message = "BLACKJACK! Lu menang telak!";
            // Payout 3:2
            const winnings = Math.floor(bet * 2.5);
            await prisma.user.update({
                where: { id: userId },
                data: { wallet: { increment: winnings } }
            });
        }

        const state: BlackjackState = {
            deck,
            playerHand,
            dealerHand,
            bet,
            status,
            message,
            playerValue,
            dealerValue: status === "playing" ? dealerHand[0].value : dealerValue // Only show first card value if still playing
        };

        if (status === "playing") {
            activeGames.set(userId, state);
        }

        return { success: true, state: { ...state, deck: [] } }; // Don't send deck to client
    } catch (error) {
        console.error(error);
        return { error: "Internal Error" };
    }
};

export const hitBJAction = async () => {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const userId = session.user.id;
    const game = activeGames.get(userId);

    if (!game || game.status !== "playing") return { error: "Gak ada game aktif bang!" };

    const card = game.deck.pop()!;
    game.playerHand.push(card);

    const playerValue = calculateHandValue(game.playerHand);
    game.playerValue = playerValue;

    if (playerValue > 21) {
        game.status = "bust";
        game.message = "BUST! Lu kalah bang.";
        activeGames.delete(userId);
    }

    return { success: true, state: { ...game, deck: [] } };
};

export const standBJAction = async () => {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const userId = session.user.id;
    const game = activeGames.get(userId);

    if (!game || game.status !== "playing") return { error: "Gak ada game aktif bang!" };

    let dealerValue = calculateHandValue(game.dealerHand);

    // Dealer draws until 17+
    while (dealerValue < 17) {
        game.dealerHand.push(game.deck.pop()!);
        dealerValue = calculateHandValue(game.dealerHand);
    }

    const playerValue = calculateHandValue(game.playerHand);
    game.playerValue = playerValue;
    game.dealerValue = dealerValue;

    if (dealerValue > 21) {
        game.status = "win";
        game.message = "Dealer BUST! Lu menang!";
        await prisma.user.update({
            where: { id: userId },
            data: { wallet: { increment: game.bet * 2 } }
        });
    } else if (dealerValue > playerValue) {
        game.status = "lose";
        game.message = "Dealer menang bang. Hoki lu lagi abis.";
    } else if (dealerValue < playerValue) {
        game.status = "win";
        game.message = "Lu menang bang! Mantap.";
        await prisma.user.update({
            where: { id: userId },
            data: { wallet: { increment: game.bet * 2 } }
        });
    } else {
        game.status = "push";
        game.message = "PUSH! Seri bang, bet lu balik.";
        await prisma.user.update({
            where: { id: userId },
            data: { wallet: { increment: game.bet } }
        });
    }

    activeGames.delete(userId);
    return { success: true, state: { ...game, deck: [] } };
};

export const doubleBJAction = async () => {
    const session: any = await getServerSession(authOptions);
    if (!session) return { error: "Login dulu bang!" };

    const userId = session.user.id;
    const game = activeGames.get(userId);

    if (!game || game.status !== "playing") return { error: "Gak ada game aktif bang!" };

    // Check if player has enough money for double bet
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.wallet < game.bet) return { error: "Saldo gak cukup buat Double Down!" };

    // Deduct second bet
    await prisma.user.update({
        where: { id: userId },
        data: { wallet: { decrement: game.bet } }
    });

    // Double the bet
    game.bet *= 2;

    // Draw exactly one card
    game.playerHand.push(game.deck.pop()!);
    const playerValue = calculateHandValue(game.playerHand);
    game.playerValue = playerValue;

    if (playerValue > 21) {
        game.status = "bust";
        game.message = "BUST setelah Double Down! Rugi dong.";
        activeGames.delete(userId);
        return { success: true, state: { ...game, deck: [] } };
    }

    // Then stand automatically
    return standBJAction();
};
