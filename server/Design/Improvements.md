# Tasks
## Server:
+ Scoring
    - Bonus points
+ Card effect handling
    - Pirates
+ White whale
+ Errors/Messages
+ Game settings
    - Game Modes
    - Lobby timeout
    - Betting timeout
+ Disconnect
    - Announce lobby
+ Lobby timeout (Time to live)
+ Join mid game
    - if lobby has a spot, new user can take spot (new score, skips current round)

## Client:
+ User experience
    - Errors/Messages handling w/toasts
    - Display list of played tricks in round details
+ Betting
    - Player List (order and who has bet)
    - Betting timeout
+ Card Effect Handling
+ Remove console logs
+ Errors:
    + Incorrect lobby redirect 
        1) Enter wrong lobby code 
        2) 'enter lobby'
        3) Enter valid lobby code
        4) 'enter lobby'
        5) 404 redirect

# Brainstorming
## Card Concepts:
+ Storm
+ Monkey

## Card Effects:
+ Bets are kept secret during the entirety of the round and only revealed upon round culmination.

## Game Modes:
+ Winner/Lead handicap = Current winner must bet blind