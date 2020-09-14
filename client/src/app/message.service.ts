import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { RoomService } from './room.service';
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  user: User;

  constructor(
    private roomService: RoomService,
    private socketService: SocketService
    ) {
      this.roomService.sharedUser.subscribe(user => { this.user = user });
    }


  listenForMessages(){
    console.log("listen for messages");
    this.socketService.getSocketData('message-broadcast').subscribe(
      data =>
      {
        if (data.message)
        {
          console.log("message-broadcast");
          console.log(data.message);
          const element = document.createElement('li');
          element.innerHTML = 
          `
            <div>
            <h6 class="my-0">${data.handle}</h6>
            <small class="text-muted">${data.message}</small>
            </div>
          `;
          element.className = "list-group-item d-flex justify-content-between lh-condensed text-left";
          document.getElementById('message-list').appendChild(element);
        }
        
      }
    );
  }

  SendMessage(message: string) {
    this.socketService.sendSocketData('chat-message', message);

    const element = document.createElement('li');
    element.innerHTML = 
    `
      <div>
      <h6 class="my-0 text-primary">${this.user.handle}</h6>
      <small class="text-muted">${message}</small>
      </div>
    `;
    element.className = "list-group-item d-flex justify-content-between lh-condensed text-left";
    document.getElementById('message-list').appendChild(element);
  }
}