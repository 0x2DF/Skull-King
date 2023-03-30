import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../../../../../services/game.service';
import { Game } from '../../../../../../models/game';
import { Trick } from '../../../../../../models/trick';

@Component({
  selector: 'game-playing-details-tricks',
  templateUrl: './tricks.component.html',
})
export class PlayingDetailsTricksComponent implements OnInit {
  @Input() game: Game = Game();

  gameSubscription!: Subscription;
  subscriptions = {
    "game": false,
  }
  trick: Trick[] = [];

  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {
    this.subscribeGame();
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
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
