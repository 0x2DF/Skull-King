var DECK = (function() {
    const Decks = {
        Legacy : {
            "1" : { id: 1, name: 'Skull King', rank: 3, value: 0, type: 'Skull King' },
            // Add 2 cards to your hand from the deck, then discard 2 cards.
            "2" : { id: 2, name: 'Bendt the Bandit', rank: 3, value: 0, type: 'Pirate' },
            // Chose to change your bid by plus or minus 1, or leave it the same.
            "3" : { id: 3, name: 'Harry the Giant', rank: 3, value: 0, type: 'Pirate' },
            // Privately look through any cards not dealth that round to see which are not
            // in play.
            "4" : { id: 4, name: 'Juanita Jade', rank: 3, value: 0, type: 'Pirate' },
            // Bet 0, 10, or 20 points. Earn the points if you bid correct, lose them if
            // you fail!
            "5" : { id: 5, name: 'Rascal of Rotan', rank: 3, value: 0, type: 'Pirate' },
            // Choose any player, including yourself, to lead the next trick.
            "6" : { id: 6, name: 'Rosie de Laney', rank: 3, value: 0, type: 'Pirate' },
            // Can be played as pirate or wildcard.
            "7" : { id: 7, name: 'Tigress', rank: 3, value: 0, type: 'Pirate' },
            "8" : { id: 8, name: 'Alyra', rank: 3, value: 0, type: 'Mermaid' },
            "9" : { id: 9, name: 'Sirena', rank: 3, value: 0, type: 'Mermaid' },
            "10": { id: 10, name: 'Jolly Ranger', rank: 2, value: 1, type: 'Numbered' },
            "11": { id: 11, name: 'Jolly Ranger', rank: 2, value: 2, type: 'Numbered' },
            "12": { id: 12, name: 'Jolly Ranger', rank: 2, value: 3, type: 'Numbered' },
            "13": { id: 13, name: 'Jolly Ranger', rank: 2, value: 4, type: 'Numbered' },
            "14": { id: 14, name: 'Jolly Ranger', rank: 2, value: 5, type: 'Numbered' },
            "15": { id: 15, name: 'Jolly Ranger', rank: 2, value: 6, type: 'Numbered' },
            "16": { id: 16, name: 'Jolly Ranger', rank: 2, value: 7, type: 'Numbered' },
            "17": { id: 17, name: 'Jolly Ranger', rank: 2, value: 8, type: 'Numbered' },
            "18": { id: 18, name: 'Jolly Ranger', rank: 2, value: 9, type: 'Numbered' },
            "19": { id: 19, name: 'Jolly Ranger', rank: 2, value: 10, type: 'Numbered' },
            "20": { id: 20, name: 'Jolly Ranger', rank: 2, value: 11, type: 'Numbered' },
            "21": { id: 21, name: 'Jolly Ranger', rank: 2, value: 12, type: 'Numbered' },
            "22": { id: 22, name: 'Jolly Ranger', rank: 2, value: 13, type: 'Numbered' },
            "23": { id: 23, name: 'Jolly Ranger', rank: 2, value: 14, type: 'Numbered' },
            "24": { id: 24, name: 'Parrots', rank: 1, value: 1, type: 'Numbered' },
            "25": { id: 25, name: 'Parrots', rank: 1, value: 2, type: 'Numbered' },
            "26": { id: 26, name: 'Parrots', rank: 1, value: 3, type: 'Numbered' },
            "27": { id: 27, name: 'Parrots', rank: 1, value: 4, type: 'Numbered' },
            "28": { id: 28, name: 'Parrots', rank: 1, value: 5, type: 'Numbered' },
            "29": { id: 29, name: 'Parrots', rank: 1, value: 6, type: 'Numbered' },
            "30": { id: 30, name: 'Parrots', rank: 1, value: 7, type: 'Numbered' },
            "31": { id: 31, name: 'Parrots', rank: 1, value: 8, type: 'Numbered' },
            "32": { id: 32, name: 'Parrots', rank: 1, value: 9, type: 'Numbered' },
            "33": { id: 33, name: 'Parrots', rank: 1, value: 10, type: 'Numbered' },
            "34": { id: 34, name: 'Parrots', rank: 1, value: 11, type: 'Numbered' },
            "35": { id: 35, name: 'Parrots', rank: 1, value: 12, type: 'Numbered' },
            "36": { id: 36, name: 'Parrots', rank: 1, value: 13, type: 'Numbered' },
            "37": { id: 37, name: 'Parrots', rank: 1, value: 14, type: 'Numbered' },
            "38": { id: 38, name: 'Chests', rank: 1, value: 1, type: 'Numbered' },
            "39": { id: 39, name: 'Chests', rank: 1, value: 2, type: 'Numbered' },
            "40": { id: 40, name: 'Chests', rank: 1, value: 3, type: 'Numbered' },
            "41": { id: 41, name: 'Chests', rank: 1, value: 4, type: 'Numbered' },
            "42": { id: 42, name: 'Chests', rank: 1, value: 5, type: 'Numbered' },
            "43": { id: 43, name: 'Chests', rank: 1, value: 6, type: 'Numbered' },
            "44": { id: 44, name: 'Chests', rank: 1, value: 7, type: 'Numbered' },
            "45": { id: 45, name: 'Chests', rank: 1, value: 8, type: 'Numbered' },
            "46": { id: 46, name: 'Chests', rank: 1, value: 9, type: 'Numbered' },
            "47": { id: 47, name: 'Chests', rank: 1, value: 10, type: 'Numbered' },
            "48": { id: 48, name: 'Chests', rank: 1, value: 11, type: 'Numbered' },
            "49": { id: 49, name: 'Chests', rank: 1, value: 12, type: 'Numbered' },
            "50": { id: 50, name: 'Chests', rank: 1, value: 13, type: 'Numbered' },
            "51": { id: 51, name: 'Chests', rank: 1, value: 14, type: 'Numbered' },
            "52": { id: 52, name: 'Maps', rank: 1, value: 1, type: 'Numbered' },
            "53": { id: 53, name: 'Maps', rank: 1, value: 2, type: 'Numbered' },
            "54": { id: 54, name: 'Maps', rank: 1, value: 3, type: 'Numbered' },
            "55": { id: 55, name: 'Maps', rank: 1, value: 4, type: 'Numbered' },
            "56": { id: 56, name: 'Maps', rank: 1, value: 5, type: 'Numbered' },
            "57": { id: 57, name: 'Maps', rank: 1, value: 6, type: 'Numbered' },
            "58": { id: 58, name: 'Maps', rank: 1, value: 7, type: 'Numbered' },
            "59": { id: 59, name: 'Maps', rank: 1, value: 8, type: 'Numbered' },
            "60": { id: 60, name: 'Maps', rank: 1, value: 9, type: 'Numbered' },
            "61": { id: 61, name: 'Maps', rank: 1, value: 10, type: 'Numbered' },
            "62": { id: 62, name: 'Maps', rank: 1, value: 11, type: 'Numbered' },
            "63": { id: 63, name: 'Maps', rank: 1, value: 12, type: 'Numbered' },
            "64": { id: 64, name: 'Maps', rank: 1, value: 13, type: 'Numbered' },
            "65": { id: 65, name: 'Maps', rank: 1, value: 14, type: 'Numbered' },
            "66": { id: 66, name: 'Escape', rank: 0, value: 0, type: 'Wildcard' },
            "67": { id: 67, name: 'Escape', rank: 0, value: 0, type: 'Wildcard' },
            "68": { id: 68, name: 'Escape', rank: 0, value: 0, type: 'Wildcard' },
            "69": { id: 69, name: 'Escape', rank: 0, value: 0, type: 'Wildcard' },
            "70": { id: 70, name: 'Escape', rank: 0, value: 0, type: 'Wildcard' },
            "71": { id: 71, name: 'Loot', rank: 0, value: 0, type: 'Wildcard' },
            "72": { id: 72, name: 'Loot', rank: 0, value: 0, type: 'Wildcard' },
            "73": { id: 73, name: 'Kraken', rank: 4, value: 0, type: 'Event' },
            "74": { id: 74, name: 'White Whale', rank: 4, value: 0, type: 'Event' },
        },
        New: {
            // Non-classic Cards
            // The next sub-round, a Numbered of choice will swap effects with Jolly Ranger
            "75": { id: 75, name: 'Drunken Sailor', rank: 3, value: 0, type: 'Pirate' },
            // The following round, everyone bets blindly.
            "76": { id: 76, name: 'Fog', rank: 0, value: 0, type: 'Weather' },
            // [Optional] Swap one card with a foe of choice.
            // Swapped card from foe is selected at random.
            // Effect takes place at end of subround
            "77": { id: 77, name: 'Trade Route', rank: 0, value: 0, type: 'Action' },
            // Add / Remove a bet to the winner of the card being played.
            "78": { id: 78, name: 'Sabotage', rank: 0, value: 0, type: 'Action' },
            // Shuffles bets between everyone.
            "79": { id: 79, name: 'Tavern', rank: 0, value: 0, type: 'Action' },
            // Takes the effect of a card of choice which has been played previously.
            "80": { id: 80, name: 'Ghost Ship', rank: 0, value: 0, type: 'Ghost Ship' },
        }
    }

    // getDeckLength returns the length of a deck
    function getDeckLength(deck) {
        if (deck in Decks) {
            return Object.keys(Decks[deck]).length;
        }
        return 0;
    }

    // getFullDeckLength obtains the combined length of the deck
    function getFullDeckLength() {
        let deck_length = 0;
        for (let deck in Decks) {
            deck_length += Object.keys(Decks[deck]).length;
        }
        return deck_length;
    }

    // getCard returns the corresponding card from the Deck
    function getCard(id) {
        for (let deck in Decks) {
            if (id in Decks[deck]) return Decks[deck][id];
        }
        return {};
    }

    return {
        getDeckLength: getDeckLength,
        getCard: getCard,
        getFullDeckLength: getFullDeckLength,
        Decks: Decks,
    };

})();

module.exports = {
    Deck: DECK,
}