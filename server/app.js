var Deck = require("./Models/Deck")

// #######
// Local
// #######

const express = require('express');
// let express = require('express')();
const app = express();
// let http = require('http').createServer(express);
let http = require('http').createServer(app);
let io = require('socket.io')(http);

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`https://skull-king-app.herokuapp.com:${PORT}`);
});


// #######
// Heroku
// #######

/*
const PORT = process.env.PORT || 3000;
const INDEX = '/Public/client/index.html';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const server = express()
  .use(express.static(__dirname + '/Public/client'))
  .get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/Public/client/index.html'));})
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
*/



const ROOM_CODE_LEN = 5;
const ROOM_TTL = 900;
const ROOM_MAX_USERS = 6;

let users = {};
let rooms = {};
let games = {};
let hands = {};

let private_games = {}; 

io.on("connection", socket => {

    socket.on('disconnect', () =>{
        // If user existed and room exists
        if ((socket.id in users) && (users[socket.id].room_code in rooms)){
            let room_code = users[socket.id].room_code;
            socket.leave(room_code);
            let index = rooms[room_code].users.indexOf(users[socket.id].handle);
            // If user is in that room
            if (index > -1){
                rooms[room_code].users.splice(index, 1);
                
                // If user is SK in that room
                if (rooms[room_code].SK == users[socket.id].handle){
                    if (rooms[room_code].users.length > 0){
                        rooms[room_code].SK = rooms[room_code].users[0];
                    }else{
                        rooms[room_code].SK = null;
                    }
                }
                
                // if game exists
                if (room_code in games){

                    let game_index = 0;
                    for (x in games[room_code].players) {
                        if (games[room_code].players.handle == users[socket.id].handle) game_index = x;
                    }
                    let private_game_index = 0;
                    for (x in private_games[room_code].players) {
                        if (private_games[room_code].players.handle == users[socket.id].handle) private_game_index = x;
                    }

                    // if user is in that game
                    if (game_index && private_game_index){
                        games[room_code].players.splice(game_index, 1);
                        private_games[room_code].players.splice(private_game_index, 1);
                        delete hands[socket.id];

                        delete private_games[room_code].rounds[games[room_code].round].bets[users[socket.id].handle];

                        if (games[room_code].to_play == game_index){
                            games[room_code].to_play = (games[room_code].to_play + 1) % games[room_code].players.length;
                        }
                        if (games[room_code].round_lead == game_index){
                            games[room_code].round_lead = (games[room_code].round_lead + 1) % games[room_code].players.length;
                        }

                        // if player has winning trick recalculate curr winner

                        if (games[room_code].players.length == 0)
                        {
                            delete games[room_code];
                            delete private_games[room_code];
                        }
                    }
                    

                    io.to(room_code).emit("refresh-game", { room : games[room_code] });
                }
                if (rooms[room_code]){
                    if (rooms[room_code].users.length == 0) delete rooms[room_code];
                    else io.to(room_code).emit("refresh-room", { room : rooms[room_code] });
                }
            }
            delete users[socket.id];
        }
    });

    socket.on('chat-message', (msg) => {
        if (socket.id in users){
            // console.log(`${users[socket.id].handle} : ${msg}`);
            socket.to(users[socket.id].room_code).emit('message-broadcast', {message : msg, handle : users[socket.id].handle});
        }
    });

    socket.on("find-room", data => {
        if (data.code in rooms){
            socket.emit("find-room", {room : rooms[data.code]});
        } else {
            socket.emit("find-room", {room : {code : '404'}})
        }
    });

    socket.on("create-room", data => {
        let code = generateRoomCode();

        rooms[code] = { code: code, users: [], state: "waiting", SK: null };

        socket.emit("create-room", {room : rooms[code]});
    });

    socket.on("join-room", data => {
        if (data.room.code in rooms){
            if (rooms[data.room.code].users.length < ROOM_MAX_USERS){
                if (rooms[data.room.code].state != "in-progress"){
                    if (!rooms[data.room.code].users.includes(data.user.handle)){
                        users[socket.id] = { id: socket.id, handle: data.user.handle, room_code: data.room.code};
                        rooms[data.room.code].users.push(users[socket.id].handle);

                        if (rooms[data.room.code].SK == null){
                            rooms[data.room.code].SK = users[socket.id].handle;
                        }

                        socket.join(data.room.code);
                        // console.log(`${socket.id} joined ${data.room.code}`);
                        

                        io.to(data.room.code).emit("refresh-room", {room : rooms[data.room.code]});
                    }else{
                        // console.log(`${data.user.handle} already in ${data.room.code}`);
                    }
                }else{
                    // console.log(`${data.room.code} is in progress`);
                }
            }else{
                // console.log(`${data.room.code} is full`);
            }
        }else{
            // console.log(`${data.room.code} not in rooms`);
        }
    });

    socket.on("start-lobby", data => {
        if (socket.id in users){
            let room_code = users[socket.id].room_code;
            if (room_code && room_code in rooms && rooms[room_code].users.length >= 2 && rooms[room_code].state == "waiting"){
                if (users[socket.id].handle == rooms[room_code].SK){
                    rooms[room_code].state = "in progress";
                    initGame(room_code);
                    dealCards(room_code);

                    // setTimeout((room_code, io) => {
                    //     commitBets(room_code);
                    //     io.to(room_code).emit("refresh-game", {game : games[room_code]});
                    // }, games[room_code].bet_timer * 1000, room_code, io);

                    io.to(room_code).emit("refresh-room", {room : rooms[room_code]});
                    io.to(room_code).emit("refresh-game", {game : games[room_code]});
                }
            }
        }
    });

    // when client receives refresh-game -> client emits refresh-hand to the server.
    socket.on("refresh-hand", data => {
        if (socket.id in users){
            let room_code = users[socket.id].room_code;
            if (room_code && room_code in games){
                updateHand(room_code, socket.id);
                socket.emit("refresh-hand", {hand : hands[socket.id]});
            }
        }
    });
    
    socket.on("make-bet", data => {
        if (socket.id in users){
            let room_code = users[socket.id].room_code;
            if (games[room_code].state == "betting" && (data.bet >= 0 && data.bet <= games[room_code].round)){
                bet(room_code, socket.id, data.bet);

                if (allBet(room_code)){
                    commitBets(room_code);
                    games[room_code].state = "playing";
                    io.to(room_code).emit("refresh-game", {game : games[room_code]});
                }
            }
        }
    });

    socket.on("play-trick", data => {
        // console.log("---------PLAY TRICK SOCKET---------")
        if (socket.id in users){
            let room_code = users[socket.id].room_code;
            // console.log(`${users[socket.id].handle} attempting to play:`)
            // console.log(data.trick);

            if (games[room_code] && games[room_code].state == "playing"){
                let player_index = getPlayerIndex(room_code, users[socket.id].handle);

                if (games[room_code].to_play == player_index){
                    let card_index = getCardIndex(room_code, socket.id, data.trick);
                    let is_valid = hands[socket.id][card_index].valid;
                    // let is_valid = private_games[room_code].players[ users[socket.id].handle ].hand[card_index].valid;
                    // console.log(`is_valid [play-trick] : ${is_valid}`);
                    // console.log(`valid-play: ${private_games[room_code].players[ users[socket.id].handle ].valid_play}`);

                    if (card_index > -1 && (is_valid || private_games[room_code].players[ users[socket.id].handle ].valid_play == false)){

                        // Set tigress type
                        if (private_games[room_code].players[ users[socket.id].handle ].hand[card_index].id == 72){
                            private_games[room_code].players[ users[socket.id].handle ].hand[card_index].type = (data.trick.type == 'Pirate' ? 'Pirate' : 'Escape');
                        }

                        updateWinningTrick(room_code, socket.id, card_index);
                        
                        playTrick(room_code, socket.id, card_index);
                        games[room_code].to_play = (games[room_code].to_play + 1) % games[room_code].players.length;

                        updateHandAux(room_code, socket.id);


                        if (games[room_code].to_play == games[room_code].round_lead){
                            updateSubRoundWinnerTrick(room_code);
                            io.to(room_code).emit("winner-trick", {winner_trick : private_games[room_code].rounds[ games[room_code].round ].cards_played[ games[room_code].sub_round ].winner_trick});

                            if (games[room_code].sub_round + 1 < games[room_code].round){
                                games[room_code].sub_round += 1;

                                initSubRound(room_code);

                            }else{
                                updateScore(room_code);

                                games[room_code].round += 1;
                                games[room_code].sub_round = 0;

                                if (games[room_code].round > games[room_code].total_rounds){
                                    games[room_code].state = "scoreboard";
                                    rooms[room_code].state = "scoreboard";
                                    io.to(room_code).emit("refresh-room", {room : rooms[room_code]});
                                }else{
                                    // console.log('dealing cards for new round');
                                    resetRound(room_code);
                                    dealCards(room_code);
                                    games[room_code].state = "betting";
                                    initSubRound(room_code);
                                }
                            }
                        }
                        // console.log("-----------REFRESH GAME-----------");
                        // console.log(games[room_code]);
                        io.to(room_code).emit("refresh-game", {game : games[room_code]});
                        io.to(room_code).emit("refresh-subround", {sub_round : 
                            private_games[room_code].rounds[ games[room_code].round ].cards_played[ games[room_code].sub_round ].cards});
                    }else {
                        console.log("Attempting to play invalid trick. (either does not own the trick, or it's an invalid move)");
                    }
                }
            }
        }
    });

});

function generateRoomCode() {
    let code = '';
    let dictionary = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let found = false;
    while (!found){
        code = '';
        for (let i = 0; i < ROOM_CODE_LEN; i++){
            code += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
        }

        if (!(code in rooms)){
            found = true;
        }
    }
    return code;
}

function bet(room_code, socket_id, bet){
    private_games[room_code].rounds[ games[room_code].round ].bets[ users[socket_id].handle ] = bet;
}

function commitBets(room_code){
    for (p in games[room_code].players){
        let bet = private_games[room_code].rounds[ games[room_code].round ].bets[ games[room_code].players[p].handle ];
        if (bet == null) {
            games[room_code].players[p].bet = 0;
        }else{
            games[room_code].players[p].bet = bet
        }
    }
}

function playTrick(room_code, socket_id, card_index){

    let trick = private_games[room_code].players[ users[socket_id].handle ].hand[card_index];
    let played_trick = { 
                        trick : {
                            id: trick.id, 
                            name: trick.name, 
                            value: trick.value, 
                            type: trick.type, 
                            valid: trick.valid 
                        }, 
                        player_handle : users[socket_id].handle 
                        };

    private_games[room_code].players[ users[socket_id].handle ].hand.splice(card_index, 1);
    private_games[room_code].rounds[ games[room_code].round ].cards_played[ games[room_code].sub_round ].cards.push(played_trick);
}

function updateWinningTrick(room_code, socket_id, card_index){
    // console.log("------------UPDATE WINNING TRICk-------------");
    // console.log(`game[${room_code}]:`);
    // console.log(games[room_code]);
    let trick = private_games[room_code].players[ users[socket_id].handle ].hand[card_index];

    // console.log("trick:");
    // console.log(trick);

    if (games[room_code].winning_trick == null || superiorTrick(room_code, trick)){
        games[room_code].winning_trick = {
            trick : {
                id: trick.id,
                name: trick.name,
                value: trick.value, 
                type: trick.type, 
                valid: trick.valid 
            },
            player_handle : users[socket_id].handle
        };
        // console.log("New winning trick: ");
        // console.log(games[room_code].winning_trick);
    }
}

function updateSubRoundWinnerTrick(room_code){
    // console.log("------------UPDATE SUB ROUND WINNER TRICk-------------");
    // console.log(`game[${room_code}]:`);
    // console.log(games[room_code]);
    let winning_trick = { 
                        trick : {
                            id: games[room_code].winning_trick.trick.id,
                            name: games[room_code].winning_trick.trick.name,
                            value: games[room_code].winning_trick.trick.value, 
                            type: games[room_code].winning_trick.trick.type, 
                            valid: games[room_code].winning_trick.trick.valid 
                        },
                        player_handle : games[room_code].winning_trick.player_handle 
                        };

    // console.log("winning_trick:");
    // console.log(winning_trick);
    // console.log(`games[room_code].sub_round : ${games[room_code].sub_round}`);
    // console.log("subround: ");
    // console.log(private_games[room_code].rounds[ games[room_code].round ].cards_played[ games[room_code].sub_round ]);

    private_games[room_code].rounds[ games[room_code].round ].cards_played[ games[room_code].sub_round ].winner_trick = winning_trick;
    
    if (games[room_code].winning_trick.trick.id != 71){
        // console.log(`${winning_trick.player_handle} takes the trick!`);

        let winner_index = getPlayerIndex(room_code, winning_trick.player_handle);

        games[room_code].players[Number(winner_index)].tricks_won++;
        games[room_code].to_play = Number(winner_index);
        games[room_code].round_lead = Number(winner_index);
    }else{
        // console.log("Kraken = void round");
    }
}

function initGame(room_code) {
    
    let n = Math.floor(Math.random() * rooms[room_code].users.length);
    games[room_code] = {
        room_code : room_code,
        state : "betting",
        to_play : n,
        round_lead : n,
        round : 1,
        sub_round : 0,
        total_rounds : 10,
        round_time : 30,
        bet_time : 10,
        winning_trick : null,
        players : []
    };

    private_games[room_code] = {
        players : {},
        rounds : {},
        SK_captured : false,
    };

    initPlayers(room_code);
    initRound(room_code);
    initSubRound(room_code, 1);
}

function initPlayers(room_code)
{
    let temp_players = [];
    for (u in rooms[room_code].users)
    {
        temp_players.push(rooms[room_code].users[u]);
    }
    temp_players = shuffle(temp_players);

    for (p in temp_players) {

        let player = {
            handle : temp_players[p],
            bet : 0,
            tricks_won : 0,
            score : 0
        };

        let private_player = {
            hand : [],
            valid_play : null,
        };

        games[room_code].players.push(player);

        private_games[room_code].players[ temp_players[p] ] = private_player;
    };
}

function initRound(room_code){
    let round = {
        cards_played : {},
        bets : {}
    };
    
    for (p in games[room_code].players) {
        round.bets[ games[room_code].players[p].handle ] = null;
    };

    private_games[room_code].rounds[ games[room_code].round ] = round;
}

function resetRound(room_code){
    initRound(room_code);
    for (p in games[room_code].players) {
        games[room_code].players[p].bet = 0;
        games[room_code].players[p].tricks_won = 0;

        private_games[room_code].players[ games[room_code].players[p].handle ].hand = [];
        private_games[room_code].players[ games[room_code].players[p].handle ].valid_play = null;
    }
    private_games[room_code].SK_captured = false;
}


function initSubRound(room_code){
    private_games[room_code].rounds[ games[room_code].round ].cards_played[ games[room_code].sub_round ] = {
        cards : [],
        winner_trick : null
    };

    games[room_code].winning_trick = null;
}

function allBet(room_code){
    let round = games[room_code].round;
    let all_bet = true;
    for (b in private_games[room_code].rounds[round].bets){
        if (private_games[room_code].rounds[round].bets[b] == null){
            all_bet = false;
            break;
        }
    }
    return all_bet;
}
function getPlayerIndex(room_code, handle){
    let player_index = -1;
    for (p in games[room_code].players)
    {
        if (games[room_code].players[p].handle == handle){
            player_index = p;
        }
    }
    return player_index;
}

function getCardIndex(room_code, socket_id, trick){
    let card_index = -1;
    for (c in private_games[room_code].players[ users[socket_id].handle ].hand)
    {
        if (private_games[room_code].players[ users[socket_id].handle ].hand[c].id == trick.id){
            card_index = c;
        }
    }
    return card_index;
}


function dealCards(room_code){
    let cards = [];
    // console.log(`Deck length: ${Deck.Deck.length}`)
    for (c in Deck.Deck)
    {
        cards.push(Deck.Deck[c]);
    }
    // console.log(`cards length: ${cards.length}`)

    let round = games[room_code].round;
    while (round > 0){
        for (p in private_games[room_code].players){
            let n = Math.floor(Math.random() * cards.length);
            let card = {id: cards[n].id, name: cards[n].name, value: cards[n].value, type: cards[n].type, valid: true};
            private_games[room_code].players[p].hand.push(card);
            cards.splice(n, 1);
        }
        round--;
    }
}

function updateHand(room_code, socket_id){

    if (games[room_code].state == "betting"){
        // console.log("------------UPDATE HAND [BETTING]-------------");
        hands[socket_id] = [];
        for (t in private_games[room_code].players[ users[socket_id].handle ].hand)
        {
            hands[socket_id].push(private_games[room_code].players[users[socket_id].handle].hand[t]);
        }
    }else if (games[room_code].state == "playing"){
        // console.log("------------UPDATE HAND [PLAYING]-------------");
        let player_index = getPlayerIndex(room_code, users[socket_id].handle);
        if (player_index == games[room_code].to_play){
            // console.log(`Updating ${users[socket_id].handle}'s hand`);
            updateHandAux(room_code, socket_id);
        }
    }else {
        // console.log("unknown state whilst updating hand");
    }
}

function updateHandAux(room_code, socket_id){
    hands[socket_id] = [];
    private_games[room_code].players[users[socket_id].handle].valid_play = false;

    for (t in private_games[room_code].players[users[socket_id].handle].hand){
        let temp_trick = {id: private_games[room_code].players[users[socket_id].handle].hand[t].id,
            name: private_games[room_code].players[users[socket_id].handle].hand[t].name,
            value: private_games[room_code].players[users[socket_id].handle].hand[t].value, 
            type: private_games[room_code].players[users[socket_id].handle].hand[t].type, 
            valid: private_games[room_code].players[users[socket_id].handle].hand[t].valid }
        if (validTrick(room_code, temp_trick) == true)
        {
            // console.log("VALID");
            temp_trick.valid = true;
            if (['Purple Suit', 'Green Suit', 'Yellow Suit'].includes(temp_trick.type) ||
                ( games[room_code].winning_trick != null &&
                    (games[room_code].winning_trick.trick.type == 'Jolly Ranger' && temp_trick.type == 'Jolly Ranger'))){
                private_games[room_code].players[users[socket_id].handle].valid_play = true;
            }
        }else{
            // console.log("INVALID");
            temp_trick.valid = false;
        }
        hands[socket_id].push(temp_trick);
    }

    // No valid play : can play any card
    if (private_games[room_code].players[users[socket_id].handle].valid_play == false){
        for (t in hands[socket_id]){
            hands[socket_id][t].valid = true;
        }
    }
}


function superiorTrick(room_code, trick){
    if (games[room_code].winning_trick == null) return true;
    if (trick.type == 'Kraken') return true;

    switch (games[room_code].winning_trick.trick.type){
        case 'Yellow Suit':
            if (['Skull King', 'Mermaid', 'Pirate', 'Jolly Ranger'].includes(trick.type) ||
                (trick.type == 'Yellow Suit' && trick.value > games[room_code].winning_trick.trick.value)) return true;
            break;
        case 'Purple Suit':
            if (['Skull King', 'Mermaid', 'Pirate', 'Jolly Ranger'].includes(trick.type) ||
                (trick.type == 'Purple Suit' && trick.value > games[room_code].winning_trick.trick.value)) return true;
            break;
        case 'Green Suit':
            if (['Skull King', 'Mermaid', 'Pirate', 'Jolly Ranger'].includes(trick.type) ||
                (trick.type == 'Green Suit' && trick.value > games[room_code].winning_trick.trick.value)) return true;
            break;
        case 'Jolly Ranger':
            if (['Skull King', 'Mermaid', 'Pirate'].includes(trick.type) ||
                (trick.type == 'Jolly Ranger' && 
                 trick.value > games[room_code].winning_trick.trick.value)) return true;
            break;
        case 'Escape':
        case 'Loot':
            if (['Escape', 'Loot'].includes(trick.type)) return false;
            else return true;
        case 'Kraken':
            return false;
        case 'Pirate':
            if (trick.type == 'Skull King') return true;
            break;
        case 'Mermaid':
            if (private_games[room_code].SK_captured == false && trick.type == 'Pirate') return true;
            break;
        case 'Skull King':
            if (trick.type == 'Mermaid') {
                private_games[room_code].SK_captured = true;
                return true;
            }
            break;
        default:
            // console.log(`${games[room_code].winning_trick.trick.type} : undefined type`);
            break;
    }

    return false;
}

function validTrick(room_code, trick){
    // console.log("-------------VALID TRICK-------------");
    if (games[room_code].winning_trick == null) return true;
    switch (games[room_code].winning_trick.trick.type){
        case 'Yellow Suit':
            if (['Purple Suit', 'Green Suit'].includes(trick.type)) return false;
            break;
        case 'Purple Suit':
            if (['Yellow Suit', 'Green Suit'].includes(trick.type)) return false;
            break;
        case 'Green Suit':
            if (['Yellow Suit', 'Purple Suit'].includes(trick.type)) return false;
            break;
        case 'Jolly Ranger':
            if (['Purple Suit', 'Yellow Suit', 'Green Suit'].includes(trick.type)){
                // console.log("Trick:");
                // console.log(trick);
                let sub_round = private_games[room_code].rounds[ games[room_code].round ].cards_played[ games[room_code].sub_round ];
                // console.log(`sub_round: ${games[room_code].sub_round}`);
                // console.log(sub_round);
                // check if round is being played with Jolly Ranger
                for (card_idx in sub_round.cards){
                    let prev_trick = sub_round.cards[card_idx].trick;
                    // console.log("previous trick:");
                    // console.log(prev_trick);
                    if (prev_trick.type == 'Jolly Ranger') {
                        // console.log("INVALID TRICK");
                        return false;
                    }
                    
                    if (['Purple Suit', 'Yellow Suit', 'Green Suit'].includes(prev_trick.type)) {
                        // console.log("VALID TRICK");
                        return true;
                    }
                    // else the only other 2 valid cards must have been wildcards => continue searching
                }
            }
            break;
        case 'Escape':
        case 'Loot':
        case 'Kraken':
        case 'Skull King':
        case 'Pirate':
        case 'Mermaid':
            return true;
            break;
        default:
            // console.log(`${games[room_code].winning_trick.trick.type} : undefined type`);
            return false;
            break;
    }

    return true;
}

// Updates score for current round
function updateScore(room_code)
{
    for (p in games[room_code].players){

        let player = games[room_code].players[p];

        if (player.bet == player.tricks_won)
        {
            if (player.bet == 0) games[room_code].players[p].score += games[room_code].round * 10;
            else games[room_code].players[p].score += player.bet * 20;

            bonusPoints(room_code, p);

        }else{
            if (player.bet == 0) games[room_code].players[p].score -= games[room_code].round * 10;
            else games[room_code].players[p].score -= Math.abs(player.bet - player.tricks_won) * 10;
        }
    }
}

function bonusPoints(room_code, player_index)
{
    let player = games[room_code].players[player_index];

    // private_games[room_code].rounds[ games[room_code].round ].cards_played[sub_round].winner_trick
    // private_games[room_code].rounds[ games[room_code].round ].cards_played[sub_round].cards

    for (sub_round_idx in private_games[room_code].rounds[ games[room_code].round ].cards_played){
        // console.log(`sub_round_idx: ${sub_round_idx}`);
        let sub_round = private_games[room_code].rounds[ games[room_code].round ].cards_played[ sub_round_idx ];
        // console.log(sub_round);
        // if player won this subround
        if (sub_round.winner_trick.player_handle == player.handle){
            for (card_idx in sub_round.cards){
                let trick = sub_round.cards[card_idx].trick;
                
                // skip winner trick
                if (trick.id != sub_round.winner_trick.trick.id){
                    switch (trick.type){
                        case 'Pirate':
                            if (sub_round.winner_trick.trick.type == 'Skull King'){
                                games[room_code].players[player_index].score += 30;
                            }
                            break;
                        case 'Jolly Ranger':
                            if (trick.value == 14){
                                games[room_code].players[player_index].score += 20;
                            }
                            break;
                        case 'Green Suit':
                        case 'Yellow Suit':
                        case 'Purple Suit':
                            if (trick.value == 14){
                                games[room_code].players[player_index].score += 10;
                            }
                            break;
                        case 'Skull King':
                            if (sub_round.winner_trick.trick.type == 'Mermaid'){
                                games[room_code].players[player_index].score += 50;
                            }
                            break;
                        // Loot card -> Alliances
                        default:
                            break;
                    }
                }else{
                    // Bonus only applies if the trick was captured.
                    break;
                }
            }
        }
    }
}

function shuffle(array) {
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