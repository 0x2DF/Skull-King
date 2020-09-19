import { Component, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../game';
import { Trick } from '../trick';
import { SubRound } from '../subround';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 5500, noPause: false } },
  ]
})
export class GameDetailsComponent implements OnInit {
  @ViewChild('infoModal') public infoModal: ModalDirective;
  game: Game;
  sub_round: SubRound[];

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

    this.gameService.sharedSubRound.subscribe(sub_round => {
      this.sub_round = sub_round;
    });
  }
}
