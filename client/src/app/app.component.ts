import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SocketService } from './socket.service';
import io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  title = 'Skull King';

  constructor(socketService: SocketService) {}

  public ngOnInit(){
    
  }
}
