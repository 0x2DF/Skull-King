import { cilSettings } from '@coreui/icons';
import { Details } from './details';
import { Player } from './player';
import { Round } from './round';
import { Settings } from './settings';

export interface Game {
    settings: Settings;
    details: Details;
    players : Player[];
    rounds : Round[];
}

export function Game(): Game {
    return {
        settings: Settings(),
        details: Details(),
        players: <Player[]>([]),
        rounds: <Round[]>([]),
    }
}