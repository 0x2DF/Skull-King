import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';

import { Subscription } from 'rxjs';

import { Lobby } from '../../../models/lobby';
import { LobbyService } from '../../../services/lobby.service';
import { User } from '../../../models/user';

@Component({
  selector: 'game-handle',
  templateUrl: './handle.component.html',
  styleUrls: ['./handle.component.css']
})
export class HandleComponent implements OnInit, OnDestroy {
  constructor(
    public lobbyService: LobbyService,
    ) {
      this.setColor();
    }

  ngOnInit(): void {
    this.subscribeLobby();
  }

  ngOnDestroy(): void {
    this.lobbySubscription.unsubscribe();
  }

  @Input() lobby: Lobby = {code:"",clients:<string[]>([]),state:"",admin:""};
  @Output() userEvent = new EventEmitter<User>();
  user: User = {handle:""};
  lobbySubscription!: Subscription;
  subscriptions = {
    "lobby": false,
  }

  cilStar = "cil-star";

  colors = [
    { color: 'primary', textColor: 'primary' },
    { color: 'secondary', textColor: 'secondary' },
    { color: 'success', textColor: 'success' },
    { color: 'danger', textColor: 'danger' },
    { color: 'warning', textColor: 'warning' },
    { color: 'info', textColor: 'info' },
    { color: 'light' },
    { color: 'dark' }
  ];

  public borderColor = this.colors[0].color;

  setColor() {
    this.borderColor = this.colors[Math.floor(Math.random()*this.colors.length)].color;
  }

  subscribeLobby(): void {
    if (!this.subscriptions["lobby"]) {
      this.lobbySubscription = this.lobbyService.sharedLobby.subscribe(lobby => {
        console.log("HandleComponent lobbyService.sharedLobby.subscribe()");
        this.lobby = <Lobby>lobby;

        console.log(this.user);
        console.log(this.lobby);
        if (this.user && this.lobby) {
          if (this.lobby.clients.includes(this.user.handle)) {
            this.userEvent.emit(this.user);
          }
        }
      });
      this.subscriptions["lobby"] = true;
    }
  }

  submitName(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.user = { handle: name }
    this.lobbyService.joinLobby(this.user, this.lobby);
  }

}
