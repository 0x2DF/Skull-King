import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../game';
import { Trick } from '../trick';
import { HandComponent } from '../hand/hand.component';

@Component({
  selector: 'app-betboard',
  templateUrl: './betboard.component.html',
  styleUrls: ['./betboard.component.css']
})
export class BetboardComponent implements OnInit {

  game: Game;
  hand: Trick[];
  rounds: Array<Number>;

  constructor(
    private gameService: GameService
    ) {
      this.rounds = Array.from(Array(11),(x,i)=>i);
    }

  ngOnInit(): void {
    this.gameService.sharedGame.subscribe(game => {
      this.game = game;
    });
  }

  submitBet(bet: Number)
  {
    event.preventDefault();
    if (bet >= 0 && bet <= 10){
      this.gameService.makeBet(bet);
    }
    for (let r in this.rounds)
    {
      let btn = document.getElementById(`${r}_bet_btn`);
      btn.className = "btn btn-block btn-outline-primary btn-brand";
      if (bet == Number(r)){
        btn.className += " active";
      }
    }
  }

}
