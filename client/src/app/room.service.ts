import { Injectable } from '@angular/core';

import { Observable, of, BehaviorSubject } from 'rxjs';
import io from "socket.io-client";

import { Room } from './room';
import { User } from './user';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService{

  private room = new BehaviorSubject({
    code : null,
    users : null,
    state : null,
    SK : null
  });
  sharedRoom = this.room.asObservable();

  private user = new BehaviorSubject({
    id : null,
    handle : null,
    room_code : null
  });
  sharedUser = this.user.asObservable();

  constructor(
    private socketService: SocketService
    ) {}

  createRoom(){
    console.log("creating new room");
    this.socketService.sendSocketData('create-room', 'create');
    this.socketService.getSocketData('create-room').subscribe(
      data =>
      {
        if (data.room){
          this.room.next(data.room);
        }
      }
    );
  }

  findRoom(room: Room){
    this.socketService.sendSocketData('find-room', room);
    this.socketService.getSocketData('find-room').subscribe(
      data =>
      {
        if (data.room)
        {
          this.room.next(data.room);
        }
      }
    );
  }

  joinRoom(user: User, room: Room) {
    this.socketService.sendSocketData('join-room', {user: user, room: room});
    this.socketService.getSocketData('refresh-room').subscribe(
      data =>
      {
        console.log("room service [join-room]");
        console.log(data.room);
        if (data.room){
          this.room.next(data.room);
        
          user.room_code = data.room.room_code;
          this.user.next(user);
        }
      }
    );
  }

  refreshRoom(){
    let socket = this.socketService.getSocket();

    socket.on('refresh-room', data => {
      // console.log("room service [refreshPlayers]");
      // console.log(data.room);
      if (data.room){
        this.room.next(data.room);
      }
    });
  }

  startLobby(){
    console.log("room service [startLobby]");
    this.socketService.sendSocketData('start-lobby', {data : null});
  }

}
