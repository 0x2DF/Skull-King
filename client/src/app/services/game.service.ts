import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Card } from '../models/card';
import { Error } from '../models/error';
import { Game } from '../models/game';

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
    'get-resolve-trick': false,
  }

  private game = new BehaviorSubject(Game());
  sharedGame = this.game.asObservable();

  private hand = new BehaviorSubject(<Card[]>([]));
  sharedHand = this.hand.asObservable();

  private card = new BehaviorSubject(Card());
  sharedCard = this.card.asObservable();

  private data = new BehaviorSubject({});
  sharedData = this.data.asObservable();

  newError: Error = Error();
  private error = new BehaviorSubject(this.newError);
  sharedError = this.error.asObservable();

  listenRefreshGame() {
    if (!this.subscriptions['refresh-game']) {
      this.socket.on('refresh-game', (data: any) => {
        if (data.error) { this.error.next(data.error); }
        if (data.game) { this.game.next(data.game); }
      });
      this.subscriptions['refresh-game'] = true;
    }
  }

  refreshHand() {
    if (!this.subscriptions['refresh-hand']) {
      this.socket.on('refresh-hand', (data: any) => {
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

  listenResolveTrick() {
    if (!this.subscriptions['get-resolve-trick']) {
      this.socket.on('get-resolve-trick', (data: any) => {
        if (data.error) { this.error.next(data.error); }
        if (data.card) { this.card.next(data.card); }
        if (data.data) { this.data.next(data.data); }
        if (data.hand) { this.hand.next(data.hand); }
      });
      this.subscriptions['get-resolve-trick'] = true;
    }
    this.socket.emit('get-resolve-trick', null);
  }

  resolveTrick(data: any)
  {
    console.log("resolveTrick")
    this.socket.emit('resolve-trick', {data: data});
  }
}
