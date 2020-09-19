import { Injectable } from '@angular/core';

import { Observable, of, BehaviorSubject } from 'rxjs';
import io from "socket.io-client";

import { Room } from './room';
import { User } from './user';
import { Trick } from './trick';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private game = new BehaviorSubject({
    room_code : null,
    state : null,
    to_play : null,
    round_lead : null,
    round : null,
    sub_round : null,
    total_rounds : null,
    round_time : null,
    bet_time : null,
    winning_trick : { trick: null, player_handle: null},
    players : []
  });
  sharedGame = this.game.asObservable();

  private hand = new BehaviorSubject<Trick[]>([]);
  sharedHand = this.hand.asObservable();

  private sub_round = new BehaviorSubject({
    winner_trick : null,
    cards : []
  });
  sharedSubRound = this.sub_round.asObservable();

  constructor(
    private socketService: SocketService
    ) {}
  
  updateGame()
  {
    let socket = this.socketService.getSocket();

    socket.on('refresh-game', data => {
      console.log("game service [updateGame]");
      console.log(data.game);
      if (data.game){
        this.game.next(data.game);
      }
      socket.emit('refresh-hand', null);
    });

    socket.on('refresh-hand', data => {
      console.log("game service [updateGame]");
      console.log(data.hand);
      if (data.hand){
        this.hand.next(data.hand);
      }
    });

    socket.on('refresh-subround', data => {
      console.log('game server [updateGame');
      console.log(data.sub_round);
      if (data.sub_round){
        this.sub_round.next(data.sub_round);
      }
    });
  }

  makeBet(bet: Number)
  {
    this.socketService.sendSocketData('make-bet', {bet: bet});
  }

  playTrick(trick: Trick)
  {
    this.socketService.sendSocketData('play-trick', {trick: trick});
  }
}
