import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../../../../services/game.service';
import { Card } from '../../../../../models/card';
import { Game } from '../../../../../models/game';

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
    this.subscribeHand();
    this.gameService.listenResolveTrick();
    console.log("this.game");
    console.log(this.game);
  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    this.handSubscription.unsubscribe();
  }

  @Input() game: Game = Game();
  public card: Card = Card();
  data: any = {};
  hand = <Card[]>([]);

  handSubscription!: Subscription;
  cardSubscription!: Subscription;
  dataSubscription!: Subscription;
  subscriptions = {
    "card": false,
    "data": false,
    "hand": false,
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

  subscribeHand(): void {
    if (!this.subscriptions["hand"]) {
      this.handSubscription = this.gameService.sharedHand.subscribe(hand => {
        this.hand = <Card[]>hand;
      });
      this.subscriptions["hand"] = true;
    }
  }

  subscribeData(): void {
    if (!this.subscriptions["data"]) {
      this.dataSubscription = this.gameService.sharedData.subscribe(data => {
        this.data = <any>data;
        console.log("this.data");
        console.log(this.data);
      });
      this.subscriptions["data"] = true;
    }
  }

  handleResolveModalChange(event: any) {
    console.log("handleResolveModalChange()");
    this.visible = event;
    if (this.visible == false) {
      this.gameService.resolveTrick(null);
    }
  }

  getCardComponent(card: Card) : any{
    return card.id == 2 ? "bendtCard" : 
            (card.id == 3 ? "harryCard" :
              (card.id == 4 ? "juanitaCard" :
                (card.id == 5 ? "rascalCard" : "rosieCard")));
  }
}
