import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../../../services/game.service';
import { Game } from '../../../../../models/game';
import { Trick } from '../../../../../models/trick';

@Component({
  selector: 'game-playing-details',
  templateUrl: './details.component.html',
})
export class PlayingDetailsComponent implements OnInit {
  game: Game = Game();
  trick: Trick[] = [];

  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {
    this.gameService.sharedGame.subscribe(game => {
      this.game = game;
    });
  }
}
