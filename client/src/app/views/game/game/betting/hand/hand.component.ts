import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Card } from '../../../../../models/card';

import { GameService } from '../../../../../services/game.service';

@Component({
    selector: 'game-betting-hand',
    templateUrl: './hand.component.html',
})
export class BettingHandComponent implements OnInit {
  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    console.log("BettingHandComponent onInit()");
    this.subscribeHand();
    this.gameService.refreshHand();
  }

  ngOnDestroy(): void {
    this.handSubscription.unsubscribe();
    console.log("BettingHandComponent ngOnDestroy() handSubscription.unsubscribe()");
  }

  hand = <Card[]>([]);
  handSubscription!: Subscription;
  subscriptions = {
    "hand": false,
  }

  subscribeHand(): void {
    console.log("BettingHandComponent subscribeHand()");
    if (!this.subscriptions["hand"]) {
      this.handSubscription = this.gameService.sharedHand.subscribe(hand => {
        console.log("BettingHandComponent gameService.sharedGame.subscribe");
        this.hand = <Card[]>hand;
      });
      this.subscriptions["hand"] = true;
    }
  }
}
