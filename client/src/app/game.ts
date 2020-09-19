import { Trick } from './trick';
import { Player } from './player';

export interface Game {
    room_code : String;
    state : String;
    to_play : number;
    round_lead : Number;
    round : Number;
    sub_round : Number;
    total_rounds : Number;
    round_time : Number;
    bet_time : Number;
    winning_trick : { trick: Trick, player_handle: string };
    players : Player[];
}
