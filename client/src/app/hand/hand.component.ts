import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Trick } from '../trick';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.css']
})
export class HandComponent implements OnInit {

  hand: Trick[];

  constructor(
    private gameService: GameService
  ) { 
    
  }

  ngOnInit(): void {
    this.gameService.sharedHand.subscribe(hand => {
      this.hand = hand;
    });
  }

  playTrick(trick: Trick){
    this.gameService.playTrick(trick);
  }

}
