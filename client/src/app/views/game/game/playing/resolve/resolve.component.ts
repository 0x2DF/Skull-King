import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../../../../services/game.service';
import { Card } from '../../../../../models/card';

@Component({
  selector: 'game-playing-resolve',
  templateUrl: './resolve.component.html',
})
export class PlayingResolveComponent implements OnInit {
  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {
    this.subscribeCard();
    this.subscribeData();
    this.gameService.listenResolveTrick();
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }

  public card: Card = Card();
  data: any = {};

  cardSubscription!: Subscription;
  dataSubscription!: Subscription;
  subscriptions = {
    "card": false,
    "data": false,
  }

  public visible = true;

  subscribeCard(): void {
    if (!this.subscriptions["card"]) {
      this.cardSubscription = this.gameService.sharedCard.subscribe(card => {
        this.card = <Card>card;
      });
      this.subscriptions["card"] = true;
    }
  }

  subscribeData(): void {
    if (!this.subscriptions["data"]) {
      this.dataSubscription = this.gameService.sharedGame.subscribe(data => {
        this.data = <any>data;
      });
      this.subscriptions["data"] = true;
    }
  }

  handleResolveModalChange(event: any) {
    this.visible = event;
    this.gameService.resolveTrick(null);
  }
}
