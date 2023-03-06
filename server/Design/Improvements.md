# Tasks
## Server:
+ Card Validation
    - Wildcards & special cards
    - Leading card rule not working properly
+ Scoring
    - NaN score values
+ Card effect handling
+ Game settings
    - Game Modes
    - Lobby timeout
    - Betting timeout
+ Disconnect
+ Lobby timeout (Time to live)
+ Annouce lobby when user disconnects
+ Join mid game
    - if lobby has a spot, new user can take spot (new score, skips current round)

## Client:
+ Players list status
+ Hand UI
+ Error handling & toasts
+ Betting
    - Player List (order and who has bet)
    - Betting timeout
+ User experience
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