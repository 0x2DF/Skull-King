import { Card } from './card';
import { PlayerCard } from './playercard';

export interface Details {
    code: string;
    state: string;
    round: number;
    trick: number;
    winning: PlayerCard;
    leading: boolean;
    weather: Card;
    event: PlayerCard;
}

export function Details(): Details {
    return {
        code: "",
        state: "",
        round: 0,
        trick: 0,
        winning: PlayerCard(),
        leading: false,
        weather: Card(),
        event: PlayerCard(),
    }
}