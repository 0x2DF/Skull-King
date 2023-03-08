import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../../../../services/game.service';
import { Game } from '../../../../../models/game';
import { User } from '../../../../../models/user';

@Component({
  selector: 'game-playing-players',
  templateUrl: './players.component.html',
})
export class PlayingPlayersComponent implements OnInit {
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    console.log("PlayingPlayersComponent onInit()");
    this.subscribeGame();
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
    console.log("PlayingPlayersComponent ngOnDestroy() handSubscription.unsubscribe()");
  }

  game: Game = Game();
  user: User = User();

  gameSubscription!: Subscription;
  subscriptions = {
    "game": false,
  }

  subscribeGame(): void {
    console.log("PlayingPlayersComponent subscribeGame()");
    if (!this.subscriptions["game"]) {
      this.gameSubscription = this.gameService.sharedGame.subscribe(game => {
        console.log("PlayingPlayersComponent gameService.sharedGame.subscribe");
        this.game = <Game>game;
        this.refreshPlayers();
      });
      this.subscriptions["game"] = true;
    }
  }

  resolveStatus(player: any): any {
    const round = this.game.details.round;
    const trick = this.game.details.trick;

    if (player.handle == this.game.rounds[round].tricks[trick].to_play) {
      return "list-group-item-warning"
    }
    if (player.handle == this.game.rounds[round].tricks[trick].lead) {
      return "list-group-item-success"
    }
    return "list-group-item-light"
  }

  refreshPlayers(): void {
    let player_list = document.getElementById('player-container');
    if (player_list != null) {
      player_list.innerHTML = '';

      this.game.players.forEach((u, i) => {
        const ul = document.createElement('ul');
        ul.className = `list-group list-group-horizontal`;
        const li_handle = document.createElement('li');
        const li_score = document.createElement('li');
        const li_bet = document.createElement('li');
        const span_bet = document.createElement('span');

        li_handle.innerHTML = `${u.handle} `;
        li_handle.className = `list-group-item ${this.resolveStatus(u)}`;
        ul.appendChild(li_handle);

        li_score.innerHTML = `${u.score} `;
        li_score.className = `list-group-item ${this.resolveStatus(u)}`;
        ul.appendChild(li_score);

        span_bet.innerHTML = `${u.tricks_won}`
        let color = "red";
        if (u.tricks_won == u.bet) {
          color = "green"
        }
        span_bet.style.color = color;
        li_bet.appendChild(span_bet);

        li_bet.innerHTML += `/${u.bet}`;
        li_bet.className = `list-group-item ${this.resolveStatus(u)}`;
        ul.appendChild(li_bet);

        if (player_list != null) {
          player_list.appendChild(ul);
        }
      });
    }
  }
}
