[] : states
{} : events

START -- { create-lobby } --> [Lobby: `waiting`]

[Lobby: `waiting`] -- { start-game } --> [Lobby: `in-progress`]
[Lobby: `waiting`] -- { start-game } --> [Game: `betting`]

[Game: `betting`] -- { All players: place-bet | bet_time_out } --> [Game: `playing`]

[Game.sub_state: `playing`] -- { trick_ends  } --> [Game.sub_state: `trick-resolution`] --> [Game.sub_state: `playing`]

[Game: `playing`] -- { round_ends  } --> [Game: `betting`]

[Game: `playing`] -- { game_ends  } --> END