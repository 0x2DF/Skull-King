import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Game } from '../../../../models/game';
import { User } from '../../../../models/user';

import { GameService } from '../../../../services/game.service';

@Component({
    selector: 'game-playing',
    templateUrl: './playing.component.html',
})
export class PlayingComponent implements OnInit {
  constructor(public gameService: GameService) {
  }

  ngOnInit(): void {
    this.subscribeGame();
    console.log("this.game");
    console.log(this.game);
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

  @Input() game: Game = Game();
  @Input() user: User = User();
  gameSubscription!: Subscription;
  subscriptions = {
    "game": false,
  }

  subscribeGame(): void {
    if (!this.subscriptions["game"]) {
      this.gameSubscription = this.gameService.sharedGame.subscribe(game => {
        this.game = <Game>game;
        
        this.gameService.refreshHand();
      });
      this.subscriptions["game"] = true;
    }
  }

  getTrickWinner(): string {
    let round = this.game.details.round;
    let trick = this.game.details.trick;

    if (this.game.rounds[round].tricks[trick].winner != null) {
      return this.game.rounds[round].tricks[trick].winner.player;
    } else {
      return "";
    }
  }
}
