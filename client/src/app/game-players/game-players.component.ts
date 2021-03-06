import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../game';
import { User } from '../user';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-game-players',
  templateUrl: './game-players.component.html',
  styleUrls: ['./game-players.component.css']
})
export class GamePlayersComponent implements OnInit {
  game: Game;
  user: User;

  constructor(
    private gameService: GameService,
    private roomService: RoomService
    ) { }

  ngOnInit(): void {
    this.roomService.sharedUser.subscribe(user => this.user = user);
    this.gameService.sharedGame.subscribe(game => {
      this.game = game;

      let player_list = document.getElementById('player-list');
      player_list.innerHTML = '';
      
      this.game.players.forEach((u, i) => {
        const tr = document.createElement('tr');
        const td_status = document.createElement('td');
        const td_handle = document.createElement('td');
        const td_tricks_won = document.createElement('td');
        const td_bet = document.createElement('td');
        const td_score = document.createElement('td');
        const span_rl = document.createElement('span');
        const span_tp = document.createElement('span');
        // const span = document.createElement('span');

        td_status.innerHTML = "";
        if (i == this.game.round_lead){
          span_rl.innerHTML = 'Round Leader';
          span_rl.className = "badge badge-success";
        }
        td_status.append(span_rl);
        if (i == this.game.to_play){
          span_tp.innerHTML = 'To Play';
          span_tp.className = "badge badge-warning";
        }
        td_status.append(span_tp);
        tr.append(td_status);

        td_handle.innerHTML = `${u.handle} `;
        td_handle.className = (this.user.handle == u.handle) ? 'my-0 text-primary' : 'my-0';
        tr.append(td_handle);

        td_tricks_won.innerHTML = `${u.tricks_won}`;
        tr.append(td_tricks_won);

        td_bet.innerHTML = `${u.bet}`;
        tr.append(td_bet);

        td_score.innerHTML = `${u.score}`;
        tr.append(td_score);

        player_list.appendChild(tr);
        
      });

    });
  }
}
