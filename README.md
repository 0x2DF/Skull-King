Version 2.0 (remaster + custom cards)

#####################
Local Execution cmds:

Client (local):
ng serve

Server (local):
node app.js

#####################
- Deploy to Heroku -

1. from client: ng build -c production

2. Copy 'client/dist/client' folder into 'server/public/'

3. Toggle comments for connetion in following files:
- 'server/app.js'

4. Execute the following commands from server directory:
git add .
git commit -m "commit msg"
git push heroku master
heroku logs --tail

#####################
Update npm dependencies:

npm i -g npm-check-updates
ncu -u
npm install