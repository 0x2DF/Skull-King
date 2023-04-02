import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { LobbyService } from '../../../services/lobby.service';
import { GameService } from '../../../services/game.service';

import { Error } from '../../../models/error'
import { Game } from '../../../models/game';
import { Lobby } from '../../../models/lobby';
import { User } from '../../../models/user';

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
    this.subscribeError();
    this.subscribeLobby();
    this.findLobby();

    this.subscribeGame();

    this.gameService.listenRefreshGame();
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
    this.gameSubscription.unsubscribe();
    this.lobbySubscription.unsubscribe();
  }

  game: Game = Game();
  lobby: Lobby = Lobby();

  user: User = {handle:""};
  error: Error = Error();

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
  }

  findLobby(): void {
    let href = this.router.url.replace('/game/','');
    let lobby: Lobby = Lobby();
    lobby.code = href;
    this.lobbyService.findLobby(lobby);
  }

  subscribeError(): void {
    if (!this.subscriptions["error"]) {
      this.errorSubscription = this.lobbyService.sharedError.subscribe(error => {
          this.error = <Error>error;
          if (this.error.name == "LobbyNotFound") {
            const url = "";
            this.router.navigate([`${url}`]);
          }
      });
      this.subscriptions["error"] = true;
    }
  }

  subscribeLobby(): void {
    if (!this.subscriptions["lobby"]) {
      this.lobbySubscription = this.lobbyService.sharedLobby.subscribe(lobby => {
        this.lobby = <Lobby>lobby;
      });
      this.subscriptions["lobby"] = true;
    }
  }

  subscribeGame(): void {
    if (!this.subscriptions["game"]) {
      this.gameSubscription = this.gameService.sharedGame.subscribe(game => {
        this.game = <Game>game;
      });
      this.subscriptions["game"] = true;
    }
  }
}
