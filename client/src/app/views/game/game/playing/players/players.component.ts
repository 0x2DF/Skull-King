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

  green = "green";
  red = "red";

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
      return "activePlayer"
    }
    if (player.handle == this.game.rounds[round].tricks[trick].lead) {
      return "leadPlayer"
    }
    if (player.handle == this.user.handle) {
      return "selfPlayer"
    }
    return "defaultPlayer"
  }

  refreshPlayers(): void {
    // let player_list = document.getElementById('player-list');
    // if (player_list != null) {
    //   player_list.innerHTML = '';

    //   const round = this.game.details.round;
    //   const trick = this.game.details.trick;

    //   this.game.players.forEach((u, i) => {
    //     const tr = document.createElement('tr');
    //     const td_status = document.createElement('td');
    //     const td_handle = document.createElement('td');
    //     const td_tricks_won = document.createElement('td');
    //     const td_bet = document.createElement('td');
    //     const td_score = document.createElement('td');
    //     const span_rl = document.createElement('span');
    //     const span_tp = document.createElement('span');

    //     td_status.innerHTML = "";
    //     if (this.game.players[i].handle == 
    //         this.game.rounds[round].tricks[trick].lead){
    //       span_rl.innerHTML = 'Round Leader';
    //       span_rl.className = "badge badge-success";
    //       td_status.append(span_rl);
    //     }
    //     if (this.game.players[i].handle == 
    //       this.game.rounds[round].tricks[trick].to_play){
    //       span_tp.innerHTML = 'To Play';
    //       span_tp.className = "badge badge-warning";
    //       td_status.append(span_tp);
    //     }
    //     tr.append(td_status);

    //     td_handle.innerHTML = `${u.handle} `;
    //     td_handle.className = (this.user.handle == u.handle) ? 'my-0 text-primary' : 'my-0';
    //     tr.append(td_handle);

    //     td_tricks_won.innerHTML = `${u.tricks_won}`;
    //     tr.append(td_tricks_won);

    //     td_bet.innerHTML = `${u.bet}`;
    //     tr.append(td_bet);

    //     td_score.innerHTML = `${u.score}`;
    //     tr.append(td_score);
    //     if (player_list != null) {
    //       player_list.appendChild(tr);
    //     }
    //   });
    // }
  }
}
