import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../game';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css']
})
export class GameDetailsComponent implements OnInit {
  game: Game;

  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {

    this.gameService.sharedGame.subscribe(game => {
      this.game = game;

      let container = document.getElementById('winning-trick-container');
      if (container)
      {
        container.innerHTML = '';

        if (game.winning_trick != null)
        {
          let trick = game.winning_trick.trick;

          const row = document.createElement('div');
          const col = document.createElement('div');
          const card = document.createElement('div');
          const card_body = document.createElement('div');
          const avatar = document.createElement('div');
          const img = document.createElement('img');
          const name = document.createElement('div');
          const value = document.createElement('div');
          const type = document.createElement('div');
          const player = document.createElement('div');

          avatar.className = "float-left";
          img.src = `assets/images/small/${trick.id}.jpg`;
          avatar.append(img);

          name.innerHTML = `${trick.name}`;
          name.className = "h5 text-danger mb-0 pt-3";
          value.innerHTML = `Value: ${trick.value}`;
          value.className = "text-muted font-weight-bold font-xs";
          type.innerHTML = `Type: ${trick.type}`;
          type.className = "text-muted font-weight-bold font-xs";
          player.innerHTML = `Player: ${game.winning_trick.player_handle}`;
          player.className = "text-muted font-weight-bold font-xs";

          
          card_body.append(avatar);
          card_body.append(name);
          card_body.append(value);
          card_body.append(type);
          card_body.append(player);
          card_body.className = "card-body p-0 clearfix";

          card.append(card_body);
          card.className = "card";
          col.append(card);
          col.className = "col-3 col-lg-3";
          row.append(col);
          row.className = "row";
          container.appendChild(row);
        }
      }
    });
  }
}
