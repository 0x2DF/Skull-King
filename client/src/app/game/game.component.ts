import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Room } from '../room';
import { RoomService } from '../room.service';
import { GameService } from '../game.service';
import { Location } from '@angular/common';
import { User } from '../user';
import { Game } from '../game';
import { Trick } from '../trick';

import { ToastrService } from 'ngx-toastr';
import { WinnerTrick } from '../winnertrick';

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
  winner_trick: WinnerTrick;
  public href: string = "";

  constructor(private router: Router,
              private roomService: RoomService,
              private gameService: GameService,
              private location: Location,
              private toastr: ToastrService) { }

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
      this.user = user;
    });

    this.gameService.sharedGame.subscribe(game => {
      this.game = game;
      
      if (this.game.room_code != null &&  this.game.state == 'playing' && this.game.players[ this.game.to_play ].handle == this.user.handle){
        this.showTurn();
      }
    });

    this.gameService.sharedWinnerTrick.subscribe(winner_trick => {
      this.winner_trick = winner_trick;
      if (this.winner_trick.player_handle != null){
        this.showTrickWinner();
      }
    });

    
    this.gameService.sharedHand.subscribe(hand => {
      this.hand = hand;
    });

    this.href = this.router.url.substring(1);
    this.room.code = this.href;

    this.roomService.findRoom(this.room);
    this.gameService.updateGame();
  }

  showTurn(){
    this.toastr.warning("Hey, it's your turn to play! Watch for time left", "New Turn", {
      timeOut : 4000,
      progressBar: true,
      tapToDismiss: true
    });
  }

  showTrickWinner(){
    if (this.winner_trick.trick.id == 71){
      this.toastr.info(`${this.winner_trick.player_handle} played a Kraken. No winner.`, "End of Round", {
        timeOut : 5000,
        progressBar: true,
        tapToDismiss: true
      });
    }else {
      this.toastr.success(`${this.winner_trick.player_handle} wins the round with ${this.winner_trick.trick.name}`, "Round Winner", {
        timeOut : 5000,
        progressBar: true,
        tapToDismiss: true
      });
    }
    
  }

}
