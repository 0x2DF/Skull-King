Todo:
- Disconnect destroy
- Room timeout (TTL)
- Sanitize input
- UX (Too much scrolling/mobile score table in game)
- Bet/Play Timers
- Bets waiting for
- Game Details (settings)
- Scoreboard (sorted)
- Pirate Skills
- Docs

#####################
Local Execution cmds:

Client (local):
ng serve

Server (local):
node app.js

#####################
- Deploy to Heroku -

1. from client: ng build --prod

2. Copy 'client/dist/client' folder into 'server/public/'

3. Toggle comments for connetion in following files:
- 'server/app.js'
- 'client/src/app/socket.service.ts'

4. Execute the following commands from server directory:
git add .
git commit -m "commit msg"
git push heroku master
heroku logs --tail