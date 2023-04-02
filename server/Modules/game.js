const DECK = require("../Models/Deck");
const STATES = require("../Models/State");

const States = STATES.States;
const Deck = DECK.Deck;

var GAME = (function() {
    'use strict';

    const GAME_MODES = [
        "Standard",
        "Versus",   // Two players
    ];

    const GAME_SCORING_MODES = [
        "Skull King's", // Standard
        "Rascal's",
    ];

    const GAME_CARD_COUNTS = [
        "Standard",
        "Even Keeled",
        "Skip to the brawl",
        "Swift-n-Salty Skirmish",
        "Broadside Barrage",
        "Whirpool",
        "Past Your Bedtime",
    ];

    const GAME_DECK_MODE = [
        "Legacy",
        "Full"
    ]

    const FIRST_ROUND = 0
    const FIRST_TRICK = 0
    const ROUND_TOTAL = 10

    // Error Codes & Messages.
    const _ERR_GAME_BET_OUT_OF_BOUNDS = "GameBetOutsideOfBounds";
    const _ERR_GAME_CLIENT_DOES_NOT_EXIST = "GameClientDoesNotExist";
    const _ERR_GAME_INCORRECT_STATE = "GameIncorrectState";
    const _ERR_GAME_INVALID_CARD = "GameInvalidCard";
    const _ERR_GAME_INVALID_CODE = "GameInvalidCode";
    const _ERR_GAME_NOT_PLAYERS_TURN = "GameNotPlayersTurn";
    const _ERR_GAME_NOT_PLAYERS_TURN_RESOLVE = "GameNotPlayersTurnResolve";
    const _ERR_GAME_PLAYER_MISSING_CARD = "GamePlayerMissingCard";
    const _ERR_GAME_PLAYER_NOT_FOUND = "GamePlayerNotFound";
    const _ERR_GAME_UNKNOWN_CARD_TYPE = "GameUnknownCardType";

    const _ERR_MSG_GAME_BET_OUT_OF_BOUNDS = "Bet value must be between 0 and Round #.";
    const _ERR_MSG_GAME_CLIENT_DOES_NOT_EXIST = "Client does not exist.";
    const _ERR_MSG_GAME_INCORRECT_STATE = "Game is not in the appropiate state.";
    const _ERR_MSG_GAME_INVALID_CARD = "You are attempting to use an invalid card.";
    const _ERR_MSG_GAME_INVALID_CODE = "Game does not exist.";
    const _ERR_MSG_GAME_NOT_PLAYERS_TURN = "You can only play during your turn.";
    const _ERR_MSG_GAME_NOT_PLAYERS_TURN_RESOLVE = "Only the winner of the trick can resolve.";
    const _ERR_MSG_GAME_PLAYER_MISSING_CARD = "You do not possess the card you are attempting to play.";
    const _ERR_MSG_GAME_PLAYER_NOT_FOUND = "Player is not part of game.";
    const _ERR_MSG_GAME_UNKNOWN_CARD_TYPE = "Attempting to handle the effect of an unknown card.";
    
    const _GAME_TRICK_WINNER = "GameTrickOver";
    var _MSG_GAME_TRICK_WINNER = `{} wins the trick!`;

    // Card strings.
    const _CARD_NAME_JOLLY_RANGER = "Jolly Ranger";

    const _STR_ERROR = "error"
    const _STR_GAME = "game"
    const _STR_ID = "id"
    const _STR_BID = "bid"
    const _STR_PID = "pid"
    const _STR_CARDS = "cards"

    let games = {};

    // ================================================ //
    // Public functionality exposed by the server's API //
    // ================================================ //

    // Initializes a new game from an existing lobby.
    function startGame(lobby_code, lobbies, clients) {
        _initGame(lobbies[lobby_code], clients);
        _dealCards(lobby_code);

        console.log(`Games TOTAL : ${Object.keys(games).length}`);

        return {
            game : _redactGame(games[lobby_code]),
        };
    }

    // Updates the cards in the players hand.
    function refreshHand(socket, clients) {
        let response = _validateGame(socket, clients, null);
        if (_STR_ERROR in response) return response;

        return _getPlayerHand(response.game_code, response.player_index);
    }
    
    // Updates the betting data.
    function placeBet(socket, bet, clients) {
        let response = _validateGame(socket, clients, States.betting);
        if (_STR_ERROR in response) return response;

        return _setBet(response.game_code, response.player_index, bet);
    }
    
    // Attempts to play a card.
    function playCard(socket, card, clients) {
        let response = _validateGame(socket, clients, States.playing);
        if (_STR_ERROR in response) return response;

        const code = response.game_code;
        const player_index  = response.player_index;

        response = _playCard(code, player_index, card);
        if (_STR_ERROR in response) return response;

        let hand_response = _getPlayerHand(code, player_index);

        return {
            game    : _redactGame(games[code]),
            hand    : hand_response.hand,
            message : response.message
        };
    }

    // Obtains trick resolution data.
    function getTrickResolutionData(socket, clients) {
        let response = _validateGame(socket, clients, States.trickResolution);
        if (_STR_ERROR in response) return response;

        const code = response.game_code;
        const player_index  = response.player_index;

        let data = _getTrickResolution(code, player_index);
        if (_STR_ERROR in data || _STR_GAME in data) return data;

        let hand_response = _getPlayerHand(code, player_index);

        return {
            hand: hand_response.hand,
            card: data.card,
            data: data.data,
        }
    }

    // Handles trick resolution.
    function handleTrickResolution(socket, clients, data) {
        let response = _validateGame(socket, clients, States.trickResolution);
        if (_STR_ERROR in response) return response;

        const code = response.game_code;
        const player_index  = response.player_index;
        response = _handleTrickResolution(code, player_index, data);
        if (_STR_ERROR in response) return response;

        let hand_response = _getPlayerHand(code, player_index);

        return {
            hand: hand_response.hand,
            game: _redactGame(games[code]),
        }
    }

    // Removes a client from its associated lobby.
    function disconnect(socket, clients) {
        let response = _validateGame(socket, clients, null);
        if (_STR_ERROR in response) return {};

        const code = response.game_code;
        const player_index = response.player_index;
        const player_handle = games[code].players[player_index].handle;


        // Update rounds and tricks
        //_removePlayerFromRounds();

        // Remove player
        games[code].players.splice(player_index, 1);

        if (games[code].players.length == 0)
        {
            delete games[code];
            return {};
        } else {
            return {
                game : _redactGame(games[code]),
            };
        }
    }


    // ===================== //
    // Private functionality //
    // ===================== //

    // -------------- //
    // Initialization //

    // Initializes a new game from an existing lobby.
    function _initGame(lobby, clients) {
        games[lobby.code] = {
            settings : _initSettings(lobby),
            details : _initDetails(lobby),
            players : _initPlayers(lobby, clients),
            rounds : _initRounds(lobby, clients)
        };
    }

    // Return new game settings.
    function _initSettings(lobby) {
        return {
            game_mode : GAME_MODES[0],
            scoring_mode : GAME_SCORING_MODES[0],
            card_count_mode : GAME_CARD_COUNTS[0],
            deck_mode : GAME_DECK_MODE[0],
            total_rounds : ROUND_TOTAL,
            trick_time : 15,
            bet_time : 30,
        };
    }
    
    // Return new game details.
    function _initDetails(lobby) {
        return {
            code: lobby.code,
            state: States.betting,
            round: FIRST_ROUND,
            trick: FIRST_ROUND,
            winning: null,
            leading: true,
            weather: null,
            event: null,
        };
    }

    // Returns a list of players.
    function _initPlayers(lobby, clients)
    {
        let players = [];
        for (const id in lobby.clients)
        {
            const socket_id = lobby.clients[id];
            let player = {
                id : socket_id,
                handle : clients[socket_id].handle,
                bet : 0,
                tricks_won : 0,
                score : 0,
                hand : [],
            };
            players.push(player);
        }
        return _shuffle(players);
    }

    // Returns a new list of rounds.
    function _initRounds(lobby, clients) {
        let rounds = [];
        for (const i of Array(ROUND_TOTAL).keys()) {
            rounds.push(_initRound(lobby, clients, i));
        }

        // Select random player to lead the first round.
        const lobby_index = Math.floor(Math.random() * lobby.clients.length);
        const id = lobby.clients[lobby_index];
        rounds[FIRST_ROUND].lead = clients[id].handle;
        // This player will also lead the first trick.
        rounds[FIRST_ROUND].tricks[FIRST_TRICK].lead = clients[id].handle;
        rounds[FIRST_ROUND].tricks[FIRST_TRICK].to_play = clients[id].handle;

        return rounds;
    }

    // Returns a new round
    function _initRound(lobby, clients, round_number) {
        let round = {
            lead : null,
            tricks : [],
            bets : {},
            deck : [],
        };

        for (const i of Array(round_number + 1).keys()) {
            round.tricks.push(_initTrick())
        }
        
        for (const index in lobby.clients) {
            const id = lobby.clients[index];
            round.bets[ clients[id].handle ] = null;
        };

        return round;
    }

    // Returns a new trick
    function _initTrick() {
        let trick = {
            lead: null,
            to_play: null,
            cards: [],
            winner: null,
            points: 0,
        }
        return trick;
    }

    // Distribute an equal amout of cards to each player in the game.
    // Amount of cards dealt depends on the round.
    // Cards are taken from a single deck.
    function _dealCards(code) {
        let round = games[code].details.round;
        // Populate deck of cards.
        for (const index of Array(Deck.getDeckLength(GAME_DECK_MODE[0])).keys()) {
            games[code].rounds[round].deck.push(index + 1);
        }
        _shuffle(games[code].rounds[round].deck);
    
        _distributeCards(code, games[code].rounds[round].deck);
    }

    // Deal one card to each player for each trick in the round.
    // Round #3 = 3 tricks played that round
    function _distributeCards(code, cards) {
        let round = games[code].details.round;
        while (round + 1 > 0) {
            for (const player_index in games[code].players) {
                // Deal random card.
                let card_index = Math.floor(Math.random() * cards.length);
                // const card = Deck.getCard(cards[card_index]);
                const card = Deck.getCard(cards.splice(card_index, 1));
                let new_card = {
                    id: card.id,
                    name: card.name,
                    rank: card.rank,
                    value: card.value,
                    type: card.type,
                }
                games[code].players[player_index].hand.push(new_card);
                // Remove card from deck.
                // cards.splice(card_index, 1);
            }
            round--;
        }
    }


    // --------------- //
    // Refreshing hand //

    // Obtains the clients hand in a game.
    function _getPlayerHand(code, player_index) {
        const player = games[code].players[player_index];

        // Does the player possess a card with a suit that matches the leading card?
        const can_match_leading_suit = _hasMatchingLeadingCardSuit(code, player.hand);

        // Update the player's hand
        let player_hand = [];
        for (const hand_index in player.hand) {
            let card = {
                id: player.hand[hand_index].id,
                name: player.hand[hand_index].name,
                rank: player.hand[hand_index].rank,
                value: player.hand[hand_index].value,
                type: player.hand[hand_index].type,
                valid: _isCardValid(code, player.hand[hand_index], can_match_leading_suit),
            };

            player_hand.push(card);
        }
        return { hand: player_hand };
    }


    // ------- //
    // Betting //

    // Places a bet in the current round
    function _setBet(code, player_index, bet) {
        const round = games[code].details.round;

        // Bet value must be between 0 -> Round #
        if (bet < 0 || bet > (round + 1)) {
            return { error: { name: _ERR_GAME_BET_OUT_OF_BOUNDS, description: _ERR_MSG_GAME_BET_OUT_OF_BOUNDS } };
        }

        const player = games[code].players[player_index];

        // Update the hidden player's bet value
        games[code].rounds[round].bets[ player.handle ] = bet;

        if (_haveAllPlayersBet(code)) {
            _updatePlayerBets(code);
            games[code].details.state = States.playing;
            return {
                game : _redactGame(games[code]),
            };
        }

        return {};
    }

    // Checks if all the players have bet yet.
    // The players bet is initially hidden in the round data.
    function _haveAllPlayersBet(code) {
        const round = games[code].details.round;
        for (const player in games[code].rounds[round].bets){
            if (games[code].rounds[round].bets[player] == null) {
                return false
            }
        }
        return true;
    }

    // Updates the player's bet with their hidden bet value.
    // On timeout, bet is defaulted to 0
    function _updatePlayerBets(code) {
        const round = games[code].details.round;
        for (const player_index in games[code].players) {
            const player = games[code].players[player_index];
            let bet = games[code].rounds[round].bets[player.handle];
            // Time ran out
            if (bet == null) {
                games[code].players[player_index].bet = 0;
            } else {
                games[code].players[player_index].bet = bet;
            }
        }
    }


    // ------------ //
    // Playing card //

    // Atempts to play a card;
    // + Needs to be players turn.
    // + The player needs to be in possesion of the card.
    // + The card must be a valid to play.
    function _playCard(code, player_index, card) {
        const player = games[code].players[player_index];
        const round = games[code].details.round;
        const trick = games[code].details.trick;

        // Check if its the players turn.
        if (games[code].rounds[round].tricks[trick].to_play != player.handle) {
            return { error: { name: _ERR_GAME_NOT_PLAYERS_TURN, description: _ERR_MSG_GAME_NOT_PLAYERS_TURN } };
        }

        // Check if the user possess the card he wants to play
        const hand_index = _getCardIndexFromHand(code, player_index, card);
        if (hand_index == -1) {
            return { error: { name: _ERR_GAME_PLAYER_MISSING_CARD, description: _ERR_MSG_GAME_PLAYER_MISSING_CARD } };
        }

        // Verify if the card can be played;
        // Does the player possess a card with a suit that matches the leading card?
        const can_match_leading_suit = _hasMatchingLeadingCardSuit(code, player.hand);

        if ( _isCardValid(code, player.hand[hand_index], can_match_leading_suit) == false) {
            return { error: { name: _ERR_GAME_INVALID_CARD, description: _ERR_MSG_GAME_INVALID_CARD } };
        }

        _changeNextTurn(code, player_index)

        _handleCardEffect(code, player_index, player.hand[hand_index], card);

        _addCardToTrickList(code, player_index, player.hand[hand_index]);

        _updateWinningCard(code, player_index, player.hand[hand_index]);

        _removeCardFromHand(code, player_index, hand_index);

        if (_hasEveryonePlayed(code, trick, round)) {
            return _resolveTrick(code, trick, round);
        }

        return { message : {} };
    }

    // Moves the turn to the next player.
    function _changeNextTurn(code, player_index) {
        const round = games[code].details.round;
        const trick = games[code].details.trick;

        const index = (player_index + 1) % games[code].players.length;
        games[code].rounds[round].tricks[trick].to_play = games[code].players[index].handle;
    }

    // Pushes a card to the trick list.
    function _addCardToTrickList(code, player_index, card) {
        const player_card = {
            player: games[code].players[player_index].handle,
            card: card
        }

        const round = games[code].details.round;
        const trick = games[code].details.trick;
        games[code].rounds[round].tricks[trick].cards.push(player_card);
    }

    // Updates winning card
    function _updateWinningCard(code, player_index, card) {
        // No current winning card.
        if (games[code].details.winning == null) {
            _setWinning(code, player_index, card);

            // Set leading rule to false if a special card other than Wildcard has been played.
            if (['Numbered', 'Wildcard'].includes(card.type) == false) {
                _setLeading(code, false);
            }
            return;
        }

        const winning_card = games[code].details.winning.card;

        // Handle event card rules.
        if (games[code].details.event != null) {
            _updateWinningCardOnEventRules(code, winning_card, player_index, card);
            return;
        }

        // Higher ranked card is played.
        if (card.rank > winning_card.rank) {
            _setWinning(code, player_index, card);
            _setLeading(code, false);
            return;
        }

        // Same ranked card is played.
        if (card.rank == winning_card.rank) {
            _updateWinningCardOnSameRank(code, winning_card, player_index, card)
        }
    }

    // Updates winning card when there was an event card played.
    function _updateWinningCardOnEventRules(code, winning_card, player_index, card) {
        switch (games[code].details.event.card.name) {
            case 'Kraken':
                break;
            // White Whale effect decides the winner by value
            case 'White Whale':
                if (card.value > winning_card.value) {
                    _setWinning(code, player_index, card);
                }
                break;
            default:
                break;
        }
        return;
    }

    // Updates winning card when there was a match between the played and winning cards rank.
    function _updateWinningCardOnSameRank(code, winning_card, player_index, card) {
        switch (winning_card.rank) {
            case 0:
                break;
            case 1:
            case 2:
                if ((card.name == winning_card.name) &&
                    (card.value > winning_card.value)) {
                    _setWinning(code, player_index, card);
                }
                break;
            case 3:
                if (card.type == winning_card.type) return;

                const sk_played = _TrickContainsCard(code, 'Skull King');
                const mermaid_played = _TrickContainsCard(code, 'Mermaid');
                if ((card.type == 'Mermaid' && sk_played == true) ||
                    (card.type == 'Pirate' && sk_played == false) ||
                    (card.type == 'Skull King' && mermaid_played == false)) {
                    _setWinning(code, player_index, card);
                }
                break;
            default:
                console.log("Unexpected card rank");
        }
        return;
    }

    // Updates the trick winner and prepares the next trick/round.
    function _resolveTrick(code, trick, round) {
        games[code].details.state = States.trickResolution;

        _updateTrickWinner(code, trick, round);

        _concludeTrick(code, trick, round);

        return { message: { name: _GAME_TRICK_WINNER, description: _MSG_GAME_TRICK_WINNER.format(games[code].rounds[round].tricks[trick].winner.player)}  };
    }

    // Updates the winner of the trick.
    function _updateTrickWinner(code, trick, round) {
        const winner = games[code].details.winning;

        const winner_handle = (winner.card.name != 'Kraken' ? winner.player : null);

        games[code].rounds[round].tricks[trick].winner = {
            player: winner_handle,
            card: winner.card,
        }

        // Update the player's trick_won count
        const winner_index = _getPlayerIndexByHandle(winner_handle, code);
        if (winner_index != -1) {
            games[code].players[winner_index].tricks_won += 1;
        }
    }

    // Concludes trick, and if round is over, resolves round.
    function _concludeTrick(code, trick, round) {
        // Check if the round is over.
        if (trick == round){
            _resolveRound(code);
        }else{
            // Prepares the game values for following trick.
            if (_IsCardResolutionRequired(code) == false) {
                _prepareNextTrick(code);
            }
        }
    }

    // Prepares the following trick.
    function _prepareNextTrick(code){
        games[code].details.state = States.playing;
        games[code].details.trick += 1;
        _setNewTrickLead(code);
        _resetGameDetails(code);
    }

    // Tallies up player score and moves the game to the next round.
    function _resolveRound(code) {
        // Update players score
        _updatePlayersScore(code);

        // Start next round
        games[code].details.round += 1;
        games[code].details.trick = 0;

        if (games[code].details.round >= games[code].settings.total_rounds){
            games[code].details.state = States.scoreboard;
        }else{
            _resetRound(code);
            
            const new_lead = _setNewTrickLead(code);
            
            // Set new round lead.
            const round = games[code].details.round;
            games[code].rounds[round].lead = new_lead;

            _dealCards(code);
            games[code].details.state = States.betting;
        }
    }

    // Resets round values.
    function _resetRound(code){
        _resetGameDetails(code);
        for (const index in games[code].players) {
            games[code].players[index].bet = 0;
            games[code].players[index].tricks_won = 0;
            games[code].players[index].hand = [];
        }
    }

    // Sets the lead for the next trick.
    function _setNewTrickLead(code) {
        const round = games[code].details.round;
        const trick = games[code].details.trick;

        const new_lead = _getNewLead(code);
        games[code].rounds[round].tricks[trick].lead = new_lead;
        games[code].rounds[round].tricks[trick].to_play = new_lead;

        return new_lead;
    }

    // Next trick lead is determined by the previous winner. 
    // In case of no previous winner, use previous lead.
    function _getNewLead(code) {
        const previous_winner = _getPreviousTrickWinner(code)
        if (previous_winner == null) {
            const previous_lead = _getPreviousLead(code)
            // If round lead disconnected, generate a new round lead.
            if (previous_lead == null) {
                return _generateRoundLead(code);
            } else {
                return previous_lead;
            }
        }else {
            return previous_winner.player;
        }
    }

    // Obtain previous trick winner, null if no previous winner.
    function _getPreviousTrickWinner(code) {
        let round = games[code].details.round;
        let trick = games[code].details.trick;

        if (trick == 0) {
            trick = round = round - 1;
        }

        if (trick >= 0) {
            for (var trick_index = trick; trick_index >= 0; --trick_index) {
                const last_winner = games[code].rounds[round].tricks[trick_index].winner
                if (last_winner != null) {
                    const player_index = _getPlayerIndexByHandle(last_winner.player, code)
                    if (player_index != -1) {
                        return last_winner
                    }
                }
            }
        }
        // No previous winner.
        return null;
    }

    // Obtain previous round lead.
    function _getPreviousLead(code) {
        let round = games[code].details.round;

        if (games[code].rounds[round].lead == null) {
            round = round - 1;
        }

        if (round >= 0) {
            return games[code].rounds[round].lead;
        }
        // No previous winner.
        return null;
    }

    // Reset game details.
    function _resetGameDetails(code) {
        games[code].details.winning = null;
        games[code].details.leading = true;
        games[code].details.weather = null;
        games[code].details.event = null;
    }


    // ------------- //
    // Card Handling //

    // Handles any card effect
    function _handleCardEffect(code, player_index, true_card, card) {
        switch (true_card.type) {
            case 'Numbered':
            case 'Mermaid':
                break;
            case 'Pirate':
                _handlePirateCard(code, player_index, true_card, card);
                break;
            case 'Wildcard':
                _handleWildcard(code, player_index, true_card, card);
                break;
            case 'Event':
                _handleEventCard(code, player_index, true_card);
                break;
            default:
                return { error: { name: _ERR_GAME_UNKNOWN_CARD_TYPE, description: _ERR_MSG_GAME_UNKNOWN_CARD_TYPE } };
        }
        return {};
    }

    // Handle pirate card effects
    function _handlePirateCard(code, player_index, true_card, card) {
        switch (true_card.name) {
            case 'Skull King':
                break;
            case 'Bendt the Bandit':
                break;
            case 'Harry the Giant':
                break;
            case 'Juanita Jade':
                break;
            case 'Rascal of Rotan':
                break;
            case 'Rosie de Laney':
                break;
            case 'Tigress':
                if (card.type == 'Wildcard') {
                    true_card.type = 'Wildcard';
                    true_card.rank = 0;
                }
                break;
            default:
                console.log("Unknown pirate");
                break;
        }

    }

    // Handle wildcards effects
    function _handleWildcard(code, player_index, true_card, card) {
        switch (true_card.name) {
            case 'Escape':
                break;
            case 'Loot':
                // TODO: create alliance
                break;
            default:
                console.log("Unknown wildcard");
                break;
        }

    }

    // Handle wildcards effects
    function _handleEventCard(code, player_index, card) {
        switch (card.name) {
            case 'Kraken':
                _setEvent(code, player_index, card);
                _setWinning(code, player_index, card);
                _setLeading(code, false);
                break;
            case 'White Whale':
                _setEvent(code, player_index, card);
                let highest_value_player_card = _getHighestValueCardFromTrick(code);
                if (highest_value_player_card != null) {
                    let player_card_index = _getPlayerIndexByHandle(highest_value_player_card.player, code);
                    _setWinning(code, player_card_index, highest_value_player_card.card);
                } else {
                    _setWinning(code, player_index, card);
                }
                _setLeading(code, false);
                break;
            default:
                console.log("Unknown event card");
                break;
        }

    }


    // ---------------- //
    // Trick Resolution //

    // Updates the players score for the round.
    function _getTrickResolution(code, player_index) {
        if (_IsCardResolutionRequired(code) == false) {
            // Trick no longer needs to be resolved.
            _prepareNextTrick(code);
            return { game : _redactGame(games[code]) };
        }
        const player = games[code].players[player_index];
        const round = games[code].details.round;
        const trick = games[code].details.trick;
        const winning_card = games[code].rounds[round].tricks[trick].winner;
        if (player.handle != winning_card.player) {
            return { error: { name: _ERR_GAME_NOT_PLAYERS_TURN_RESOLVE, description: _ERR_MSG_GAME_NOT_PLAYERS_TURN_RESOLVE } };
        }

        return { card : winning_card.card, data : _getPirateData(code, winning_card.card, player_index) };
    }

    // Checks if winning card needs resolution stage.
    function _IsCardResolutionRequired(code) {
        const round = games[code].details.round;
        const trick = games[code].details.trick;

        let winner_card = games[code].rounds[round].tricks[trick].winner.card;
        return (_isPirate(winner_card) && ['Tigress'].includes(winner_card.name) == false);
    }

    // Prepares pirate resolution data.
    function _getPirateData(code, winning_card, player_index) {
        switch(winning_card.name) {
            // Privately look through any cards not dealt that
            // round to see which are not in play.
            case 'Juanita Jade':
                return _getDeck(code);
            // Add 2 cards to your hand from the deck, then discard 2 cards.
            case 'Bendt the Bandit':
                const player = games[code].players[player_index];
                player.hand.push(_removeRandomCardFromDeck(code));
                player.hand.push(_removeRandomCardFromDeck(code));
            case 'Harry the Giant':
            case 'Rascal of Rotan':
            case 'Rosie de Laney':
                return {};
        }
        return {};
    }

    // Handles trick resolution.
    function _handleTrickResolution(code, player_index, data) {
        if (_IsCardResolutionRequired(code) == false) {
            // Trick no longer needs to be resolved.
            _prepareNextTrick(code);
            return {};
        }

        const player = games[code].players[player_index];
        const round = games[code].details.round;
        const trick = games[code].details.trick;
        const winning_card = games[code].rounds[round].tricks[trick].winner;
        if (player.handle != winning_card.player) {
            return { error: { name: _ERR_GAME_NOT_PLAYERS_TURN_RESOLVE, description: _ERR_MSG_GAME_NOT_PLAYERS_TURN_RESOLVE } };
        }
        
        _prepareNextTrick(code);
        _handlePirateData(code, winning_card.card, player_index, data);
        return {};
    }

    // Handles pirate resolution data.
    function _handlePirateData(code, winning_card, player_index, data) {
        switch(winning_card.name) {
            // Add 2 cards to your hand from the deck, then discard 2 cards.
            case 'Bendt the Bandit':
                // No data : default remove last 2 cards.
                if (data.data == null) {
                    let card_index = games[code].players[player_index].hand.length - 1;
                    _removeCardFromHand(code, player_index, card_index);
                    _removeCardFromHand(code, player_index, card_index - 1);
                    break;
                }

                if (_STR_CARDS in data.data &&
                    data.data.cards instanceof Array &&
                    data.data.cards.length == 2) {
                    
                    for (const card in data.data.cards) {
                        let true_card = {};
                        if (_STR_ID in data.data.cards[card]) {
                            true_card = Deck.getCard(data.data.cards[card].id);
                        }
                        if (!(_STR_ID in true_card)) {
                            let card_index = games[code].players[player_index].hand.length - 1;
                            _removeCardFromHand(code, player_index, card_index);
                            break;
                        }
                        let card_index = _getCardIndexFromHand(code, player_index, true_card);
                        _removeCardFromHand(code, player_index, card_index);
                    }
                } else {
                    // No data : default remove last 2 cards.
                    let card_index = games[code].players[player_index].hand.length - 1;
                    _removeCardFromHand(code, player_index, card_index);
                    _removeCardFromHand(code, player_index, card_index - 1);
                }
                break;
            // Chose to change your bid by plus or minus 1, or leave it the same.
            case 'Harry the Giant':
                if (data.data == null) {
                    break;
                } else if (_STR_BID in data.data &&
                    (data.data.bid == -1 || data.data.bid == 1)) {
                    games[code].players[player_index].bet += data.data.bid;
                }
                break;
            // Bet 0, 10, or 20 points. Earn the points if you bid correct, lose them if
            // you fail!
            case 'Rascal of Rotan':
                // TODO
                break;
            // Choose any player, including yourself, to lead the next trick.
            case 'Rosie de Laney':
                if (data.data == null) {
                    break;
                } else if (_STR_PID in data.data &&
                    (data.data.pid >= 0 && data.data.pid <= games[code].players.length - 1)) {
                    
                    const round = games[code].details.round;
                    const trick = games[code].details.trick;
                    const player = games[code].players[data.data.pid];
                    games[code].rounds[round].tricks[trick].lead = player.handle;
                    games[code].rounds[round].tricks[trick].to_play = player.handle;
                    break;
                }
                break;
            case 'Juanita Jade':
                break;
        }
    }


    // ------- //
    // Scoring //

    // Updates the players score for the round.
    function _updatePlayersScore(code)
    {
        let round = games[code].details.round + 1;
        for (let player_index in games[code].players){

            let player = games[code].players[player_index];
            if (player.bet == player.tricks_won)
            {
                if (player.bet == 0) {
                    games[code].players[player_index].score += round * 10;
                }
                else {
                    games[code].players[player_index].score += player.bet * 20;
                }
                _bonusPoints(code, player_index);
            }else{
                if (player.bet == 0) {
                    games[code].players[player_index].score -= round * 10;
                }
                else {
                    games[code].players[player_index].score -= Math.abs(player.bet - player.tricks_won) * 10;
                }
            }
        }
    }

    // Calculates bonus points obtained by a player.
    function _bonusPoints(code, player_index)
    {
        
    }


    // ------ //
    // Common //

    // Re-organizes a list in a random order.
    function _shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
    
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
    
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
        }
    
        return array;
    }

    // Generate a random lead for the round.
    function _generateRoundLead(code) {
        const players_index = Math.floor(Math.random() * games[code].players.length);
        return games[code].players[players_index].handle;
    }

    // Searches for a player by id
    // -1 if not found.
    function _getPlayerIndex(id, code) {
        var len = games[code].players.length;
        for (var index = 0; index < len; ++index) {
            if (games[code].players[index].id == id) return index;
        }
        return -1;
    }

    // Searches for a player by handle
    // -1 if not found.
    function _getPlayerIndexByHandle(handle, code) {
        var len = games[code].players.length;
        for (var index = 0; index < len; ++index) {
            if (games[code].players[index].handle == handle) return index;
        }
        return -1;
    }

    // Obtains the index of a card from a player's hand
    function _getCardIndexFromHand(code, player_index, card) {
        const hand = games[code].players[player_index].hand;
        var len = hand.length;
        for (var index = 0; index < len; ++index) {
            const hand_card = hand[index];
            if (_areMatchingCards(hand_card, card)) {
                return index;
            }
        }
        return -1;
    }

    // Does the user possess a card that matches the suit of the leading card?
    function _hasMatchingLeadingCardSuit(code, hand) {

        // Leading (winning) card has not been set or leading rule no longer applies.
        if (games[code].details.winning == null ||
            games[code].details.leading == false ) return false;

        const leading_card = games[code].details.winning.card;

        // Check if the user has a card with the same suit as the leading card.
        for (let hand_index in hand) {
            const card = hand[hand_index];
            if (leading_card.name == card.name) return true;
        }
        return false;
    }

    // A card is valid if one of the following conditions is TRUE:
    // + Leading (winning) card has not been set.
    // + Leading rule is not in effect.
    // + The player has no card in his hand that matches the leading card's suit.
    // + The card IS NOT numbered
    // + The card is a Jolly Ranger
    // + The card matches the leading card's suit.
    function _isCardValid(code, card, can_match_leading_suit) {
        // Leading card has not been set.
        if (games[code].details.winning == null) { return true; }

        // If leading is enabled, leading card = winning card
        const leading_card = games[code].details.winning.card;

        // Leading card is a wildcard.
        if (_isWildcard(leading_card)) { return true; }

        if (
            // Leading rule is not in effect.
            (games[code].details.leading == false) ||
            // The player has a card that matches the leading suit.
            (can_match_leading_suit == false) ||
            // The card is special.
            _isSpecial(card) ||
            // The card is a Jolly Ranger
            (card.name == _CARD_NAME_JOLLY_RANGER) ||
            // The card matches the leading card's suit.
            (card.name == leading_card.name)) {
            return true;
        }

        return false;
    }

    // Returns true if the card is a numbered type.
    function _isNumbered(card) {
        return card.type == 'Numbered';
    }

    // Returns true if the card is a numbered type.
    function _isPirate(card) {
        return card.type == 'Pirate';
    }

    // Returns true if the card is a special type.
    function _isSpecial(card) {
        return _isNumbered(card) == false;
    }

    // Returns true if the card is wildcard type.
    function _isWildcard(card) {
        return card.type == 'Wildcard';
    }

    // Returns true if there is a match between the cards name and value.
    function _areMatchingCards(a, b) {
        // return (a.name == b.name) && (a.value == b.value);
        return (a.id == b.id);
    }

    // Returns true if the input card has been played.
    function _TrickContainsCard(code, card_type) {
        const round = games[code].details.round;
        const trick = games[code].details.trick;

        const cards = games[code].rounds[round].tricks[trick].cards;
        for (const card_index in cards) {
            const card = cards[card_index].card;
            if (card.type == card_type) return true;
        }
        return false;
    }

    // Sets the leading value.
    function _setLeading(code, enabled) {
        games[code].details.leading = enabled;
    }

    // Sets the winning card
    function _setWinning(code, player_index, card) {
        games[code].details.winning = {
            player: games[code].players[player_index].handle,
            card: card
        }
    }

    // Sets the event card
    function _setEvent(code, player_index, card) {
        games[code].details.event = {
            player: games[code].players[player_index].handle,
            card: card
        }
    }

    // Obtains the highest valued card from the list of cards played in the current trick.
    function _getHighestValueCardFromTrick(code) {
        const round = games[code].details.round;
        const trick = games[code].details.trick;

        const cards = games[code].rounds[round].tricks[trick].cards;
        let highest_card_index = -1;
        let highest_value = 0;
        for (let card_index in cards) {
            let card = cards[card_index].card;
            if (card.value > highest_value) {
                highest_card_index = card_index;
                highest_value = card.value;
            }
        }
        if (highest_card_index != -1) return cards[highest_card_index];
        return null;

    }

    // Randomly selects and takes out a card from the deck in play.
    function _removeRandomCardFromDeck(code) {
        const round = games[code].details.round;
        let card_index = Math.floor(Math.random() * games[code].rounds[round].deck.length);
        return Deck.getCard(games[code].rounds[round].deck.splice(card_index, 1));
    }

    // Obtains full data of the deck in play.
    function _getDeck(code) {
        const round = games[code].details.round;
        let deck = [];
        for (let index in games[code].rounds[round].deck) {
            deck.push(Deck.getCard(games[code].rounds[round].deck[index]));
        }
        return deck;
    }

    // Remove card from players hand.
    function _removeCardFromHand(code, player_index, card_index) {
        games[code].players[player_index].hand.splice(card_index, 1);
    }

    // Check if everyone has played a card.
    function _hasEveryonePlayed(code, trick, round) {
        return games[code].rounds[round].tricks[trick].to_play == 
        games[code].rounds[round].tricks[trick].lead;
    }

    // ---------------- //
    // Input validation //

    // Performs various validations with the incoming request.
    // + Client must exist
    // + Game must exist
    // + Player(Client) must be part of the game
    // If state is provided:
    // + Game must be in the provided state
    //
    // Responds with either:
    // + {error}
    // + {player_index, game_code}
    function _validateGame(socket, clients, state) {
        const id = socket.id;
        // Client must exist
        if (!(id in clients)) {
            return { error: { name: _ERR_GAME_CLIENT_DOES_NOT_EXIST, description: _ERR_MSG_GAME_CLIENT_DOES_NOT_EXIST } };
        }

        const code = clients[id].lobby_code;
        // Game must exist
        if (!(code in games)) {
            return { error: { name: _ERR_GAME_INVALID_CODE, description: _ERR_MSG_GAME_INVALID_CODE } };
        }

        // Player must be part of the game
        let player_index = _getPlayerIndex(id, code);
        if (player_index == -1) {
            return { error: { name: _ERR_GAME_PLAYER_NOT_FOUND, description: _ERR_MSG_GAME_PLAYER_NOT_FOUND } };
        }

        // If state is provided, the game must be in that state
        if ((state != null) && (games[code].details.state != state)) {
            return { error: { name: _ERR_GAME_INCORRECT_STATE, description: _ERR_MSG_GAME_INCORRECT_STATE } };
        }

        return { player_index: player_index, game_code: code };
    }


    // -------- //
    // Response //

    // Redacts sensitive information from the game data.
    function _redactGame(game) {
        let censored_game = {
            settings : game.settings,
            details : game.details,
            players : _redactPlayers(game.players),
            rounds : _redactRounds(game),
        };

        return censored_game;
    }

    // Redacts sensitive information from the players.
    // + client socket id
    // + hand cards
    function _redactPlayers(players) {
        let censored_players = [];
        for (let player_index in players) {
            let player = players[player_index];

            let censored_player = {
                handle : player.handle,
                // TODO: Censor player bet on weather Fog event
                bet : player.bet,
                tricks_won : player.tricks_won,
                score : player.score,
            };

            censored_players.push(censored_player);
        }
        return censored_players;
    }

    // Redacts betting information from the rounds.
    function _redactRounds(game) {
        let censored_rounds = [];
        for (let round in game.rounds) {
            let censored_round = {
                lead: game.rounds[round].lead,
                tricks: game.rounds[round].tricks,
            };
            censored_rounds.push(censored_round);
        }
        return censored_rounds;
    }

    return {
        disconnect: disconnect,
        startGame: startGame,
        refreshHand: refreshHand,
        placeBet: placeBet,
        playCard: playCard,
        getTrickResolutionData: getTrickResolutionData,
        handleTrickResolution: handleTrickResolution,
    };

})();

module.exports = {
    Game: GAME,
}