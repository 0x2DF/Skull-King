import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Game } from '../../../../models/game';
import { User } from '../../../../models/user';

import { GameService } from '../../../../services/game.service';

@Component({
    selector: 'game-betting',
    templateUrl: './betting.component.html',
})
export class BettingComponent implements OnInit {
  constructor(public gameService: GameService) {
  }

  ngOnInit(): void {
    console.log("BettingComponent onInit()");
    this.subscribeGame();
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
    console.log("BettingComponent ngOnDestroy() gameSubscription.unsubscribe()");
  }

  @Input() game: Game = Game();
  @Input() user: User = User();
  gameSubscription!: Subscription;
  subscriptions = {
    "game": false,
  }

  subscribeGame(): void {
    console.log("BettingComponent subscribeGame()");
    if (!this.subscriptions["game"]) {
      this.gameSubscription = this.gameService.sharedGame.subscribe(game => {
        console.log("BettingComponent gameService.sharedGame.subscribe");
        this.game = <Game>game;
      });
      this.subscriptions["game"] = true;
    }
  }
}
