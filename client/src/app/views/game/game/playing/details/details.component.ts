import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GameService } from '../../../../../services/game.service';
import { Game } from '../../../../../models/game';
import { Card } from '../../../../../models/card';
import { Trick } from '../../../../../models/trick';

@Component({
  selector: 'game-playing-details',
  templateUrl: './details.component.html',
})
export class PlayingDetailsComponent implements OnInit {
  game: Game = Game();
  trick: Trick[] = [];

  gameSubscription!: Subscription;
  subscriptions = {
    "game": false,
  }
  TIGRESS_ID = 7;
  WILDCARD_ID = 66;

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

  isTigressCard(card: Card): boolean {
    return (card.id == this.TIGRESS_ID);
  }

  isWildcard(card: Card): boolean {
    return (card.rank == 0);
  }
}
