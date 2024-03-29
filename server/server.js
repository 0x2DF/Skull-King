const CLIENT = require("./Modules/client");
const GAME = require("./Modules/game");
const LOBBY = require("./Modules/lobby");
const TRIGGERS = require("./Models/Triggers");

// #######
// Local
// #######

// const express = require('express');
// const app = express();
// let http = require('http').createServer(app);
// let io = require('socket.io')(http, {
//     cors: {
//       origin: "http://localhost:4200",
//       methods: ["GET", "POST"]
//     }
//   });

// const PORT = 3000;
// http.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
//   console.log(`https://skull-king-app.herokuapp.com:${PORT}`);
// });

// #######
// Heroku
// #######

const PORT = process.env.PORT || 3000;
const INDEX = 'client/dist/skull-king/index.html';
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const server = express()
  .use(express.static(__dirname + '/../client/dist/skull-king'))
  .get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+"/../"+INDEX));})
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(server);

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
            // Check if there is a message to relay.
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

    // [->]: resolve-trick {data}
    // [<=]: refresh-game {game}
    // [<-]: refresh-hand {hand}
    socket.on(Triggers.resolveTrick, data => {
        // Handle trick resolution data.
        const response = Game.handleTrickResolution(socket, Client.clients, data);
        if ("error" in response) {
            socket.emit(Triggers.resolveTrick, response);
            return;
        }

        if ("game" in response) {
            io.to(response.game.details.code).emit(Triggers.refreshGame, {game : response.game});
        }
        if ("hand" in response) {
            socket.emit(Triggers.refreshHand, {hand : response.hand});
        }
    });

    // [->]: get-resolve-trick {_}
    // [<-]: get-resolve-trick {hand, card, data}
    // OR
    // [<=]: refresh-game {game}
    socket.on(Triggers.getResolveTrick, _ => {
        const response = Game.getTrickResolutionData(socket, Client.clients);
        if ("error" in response) {
            socket.emit(Triggers.resolveTrick, response);
            return;
        }
        // Trick was already resolved, update game.
        if ("game" in response) {
            io.to(response.game.details.code).emit(Triggers.refreshGame, {game : response.game});
        } else {
            // Respond with trick resolution data.
            socket.emit(Triggers.getResolveTrick, response);
        }
        return;
    });
});


// // Set timer for 5 seconds
// const timerId = setTimeout(function() {
//     console.log('Timer is up!');
//   }, 5000); // time is in milliseconds
  
//   // Cancel timer
//   clearTimeout(timerId);