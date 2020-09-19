import { Trick } from './trick';
import { Player } from './player';

export interface Game {
    room_code : string;
    state : string;
    to_play : number;
    round_lead : number;
    round : number;
    sub_round : number;
    total_rounds : number;
    round_time : number;
    bet_time : number;
    winning_trick : { trick: Trick, player_handle: string };
    players : Player[];
}
