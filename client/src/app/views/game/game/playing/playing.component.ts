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
    console.log("PlayingComponent onInit()");
    this.subscribeGame();
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
    console.log("PlayingComponent ngOnDestroy() gameSubscription.unsubscribe()");
  }

  @Input() game: Game = Game();
  @Input() user: User = User();
  gameSubscription!: Subscription;
  subscriptions = {
    "game": false,
  }

  subscribeGame(): void {
    console.log("PlayingComponent subscribeGame()");
    if (!this.subscriptions["game"]) {
      this.gameSubscription = this.gameService.sharedGame.subscribe(game => {
        console.log("PlayingComponent gameService.sharedGame.subscribe");
        this.game = <Game>game;
        
        this.gameService.refreshHand();
      });
      this.subscriptions["game"] = true;
    }
  }
}
