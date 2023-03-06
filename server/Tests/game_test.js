const GAME = require("./Modules/game");
const STATES = require("../Models/State");

var Game = GAME.Game;
const States = STATES.States;

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function handleStartGame(test) {
    return test.function(test.inputs.lobby_code, test.inputs.lobbies, test.inputs.clients)
}


const tests = {
    0: {
        name: "Start Game",
        function: Game.startGame,
        handler: handleStartGame,
        inputs: {
            lobby_code: "FOO",
            lobbies: {
                "FOO" : {
                    code: "FOO",
                    clients: [1, 2],
                    state: States.waiting,
                    admin: 1
                }
            },
            clients: {
                "1" : {
                    lobby_code: "FOO",
                    handle: "Alice"
                },
                "2" : {
                    lobby_code: "FOO",
                    handle: "Bob"
                }
            }
        },
        expected: {
            game: {
                settings: {
                    game_mode: string,
                    scoring_mode: string,
                    card_count_mode: string,
                    deck_mode: string,
                    total_rounds: integer,
                    trick_time: integer,
                    bet_time: integer,
                },
                details: {
                    code: string,
                    state: string,
                    round: integer,
                    trick: integer,
                    winning: null,
                    leading: boolean,
                    weather: null,
                    event: null,
                },
                players: [
                    {
                        handle: string,
                        bet: integer,
                        tricks_won: integer,
                        score: integer,
                    },
                    {
                        handle: string,
                        bet: integer,
                        tricks_won: integer,
                        score: integer,
                    },
                ],
                rounds: [
                    {
                        lead: player_handle,
                        tricks: [
                            {
                                lead: player_handle,
                                to_play: player_handle,
                                cards: [],
                                winner: null,
                                points: integer,
                            }
                        ],
                    }
                ],
            }
        }
    }
}

function validateResponse(actual, expected) {
    assert(JSON.stringify(actual) === JSON.stringify(expected), "actual != expected")
}

function runTestCases() {
    for (tc in tests) {
        response = tests[tc].handler( tests[tc] );

        // If an error was expected.
        if ("error" in tests[tc].expected) {
            if ("error" in response) {
                assert(response.error == tests[tc].error, "Errors do not match.")
            } else {
                throw "Expected error not in response."
            }
        }

        validateResponse(response, tests[tc].expected);
        console.log("PASS: ", tests[tc].name)
    }
}

function testGame() {
    runTestCases();
}

testGame();