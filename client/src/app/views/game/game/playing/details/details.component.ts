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

  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {
    this.gameService.sharedGame.subscribe(game => {
      this.game = game;
    });
  }
}
