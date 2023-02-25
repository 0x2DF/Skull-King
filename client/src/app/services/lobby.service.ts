import { Injectable } from '@angular/core';

import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import io from "socket.io-client";

import { Lobby } from '../models/lobby';
import { Error } from '../models/error';
import { User } from '../models/user';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class LobbyService{
  constructor(
    private socketService: SocketService
  ) { }

  private socket = this.socketService.getSocket();

  private subscriptions = {
    'create-lobby': false,
    'find-lobby': false,
    'join-lobby': false,
    'refresh-lobby': false,
  }

  newLobby: Lobby = Lobby();
  private lobby = new BehaviorSubject(this.newLobby);
  sharedLobby = this.lobby.asObservable();

  newError: Error = {name:""};
  private error = new BehaviorSubject(this.newError);
  sharedError = this.error.asObservable();


  reset () {
    this.error.next(this.newError);
    this.lobby.next(this.newLobby);
  }

  createLobby() {
    if (!this.subscriptions['create-lobby']) {
      this.socket.on('create-lobby', (data: any) => {
        console.log("received create-lobby");
        if (data.error) { this.error.next(data.error); }
        else if (data.lobby) { this.lobby.next(data.lobby); }
      });
      this.subscriptions['create-lobby'] = true;
    }
    this.socket.emit('create-lobby', null);
  }

  findLobby(lobby: Lobby) {
    if (!this.subscriptions['find-lobby']) {
      this.socket.on('find-lobby', (data: any) => {
        console.log("received find-lobby");
        if (data.error) { this.error.next(data.error); }
        else if (data.lobby) { this.lobby.next(data.lobby); }
      });
      this.subscriptions['find-lobby'] = true;
    }
    this.socket.emit('find-lobby', lobby);
  }

  joinLobby(user: User, lobby: Lobby) {
    console.log("joinLobby()");
    this.refreshLobby();

    this.socket.emit('join-lobby', {handle: user.handle, code: lobby.code});
  }

  refreshLobby() {
    if (!this.subscriptions['refresh-lobby']) {
      this.socket.on('refresh-lobby', (data: any) => {
        console.log("received refresh-lobby");
        if (data.error) { this.error.next(data.error); }
        else if (data.lobby) { this.lobby.next(data.lobby); }
      });
      this.subscriptions['refresh-lobby'] = true;
    }
  }

  startLobby(){
    console.log("startLobby()");
    this.refreshLobby();
    this.socket.emit('start-lobby', null);
  }

}
