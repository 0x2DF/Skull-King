import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Card } from '../../../../../models/card';

import { GameService } from '../../../../../services/game.service';

@Component({
    selector: 'game-playing-hand',
    templateUrl: './hand.component.html',
})
export class PlayingHandComponent implements OnInit {
  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    console.log("PlayingHandComponent onInit()");
    this.subscribeHand();
    this.gameService.refreshHand();
  }

  ngOnDestroy(): void {
    this.handSubscription.unsubscribe();
    console.log("PlayingHandComponent ngOnDestroy() handSubscription.unsubscribe()");
  }

  hand = <Card[]>([]);
  handSubscription!: Subscription;
  subscriptions = {
    "hand": false,
  }

  TIGRESS_ID = 7;
  tigressAsPirate = false;

  subscribeHand(): void {
    if (!this.subscriptions["hand"]) {
      this.handSubscription = this.gameService.sharedHand.subscribe(hand => {
        this.hand = <Card[]>hand;
      });
      this.subscriptions["hand"] = true;
    }
  }

  playCard(card: Card){
    this.gameService.playCard(card);
  }

  playTigress(card: Card) {
    console.log(card);
    this.playCard(card);
  }

  isTigressCard(card: Card): boolean {
    return (card.id == this.TIGRESS_ID);
  }
}
