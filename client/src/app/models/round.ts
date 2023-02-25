import { Trick } from './trick';
import { Player } from './player';

export interface Round {
    lead : string;
    tricks : Trick[];
}