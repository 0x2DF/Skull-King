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
    console.log("BettingComponent onInit()");
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

  playTrick(card: Card){
    // if (trick.id == 72){
    //   let tigress_switch = document.getElementById(`${trick.id}_switch`) as HTMLInputElement;
    //   trick.type = (tigress_switch.checked == true ? 'Pirate' : 'Escape');
    // }
    // this.gameService.playTrick(trick);
  }
}
