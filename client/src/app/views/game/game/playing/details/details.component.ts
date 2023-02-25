import { Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../../../../../services/game.service';
import { Game } from '../../../../../models/game';
import { Trick } from '../../../../../models/trick';
// import { ModalDirective } from 'ngx-bootstrap/modal';
// import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'game-playing-details',
  templateUrl: './details.component.html',
  providers: [
    // { provide: CarouselConfig, useValue: { interval: 5500, noPause: false } },
  ]
})
export class PlayingDetailsComponent implements OnInit {
  // @ViewChild('infoModal') public infoModal: ModalDirective;
  game: Game = Game();
  trick: Trick[] = [];

  myInterval: number | false = 6000;
  slides: any[] = [];
  activeSlideIndex: number = 0;
  noWrapSlides: boolean = false;

  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {

    this.gameService.sharedGame.subscribe(game => {
      this.game = game;
    });

    // this.gameService.sharedSubRound.subscribe(sub_round => {
    //   this.sub_round = sub_round;
    // });
  }
}
