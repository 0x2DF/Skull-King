import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Game } from '../../../../../models/game';

import { GameService } from '../../../../../services/game.service';

@Component({
    selector: 'game-betting-betboard',
    templateUrl: './betboard.component.html',
})
export class BettingBetboardComponent implements OnInit {
  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.subscribeGame();
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }

  game: Game = Game();

  bets: Array<Number> = [];
  gameSubscription!: Subscription;
  subscriptions = {
    "game": false,
  }

  subscribeGame(): void {
    if (!this.subscriptions["game"]) {
      this.gameSubscription = this.gameService.sharedGame.subscribe(game => {
        this.game = <Game>game;
        
        this.bets = Array.from(Array(this.game.details.round + 2),(x,i)=>i);
      });
      this.subscriptions["game"] = true;
    }
  }

  placeBet(bet: Number)
  {
    if (bet >= 0 && bet <= 10){
      this.gameService.placeBet(bet);
      this.updateSelectedBet(bet);
    }
  }

  updateSelectedBet(bet: Number)
  {
    for (let r in this.bets)
    {
      let btn = document.getElementById(`${r}_bet_btn`);
      if (btn != null) {
        btn.className = "btn rounded-pill ";
        if (bet == Number(r)){
          btn.className += "btn-warning active";
        } else {
          btn.className += "btn-light active";
        }
      }
    }
  }
}
