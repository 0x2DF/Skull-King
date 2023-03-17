const STATES = require("../Models/State");

const States = STATES.States;

var LOBBY = (function() {
    'use strict';

    const _LOBBY_CODE_LEN = 5;
    const _LOBBY_MAX_USERS = 6;

    var _ERR_MSG_LOBBY_NOT_FOUND = `Lobby {} not found.`;
    var _ERR_MSG_LOBBY_FULL = `Lobby {} is full.`;
    var _ERR_MSG_LOBBY_IN_PROGRESS = `Lobby {} is already in progress.`;
    var _ERR_MSG_LOBBY_HANDLE_TAKEN = `{} is already part of {}.`;
    var _ERR_MSG_USER_LOBBY_QTY_EXCEEDED = `{} has exceeded the maximum amount of lobbies`;

    let lobbies = {};

    // ================================================ //
    // Public functionality exposed by the server's API //
    // ================================================ //

    // Responds with a lobby if such exists.
    function findLobby(lobby_code, clients) {
        if (lobby_code in lobbies) {
            return { lobby: _censorLobby(lobbies[lobby_code], clients) };
        } else {
            let msg = _ERR_MSG_LOBBY_NOT_FOUND.format(lobby_code);
            console.log(msg);
            return { error: { name: "LobbyNotFound" } };
        }
    }

    // Initializes a new lobby and registers a new client.
    function createLobby(socket, clients) {
        const id = socket.id;
        if (id in clients) {
            console.log(_ERR_MSG_USER_LOBBY_QTY_EXCEEDED.format(id));
            return {error: { name: "ClientLobbyQtyExceeded" }};
        }

        const lobby_code = _generateLobbyCode();

        lobbies[lobby_code] = { code: lobby_code, clients: [], state: States.waiting, admin: null };

        clients[id] = { lobby_code: lobby_code, handle: null };

        console.log(`Lobbies TOTAL : ${Object.keys(lobbies).length}`);
        return { lobby :  _censorLobby(lobbies[lobby_code], clients) };
    }

    // Attempts to add a user to a lobby.
    function joinLobby(socket, lobby_code, client_handle, clients) {
        const id = socket.id;

        // Check if lobby exists.
        if (!(lobby_code in lobbies)){
            let msg = _ERR_MSG_LOBBY_NOT_FOUND.format(lobby_code)
            console.log(msg);
            return { error: { name: "LobbyNotFound" } };
        }

        // Check if lobby has open spots.
        if (lobbies[lobby_code].clients.length >= _LOBBY_MAX_USERS){
            let msg = _ERR_MSG_LOBBY_FULL.format(lobby_code)
            console.log(msg);
            return { error: { name: "LobbyFull" } };
        }

        // Check if handle is taken
        if (_censorLobby(lobbies[lobby_code], clients).clients.includes(client_handle)){
            console.log(_ERR_MSG_LOBBY_HANDLE_TAKEN.format(client_handle, lobby_code));
            return { error: { name: "LobbyHandleTaken" } };
        }

        // Check whether the lobby has already begun.
        if (lobbies[lobby_code].state == States.inProgress){
            let msg = _ERR_MSG_LOBBY_IN_PROGRESS.format(lobby_code);
            console.log(msg);
            return { error: { name: "LobbyInProgress" } };
        }

        // Modify users
        if (id in clients) {
            if (clients[id].handle != null) {
                return { error: { name: "DuplicateJoinLobby" } };
            }
            clients[id].handle = client_handle;
        } else {
            clients[id] = { handle: client_handle, lobby_code: lobby_code };
        }

        // Add user to lobby
        lobbies[lobby_code].clients.push(id);
        // console.log('{} joined {}'.format(id, lobby_code));

        // Set lobby admin
        if (lobbies[lobby_code].admin == null){
            lobbies[lobby_code].admin = id;
        }

        // console.log(lobbies[lobby_code]);
        return { lobby : _censorLobby(lobbies[lobby_code], clients) };
    }

    // Attempts to move the lobby's state to 'in-progress'.
    function startLobby(socket, clients) {
        const id = socket.id;

        // Client must exist
        if (!(id in clients)) {
            console.log(`Client does not exist`);
            return { error: { name: "ClientDoesNotExist" } };
        }
        let client = clients[id];
        const lobby_code = client.lobby_code;

        // Lobby must exist
        if (!(lobby_code in lobbies)) {
            console.log(`Lobby ${lobby_code} does not exist`);
            return { error: { name: "LobbyNotFound" } };
        }
        let lobby = lobbies[lobby_code];

        // Lobby code and Client Lobby code must match
        if (lobby.code != client.lobby_code) {
            console.log(`${lobby_code} != ${client.lobby_code}`);
            return { error: { name: "LobbyMismatch" } };
        }

        // Client must be lobby admin
        if (lobby.admin != id) {
            console.log(`${id} is not ${lobby_code}'s admin`);
            return { error: { name: "ClientNotAdmin" } };
        }

        // Lobby state must be waiting
        if (lobby.state != States.waiting) {
            console.log(`${lobby.state} != ${States.waiting}`);
            return { error: { name: "IncorrectLobbyState" } };
        }

        // Lobby must have at least 2 clients
        if (lobby.clients.length < 2) {
            console.log(`${lobby.clients.length} < 2`);
            return { error: { name: "TooFewClientsToStart" } };
        }

        lobbies[lobby_code].state = States.inProgress;
        return { 
            lobby : _censorLobby(lobbies[lobby_code], clients),
        };
    }

    // Removes a client from its associated lobby.
    function disconnect(socket, clients) {
        return _removeClientFromLobby(socket, clients);
    }


    // ===================== //
    // Private functionality //
    // ===================== //

    // Generates a unique lobby code.
    function _generateLobbyCode() {
        let code = '';
        let dictionary = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
        let found = false;
        while (!found){
            code = '';
            for (let i = 0; i < _LOBBY_CODE_LEN; i++){
                code += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
            }
    
            if (!(code in lobbies)){
                found = true;
            }
        }
        return code;
    }

    // Removes a client from its associated lobby.
    // Removes the lobby if no clients remain.
    function _removeClientFromLobby(socket, clients) {
        let client = clients[socket.id];
        if (client.lobby_code in lobbies) {
            const index = lobbies[client.lobby_code].clients.indexOf(socket.id);
            if (index > -1){
                lobbies[client.lobby_code].clients.splice(index, 1);
                socket.leave(client.lobby_code);
            }

            if (lobbies[client.lobby_code].clients.length > 0) {
                if (lobbies[client.lobby_code].admin == socket.id) {
                    lobbies[client.lobby_code].admin = lobbies[client.lobby_code].clients[0];
                }
                return { lobby : _censorLobby(lobbies[client.lobby_code], clients) };
            } else {
                delete lobbies[client.lobby_code];
            }
        }
        return {};
    }

    // Redacts sensitive information from the lobby.
    function _censorLobby(lobby, clients) {
        let censored_lobby = { 
            code: lobby.code,
            clients: [],
            state: lobby.state,
            admin: null
        };

        // Substitute admin id with handle
        if (lobby.admin in clients) {
            censored_lobby.admin = clients[lobby.admin].handle;
        }

        // Substitute client's id with handle
        for (let id in lobby.clients) {
            const socket_id = lobby.clients[id];
            if (socket_id in clients) {
                censored_lobby.clients.push(clients[socket_id].handle);
            } else {
                censored_lobby.clients.push(null);
            }
        }
        return censored_lobby;
    }

    return {
        findLobby: findLobby,
        createLobby: createLobby,
        joinLobby: joinLobby,
        startLobby: startLobby,
        disconnect: disconnect,
        lobbies: lobbies,
    };

})();

module.exports = {
    Lobby: LOBBY,
}