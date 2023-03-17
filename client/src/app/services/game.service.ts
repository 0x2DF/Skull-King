import { Injectable } from '@angular/core';

import { Observable, of, BehaviorSubject } from 'rxjs';
import io from "socket.io-client";

import { Card } from '../models/card';
import { Error } from '../models/error';
import { Game } from '../models/game';
import { Trick } from '../models/trick';
import { User } from '../models/user';
import { PlayerCard } from '../models/playercard';

import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(
    private socketService: SocketService
  ) {}

  private socket = this.socketService.getSocket();

  private subscriptions = {
    'refresh-game': false,
    'refresh-hand': false,
  }

  private game = new BehaviorSubject(Game());
  sharedGame = this.game.asObservable();

  private hand = new BehaviorSubject(<Card[]>([]));
  sharedHand = this.hand.asObservable();

  newError: Error = Error();
  private error = new BehaviorSubject(this.newError);
  sharedError = this.error.asObservable();

  listenRefreshGame() {
    if (!this.subscriptions['refresh-game']) {
      this.socket.on('refresh-game', (data: any) => {
        console.log("received refresh-game");
        if (data.error) { this.error.next(data.error); }
        if (data.game) { this.game.next(data.game); }
      });
      this.subscriptions['refresh-game'] = true;
    }
  }

  refreshHand() {
    if (!this.subscriptions['refresh-hand']) {
      this.socket.on('refresh-hand', (data: any) => {
        console.log("received refresh-hand");
        if (data.error) { this.error.next(data.error); }
        if (data.hand) { this.hand.next(data.hand); }
      });
      this.subscriptions['refresh-hand'] = true;
    }
    
    this.socket.emit('refresh-hand', null);
  }

  placeBet(bet: Number)
  {
    this.socket.emit('place-bet', {bet: bet});
  }

  playCard(card: Card)
  {
    this.socket.emit('play-card', {card: card});
  }
}
