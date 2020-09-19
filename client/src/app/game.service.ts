import { Injectable } from '@angular/core';

import { Observable, of, BehaviorSubject } from 'rxjs';
import io from "socket.io-client";

import { Room } from './room';
import { User } from './user';
import { Trick } from './trick';
import { SocketService } from './socket.service';
import { SubRound } from './subround';
import { WinnerTrick } from './winnertrick';

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

  private sub_round = new BehaviorSubject<SubRound[]>([]);
  sharedSubRound = this.sub_round.asObservable();

  private winner_trick = new BehaviorSubject({
    trick : null,
    player_handle : null,
  });
  sharedWinnerTrick = this.winner_trick.asObservable();

  constructor(
    private socketService: SocketService
    ) {}
  
  updateGame()
  {
    let socket = this.socketService.getSocket();

    socket.on('refresh-game', data => {
      if (data.game){
        this.game.next(data.game);
      }
      socket.emit('refresh-hand', null);
    });

    socket.on('refresh-hand', data => {
      if (data.hand){
        this.hand.next(data.hand);
      }
    });

    socket.on('refresh-subround', data => {
      if (data.sub_round){
        this.sub_round.next(data.sub_round);
      }
    });

    socket.on('winner-trick', data => {
      if (data.winner_trick){
        this.winner_trick.next(data.winner_trick);
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
