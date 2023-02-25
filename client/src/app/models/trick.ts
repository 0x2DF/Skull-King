import { PlayerCard } from './playercard';

export interface Trick {
    lead : string;
    to_play : string;
    cards : PlayerCard[];
    winner : PlayerCard;
}
