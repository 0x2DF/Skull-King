import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { LobbyService } from '../../../services/lobby.service';
import { GameService } from '../../../services/game.service';

import { Card } from '../../../models/card';
import { Details } from '../../../models/details';
import { Error } from '../../../models/error'
import { Game } from '../../../models/game';
import { Lobby } from '../../../models/lobby';
import { Player } from '../../../models/player';
import { PlayerCard } from '../../../models/playercard';
import { Round } from '../../../models/round';
import { Settings } from '../../../models/settings';
import { User } from '../../../models/user';
import { ConstantPool } from '@angular/compiler';

@Component({
  selector: 'game-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  constructor(private router: Router,
    private lobbyService: LobbyService,
    private gameService: GameService,
    ) {
  }

  ngOnInit(): void {
    console.log("GameComponent onInit()");
    this.subscribeError();
    this.subscribeLobby();
    this.findLobby();

    this.subscribeGame();

    this.gameService.listenRefreshGame();
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    console.log("GameComponent errorSubscription.unsubscribe");
    this.gameSubscription.unsubscribe();
    console.log("GameComponent gameSubscription.unsubscribe");
    this.lobbySubscription.unsubscribe();
    console.log("GameComponent lobbySubscription.unsubscribe");
  }

  game: Game = Game();
  lobby: Lobby = Lobby();

  user: User = {handle:""};
  error: Error = {name: ""};

  errorSubscription!: Subscription;
  gameSubscription!: Subscription;
  lobbySubscription!: Subscription;
  subscriptions = {
    "error": false,
    "game": false,
    "lobby": false,
    "user": false,
  }

  setUser(user: User) {
    this.user = user;
    console.log("User handle set to: " + this.user.handle);
  }

  findLobby(): void {
    let href = this.router.url.replace('/game/','');
    console.log(href);
    let lobby: Lobby = Lobby();
    lobby.code = href;
    this.lobbyService.findLobby(lobby);
  }

  subscribeError(): void {
    console.log("GameComponent subscribeError()");
    if (!this.subscriptions["error"]) {
      this.errorSubscription = this.lobbyService.sharedError.subscribe(error => {
          console.log("GameComponent lobbyService.sharedError.subscribe");
          this.error = <Error>error;
          if (this.error.name == "LobbyNotFound") {
            const url = "404";
            this.router.navigate([`${url}`]);
          }
      });
      this.subscriptions["error"] = true;
    }
  }

  subscribeLobby(): void {
    console.log("GameComponent subscribeLobby()");
    if (!this.subscriptions["lobby"]) {
      this.lobbySubscription = this.lobbyService.sharedLobby.subscribe(lobby => {
        console.log("GameComponent lobbyService.sharedLobby.subscribe");
        this.lobby = <Lobby>lobby;
      });
      this.subscriptions["lobby"] = true;
    }
  }

  subscribeGame(): void {
    console.log("GameComponent subscribeGame()");
    if (!this.subscriptions["game"]) {
      this.gameSubscription = this.gameService.sharedGame.subscribe(game => {
        console.log("GameComponent gameService.sharedGame.subscribe");

        this.game = <Game>game;

        let round = this.game.details.round;
        let trick = this.game.details.trick;

        if (this.game.details.state == 'playing' && 
            this.game.rounds[round].tricks[trick].to_play == this.user.handle){
          this.displayTurnMessage();
        }
      });
      this.subscriptions["game"] = true;
    }
  }

  displayTurnMessage(){
/*     this.toastr.warning("Hey, it's your turn to play! Watch for time left", "New Turn", {
      timeOut : 4000,
      progressBar: true,
      tapToDismiss: true
    }); */
  }

  showTrickWinner(){
/*     if (this.winner_trick.trick.id == 71){
      this.toastr.info(`${this.winner_trick.player_handle} played a Kraken. No winner.`, "End of Round", {
        timeOut : 5000,
        progressBar: true,
        tapToDismiss: true
      });
    }else {
      this.toastr.success(`${this.winner_trick.player_handle} wins the round with ${this.winner_trick.trick.name}`, "Round Winner", {
        timeOut : 5000,
        progressBar: true,
        tapToDismiss: true
      }); 
    }*/
    
  }

}
