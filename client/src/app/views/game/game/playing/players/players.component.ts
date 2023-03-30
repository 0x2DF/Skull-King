import { Component, OnInit, Input } from '@angular/core';
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
    this.subscribeGame();
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

  game: Game = Game();
  @Input() user: User = User();

  gameSubscription!: Subscription;
  subscriptions = {
    "game": false,
  }

  subscribeGame(): void {
    if (!this.subscriptions["game"]) {
      this.gameSubscription = this.gameService.sharedGame.subscribe(game => {
        this.game = <Game>game;
        this.refreshPlayers();
      });
      this.subscriptions["game"] = true;
    }
  }

  getHighestScore(): string {
    let current = this.game.players[0];
    this.game.players.forEach((u, i) => {
      if (u.score > current.score){
        current = u;
      }
    });
    return current.handle;
  }

  refreshPlayers(): void {
    const round = this.game.details.round;
    const trick = this.game.details.trick;
    let score_lead_handle = this.getHighestScore();

    let player_list = document.getElementById('player-list');
    if (player_list != null) {
      player_list.innerHTML = '';

      this.game.players.forEach((u, i) => {
        const tr = document.createElement('tr');
        const td_status = document.createElement('td');
        const td_handle = document.createElement('td');
        const td_tricks_won = document.createElement('td');
        const td_bet = document.createElement('td');
        const td_score = document.createElement('td');
        const badge_round_lead = document.createElement('c-badge');
        const badge_to_play = document.createElement('c-badge');
        const badge_score_lead = document.createElement('c-badge');
        const span_bet = document.createElement('span');

        if (u.handle == this.user.handle) {
          tr.className = "table-primary";
          tr.setAttribute("ctablecolor", "primary");
        } else {
          tr.className = "table-light";
          tr.setAttribute("ctablecolor", "light");
        }

        td_status.innerHTML = "";
        if (u.handle == this.game.rounds[round].tricks[trick].lead) {
          badge_round_lead.innerHTML = 'Round Lead';
          badge_round_lead.className = "badge bg-danger";
          badge_round_lead.setAttribute("color", "danger");
        }
        td_status.append(badge_round_lead);
        if (u.handle == this.game.rounds[round].tricks[trick].to_play) {
          badge_to_play.innerHTML = 'To Play';
          badge_to_play.className = "badge bg-warning";
          badge_to_play.setAttribute("color", "warning");
        }
        td_status.append(badge_to_play);
        if (u.handle == score_lead_handle) {
          badge_score_lead.innerHTML = 'Score Lead';
          badge_score_lead.className = "badge bg-success";
          badge_score_lead.setAttribute("color", "success");
        }
        td_status.append(badge_score_lead);
        tr.append(td_status);

        td_handle.innerHTML = `${u.handle} `;
        tr.append(td_handle);

        td_tricks_won.innerHTML = `${u.tricks_won}`;
        tr.append(td_tricks_won);
        
        span_bet.innerHTML = `${u.bet}`;
        let color = "red";
        if (u.tricks_won == u.bet) {
          color = "green"
        }
        span_bet.style.color = color;
        td_bet.appendChild(span_bet);
        tr.append(td_bet);

        td_score.innerHTML = `${u.score}`;
        tr.append(td_score);

        if (player_list != null) {
          player_list.appendChild(tr);
        }
      });
    }
  }
}
