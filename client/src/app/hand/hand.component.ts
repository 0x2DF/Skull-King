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
    if (trick.id == 72){
      let tigress_switch = document.getElementById(`${trick.id}_switch`) as HTMLInputElement;
      trick.type = (tigress_switch.checked == true ? 'Pirate' : 'Escape');
    }
    this.gameService.playTrick(trick);
  }

}
