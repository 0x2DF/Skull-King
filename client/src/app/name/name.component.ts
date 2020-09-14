import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Room } from '../room';
import { RoomService } from '../room.service';
import { User } from '../user';

@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.css']
})
export class NameComponent implements OnInit {

  room: Room;
  user: User;
  
  constructor(
    private roomService: RoomService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.roomService.sharedRoom.subscribe(room => { 
      this.room = room;
    });
    this.roomService.sharedUser.subscribe(user => { this.user = user });
  }

  submitName(name: string): void {
    event.preventDefault();

    name = name.trim();
    if (!name) { return; }

    this.user = {
      id: null,
      handle: name,
      room_code: null
    }

    this.roomService.joinRoom(this.user, this.room);
  }

}
