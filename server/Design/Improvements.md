# Tasks
## README
+ Fill template

## TESTING
+ MISSING

## ERRORS
+ blank -> numbered -> leading rule no longer applying
+ pirate -> skull king -> white whale -> wins white whale
+ Client errors
+ Refactor handle pirate cards
+ Verify points
+ Kraken shows player who played the card as winning, message is "null wins the trick"
+ What happens if requests are spammed ?
+ Incorrect lobby redirect 
        1) Enter wrong lobby code 
        2) 'enter lobby'
        3) Enter valid lobby code
        4) 'enter lobby'
        5) 404 redirect
+ If leading player disconnects, no one can play

## Server:
+ Scoring
    - Bonus points
+ Trick resolution handling
    - Pirates
+ Errors/Messages
+ Game settings
    - Game Modes
    - Timeout
+ Timeouts
    - Lobby time to live
    - Betting
    - Playing
    - Trick Resolution
+ Server toggling (local/heroku)

### Nice to have:
+ Disconnect
    - Announce lobby someone left
+ Join mid game
    - if lobby has a spot, new user can take spot (new score, skips current round)

## Client:
+ User experience
    - Errors/Messages handling w/toasts
    - Display list of played tricks in round details as a collapse with details of who played which trick and which trick won the round or is currently winning.
+ Remove console logs
+ Scoreboard

### Nice to have:
+ Betting
    - Player List (order and who has bet)
+ Remove # from URI

# Brainstorming
## Card Concepts:
+ Storm
+ Monkey

## Card Effects:
+ Bets are kept secret during the entirety of the round and only revealed upon round culmination.

## Game Modes:
+ Winner/Lead handicap = Current winner must bet blind
+ Bren: Uno-like being able to play same number from different color