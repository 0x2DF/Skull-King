export interface Settings {
    game_mode: string;
    scoring_mode: string;
    card_count_mode: string;
    deck_mode: string;
    total_rounds: number;
    trick_time: number;
    bet_time: number;
}

export function Settings(): Settings {
    return {
        game_mode: "",
        scoring_mode: "",
        card_count_mode: "",
        deck_mode: "",
        total_rounds: 0,
        trick_time: 0,
        bet_time: 0,
    }
}