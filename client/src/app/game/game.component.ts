import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../room';
import { RoomService } from '../room.service';
import { GameService } from '../game.service';
import { Location } from '@angular/common';
import { User } from '../user';
import { Game } from '../game';
import { Trick } from '../trick';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  game: Game;
  hand: Trick[];
  room: Room;
  user: User;
  message: string;
  public href: string = "";

  constructor(private router: Router,
              private roomService: RoomService,
              private gameService: GameService,
              private location: Location) { }

  ngOnInit(): void {
    this.roomService.sharedRoom.subscribe(room => {
      this.room = room;
      if (this.room.code == '404'){
        const url = "404";
        this.location.go(url);
        location.reload(false);
      }
    });
    this.roomService.sharedUser.subscribe(user => {
      // console.log("game component");
      this.user = user;
      // console.log(this.user);
    });

    this.gameService.sharedGame.subscribe(game => {
      // console.log("game component");
      this.game = game;
      // console.log(this.game);
    });
    
    this.gameService.sharedHand.subscribe(hand => {
      this.hand = hand;
    });

    this.href = this.router.url.substring(1);
    this.room.code = this.href;

    this.roomService.findRoom(this.room);
    this.gameService.updateGame();
  }

}
