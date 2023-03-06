import { Card } from './card';

export interface PlayerCard {
    card: Card;
    player : string;
}

export function PlayerCard(): PlayerCard {
    return {
        card: Card(),
        player: "",
    }
}