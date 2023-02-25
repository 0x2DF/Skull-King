import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from "socket.io-client";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService{
  private socket: any;

  constructor() {
    if (!environment.production) {
      // Local
      this.socket = io(environment.server_url);
    } else {
      // Heroku
      this.socket = io();
    }
    this.socket.connect();
    console.log("Client connected to socket");
  }

  observer: any = undefined;
  
  getSocket(): Socket{
    return this.socket;
  }

  connect(trigger: any): Subject<MessageEvent> {
    let observable = new Observable(observer => {
      this.socket.on(trigger, (data: any) => {
        console.log("Received message from ws server")
        observer.next(data);
      })
      return () => {
        this.socket.disconnect();
      }
    });

    let observer = {
      next: (data: Object) => {
        this.socket.emit(trigger, JSON.stringify(data));
      }
    };

    return Subject.create(observer, observable);
  }
}
