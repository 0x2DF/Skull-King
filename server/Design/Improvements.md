# Tasks
## Server:
+ when applicable: let/var -> const
+ disconnect
+ handle effects (Another game state to handle post effects?)
    - perhaps callback effect on card definition?
+ Error handling
+ Annouce lobby when user disconnects
+ Lobby timeout (Time to live)
+ Game settings
    - Game Modes
    - Lobby timeout
    - Betting timeout
+ Address TODO's
+ Join mid game
    - if lobby has a spot, new user can take spot (new score, skips current round)

## Client:
+ User experience
+ Error toasts
+ Betting
    - Player List (order and who has bet)
    - Betting timeout

# Brainstorming
## Card Concepts:
+ Storm
+ Monkey

## Card Effects:
+ Bets are kept secret during the entirety of the round and only revealed upon round culmination.

## Game Modes:
+ Winner/Lead handicap = Current winner must bet blind