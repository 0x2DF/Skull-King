const CLIENT = require("./Modules/client");
const GAME = require("./Modules/game");
const LOBBY = require("./Modules/lobby");
const TRIGGERS = require("./Models/Triggers");

// #######
// Local
// #######

const express = require('express');
const app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  console.log(`https://skull-king-app.herokuapp.com:${PORT}`);
});

var Client = CLIENT.Client;
var Game = GAME.Game;
var Lobby = LOBBY.Lobby;
const Triggers = TRIGGERS.Triggers;

// Formats a string replacing {} with the arguments (Python-like)
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

io.on("connection", socket => {

    // [->]: disconnect
    // [<-]: _
    socket.on(Triggers.disconnect, () =>{
        if (socket.id in Client.clients) {
            let response = Game.disconnect(socket, Client.clients);
            if ("game" in response) {
                io.to(response.game.details.code).emit(Triggers.refreshGame, response);
            }
            response = Lobby.disconnect(socket,  Client.clients);
            if ("lobby" in response) {
                io.to(response.lobby.code).emit(Triggers.refreshLobby, response);
            }
            //Message.disconnect(socket.id, User);
            delete Client.clients[socket.id]
        }
    });

    // [->]: chat-message {message}
    // [<=]: message-broadcast {message}
    socket.on(Triggers.chatMessage, data => {
        if (("message" in data) == false) {
            return;
        }

        if (socket.id in Client.clients) {
            let lobby = Client.clients[socket.id].lobby;
            let handle = Client.clients[socket.id].handle;
            if (lobby != null && handle != null) {
                console.log(`${handle} : ${data.message}`);
                socket.to(lobby).emit(Triggers.messageBroadcast, {message : data.message, handle : handle});
            }
        }
    });

    // [->]: find-lobby {code}
    // [<-]: find-lobby {lobby} || {error}
    socket.on(Triggers.findLobby, data => {
        if (("code" in data) == false) {
            return;
        }

        const response = Lobby.findLobby(data.code, Client.clients);
        socket.emit(Triggers.findLobby, response);
    });

    // [->]: create-lobby _
    // [<-]: create-lobby {lobby} || {error}
    socket.on(Triggers.createLobby, _ => {
        const response = Lobby.createLobby(socket, Client.clients);
        socket.emit(Triggers.createLobby, response);
    });

    // [->]: join-lobby {code} && {handle}
    // [<-]: join-lobby {error}
    // OR
    // [<=]: refresh-lobby {lobby}
    socket.on(Triggers.joinLobby, data => {
        if (("code" in data) == false || ("handle" in data) == false) {
            return;
        }
        const response = Lobby.joinLobby(socket, data.code, data.handle, Client.clients);
        if ("error" in response) {
            socket.emit(Triggers.refreshLobby, response);
        } else if ("lobby" in response) {
            socket.join(response.lobby.code);
            io.to(response.lobby.code).emit(Triggers.refreshLobby, response);
        }
    });
    
    // [->]: start-lobby _
    // [<-]: start-lobby {error}
    // OR
    // [<=]: refresh-lobby {lobby}
    // [<=]: refresh-game {game}
    socket.on(Triggers.startLobby, data => {

        let response = Lobby.startLobby(socket, Client.clients);
        if ("error" in response) {
            socket.emit(Triggers.startLobby, response);
            return;
        }
        
        let lobby = {}
        if ("lobby" in response) {
            lobby = response.lobby;
            response = Game.startGame(lobby.code, Lobby.lobbies, Client.clients);
        }

        if ("error" in response) {
            socket.emit(Triggers.startLobby, response);
            return;
        }
    
        if ("game" in response) {
            io.to(response.game.details.code).emit(Triggers.refreshLobby, { lobby : lobby });
            io.to(response.game.details.code).emit(Triggers.refreshGame, response);
        }

    });

    // [->]: refresh-hand _
    // [<-]: refresh-hand {hand}
    socket.on(Triggers.refreshHand, _ => {
        const response = Game.refreshHand(socket, Client.clients);
        if ("error" in response) {
            socket.emit(Triggers.refreshHand, response);
            return;
        }

        if ("hand" in response) {
            socket.emit(Triggers.refreshHand, response);
        }
    });

    // [->]: place-bet {bet}
    // [<-]: place-bet {error}
    // OR
    // [<-]: _
    // OR
    // [<=]: refresh-game {game}
    socket.on(Triggers.placeBet, data => {
        if (("bet" in data) == false) {
            return;
        }

        const response = Game.placeBet(socket, data.bet, Client.clients);
        if ("error" in response) {
            socket.emit(Triggers.placeBet, response);
            return;
        }
        
        if ("game" in response) {
            io.to(response.game.details.code).emit(Triggers.refreshGame, response);
            // console.log("game: ", response.game)
        }
    });

    // [->]: play-card {card}
    // [<-]: play-card {error}
    // OR
    // [<=]: refresh-game {game}
    // [<=]: refresh-game {message}
    // [<-]: refresh-hand {hand}
    socket.on(Triggers.playCard, data => {
        if (("card" in data) == false) {
            return;
        }

        const response = Game.playCard(socket, data.card, Client.clients);
        if ("error" in response) {
            socket.emit(Triggers.refreshGame, response);
            return;
        }

        if ("game" in response && "message" in response) {
            if ("name" in response.message) {
                io.to(response.game.details.code).emit(Triggers.refreshGame, {game : response.game, error : response.message});
            }
            else {
                io.to(response.game.details.code).emit(Triggers.refreshGame, {game : response.game});
            }
        }

        if ("hand" in response) {
            socket.emit(Triggers.refreshHand, {hand : response.hand});
        }
    });

});