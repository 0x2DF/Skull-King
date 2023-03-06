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

  subscribeHand(): void {
    console.log("PlayingHandComponent subscribeHand()");
    if (!this.subscriptions["hand"]) {
      this.handSubscription = this.gameService.sharedHand.subscribe(hand => {
        console.log("PlayingHandComponent gameService.sharedGame.subscribe");
        this.hand = <Card[]>hand;
      });
      this.subscriptions["hand"] = true;
    }
  }

  playCard(card: Card){
    if (card.id == this.TIGRESS_ID){
      let tigress_switch = document.getElementById(`${card.id}_switch`) as HTMLInputElement;
      card.type = (tigress_switch.checked == true ? 'Pirate' : 'Escape');
    }
    this.gameService.playCard(card);
  }
}
