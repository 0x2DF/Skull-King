[*] = redacted to clients
[~] = not kept in memory, for clients use

# -- Client --

Clients[socket.id] = {
    lobby_code: string,
    handle: string
}

# -- Lobby --

Lobbies[code] = {
    code: string,
    [*] clients: [socket.id, ...],
    state: string,
    [*] admin: socket.id
}

# -- Game --

Games[code] = {
    settings: Settings,
    details: Details,
    [*] players: []Player,
    [*] rounds: []Round,
}

Settings = {
    game_mode: string,
    scoring_mode: string,
    card_count_mode: string,
    deck_mode: string,
    total_rounds: integer,
    trick_time: integer,
    bet_time: integer,
}

Details = {
    code: string,
    state: string,
    round: integer,
    trick: integer,
    winning: PlayerCard,
    leading: boolean,
    weather: Card,
    event: PlayerCard,
}

PlayerCard = {
    player: player_handle,
    card: Card,
},

Player[index] = {
    [*] id: socket.id,
    handle: string,
    bet: integer,
    tricks_won: integer,
    score: integer,
    [*] hand: []Card,
}

Round[Game.round] = {
    lead: player_handle,
    tricks: []Trick,
    [*] bets: {}Bets
    deck: []integer,
}

Trick[Game.trick] = {
    lead: player_handle,
    to_play: player_handle,
    cards: []PlayerCard,
    winner: PlayerCard,
    points: integer,
}

Bets[handle] = { integer }

# -- Deck --

Decks = {}Deck

Deck[name] = []Card

Card = {
    id: integer,
    name: string,
    rank: integer,
    value: integer,
    type: string,
    [~] valid: boolean
}

# -- Error --
Error = {
    name: string,
    description: string,
}