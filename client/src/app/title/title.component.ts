import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

import { Room } from '../room';
import { RoomService } from '../room.service';
import { CompileTemplateMetadata } from '@angular/compiler';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  room: Room;
  message: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private location: Location
  ) {}

  ngOnInit(): void {
  }

  createRoom(): void{
    event.preventDefault();
    

    this.roomService.createRoom();
    
    this.roomService.sharedRoom.subscribe(
      room => { 
          this.room = room;
          // (<HTMLInputElement>document.getElementById("inputRoomCode")).value = this.room.code;
          if (this.room.code != null)
          {
            const url = `${this.room.code}`;
            this.router.navigate([`${url}`]);
            // this.location.go(url);
            // location.reload(false);
          }
         }
      );
  }

  findRoom(code: string): void {
    event.preventDefault();

    code = code.trim();
    if (!code) { return; }

    let temp_room: Room = {
      code: code,
      users: [],
      state: null,
      SK: null
    }

    this.roomService.findRoom(temp_room);

    this.roomService.sharedRoom.subscribe(
      room => { 
        this.room = room;
        if (this.room.code == null) {

        } else if (this.room.code == '404') {
          console.log(`Room ${temp_room.code} not found`);
        } else {
          const url = `${this.room.code}`;
          this.router.navigate([`${url}`]);
        }
      }
    );
  }

  howToPlay() {

  }

}
