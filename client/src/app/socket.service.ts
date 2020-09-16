import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import io from "socket.io-client";
import { Room } from './room';

@Injectable({
  providedIn: 'root'
})
export class SocketService{
  private socket;

  constructor() { 
    this.socket = io('http://localhost:3000')
    // this.socket = io();
  }

  observer
  getSocketData(trigger: string): Observable<any> {
    this.socket.on(trigger, (res) => {
      this.observer.next(res);
    });
    return this.getSocketDataObservable();
  }

  getSocketDataObservable(): Observable<any> {
    return new Observable(observer => {
      this.observer = observer;
    });
  }

  sendSocketData(trigger: string, data: any): void {
    this.socket.emit(trigger, data);
  }
  
  getSocket(): io{
    return this.socket;
  }
}
