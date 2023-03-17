import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Lobby } from '../../../models/lobby';
import { User } from '../../../models/user';
import { LobbyService } from '../../../services/lobby.service';

@Component({
    selector: 'game-lobby',
    templateUrl: './lobby.component.html',
})
export class LobbyComponent implements OnInit {
  constructor(public lobbyService: LobbyService) {
  }

  ngOnInit(): void {
    console.log("LobbyComponent onInit()");
    this.subscribeLobby();
  }

  ngOnDestroy(): void {
    this.lobbySubscription.unsubscribe();
    console.log("LobbyComponent ngOnDestroy() lobbySubscription.unsubscribe()");
  }
  
  @Input() lobby: Lobby = Lobby();
  @Input() user: User = User();
  lobbySubscription!: Subscription;
  subscriptions = {
    "lobby": false,
  }

  subscribeLobby(): void {
    console.log("LobbyComponent subscribeLobby()");
    if (!this.subscriptions["lobby"]) {
      this.lobbySubscription = this.lobbyService.sharedLobby.subscribe(lobby => {
        console.log("LobbyComponent lobbyService.sharedLobby.subscribe");
        this.lobby = <Lobby>lobby;
      });
      this.subscriptions["lobby"] = true;
    }
  }
}
