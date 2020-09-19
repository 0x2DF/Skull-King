import { Component, OnInit } from '@angular/core';
import { Room } from '../room';
import { User } from '../user';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-lobby-players',
  templateUrl: './lobby-players.component.html',
  styleUrls: ['./lobby-players.component.css']
})
export class LobbyPlayersComponent implements OnInit {

  room: Room;
  user: User;

  constructor(private roomService: RoomService){ }

  ngOnInit(): void {
    this.roomService.sharedUser.subscribe(user => this.user = user);
    this.roomService.sharedRoom.subscribe(room => {
      this.room = room;

      let user_list = document.getElementById('user-list');
      user_list.innerHTML = '';
      
      this.room.users.forEach((u, i) => {
        const tr = document.createElement('tr');
        const td_handle = document.createElement('td');
        const td_role = document.createElement('td');
        const span = document.createElement('span');
        td_handle.innerHTML = u;
        td_handle.className = (this.user.handle == u) ? 'my-0 text-primary' : 'my-0';
        tr.append(td_handle);

        if (this.room.users[i] == this.room.SK){
          span.innerHTML = 'SK';
          span.className = "badge badge-success";
        }

        td_role.append(span);
        tr.append(td_role);
        user_list.appendChild(tr);
        
      });

      let start_btn = document.getElementById('start-lobby-btn');
      if (this.user.handle == this.room.SK){
        start_btn.style.visibility = "visible";
      }else{
        start_btn.style.visibility = "hidden";
      }
    });

    this.roomService.refreshRoom();
  }

  StartLobby(){
    event.preventDefault();
    if (this.roomService) this.roomService.startLobby();
  }

}
