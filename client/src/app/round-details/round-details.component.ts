import { Component, OnInit } from '@angular/core'
import { GameService } from '../game.service';;
import { Game } from '../game';

@Component({
  selector: 'app-round-details',
  templateUrl: './round-details.component.html',
  styleUrls: ['./round-details.component.css']
})
export class RoundDetailsComponent implements OnInit {

  game: Game;
  constructor(private gameService: GameService
              ) { }

  ngOnInit(): void {
    this.gameService.sharedGame.subscribe(game => {
      this.game = game;
    });
  }

}
