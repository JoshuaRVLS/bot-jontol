export type Suit = "♠️" | "♥️" | "♦️" | "♣️";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";

export interface Card {
    suit: Suit;
    rank: Rank;
}

export const createDeck = (decks: number = 6): Card[] => {
    const suits: Suit[] = ["♠️", "♥️", "♦️", "♣️"];
    const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    const deck: Card[] = [];

    for (let i = 0; i < decks; i++) {
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push({ suit, rank });
            }
        }
    }

    return shuffle(deck);
};

import { randomInt } from "crypto";

const shuffle = (deck: Card[]): Card[] => {
    // Shuffle 3 times for 'casino grade' thoroughness
    for (let s = 0; s < 3; s++) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = randomInt(0, i + 1);
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }
    return deck;
};

export const calculateScore = (cards: Card[]): number => {
    let score = 0;
    let aces = 0;

    for (const card of cards) {
        if (card.rank === "A") {
            aces++;
            score += 11;
        } else if (["J", "Q", "K"].includes(card.rank)) {
            score += 10;
        } else {
            score += parseInt(card.rank);
        }
    }

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
};

export const formatCard = (card: Card): string => {
    return `\`${card.rank}${card.suit}\``;
};

export const formatHand = (cards: Card[]): string => {
    return cards.map(formatCard).join(" ");
};
