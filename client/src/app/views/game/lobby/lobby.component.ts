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
    this.subscribeLobby();
  }

  ngOnDestroy(): void {
    this.lobbySubscription.unsubscribe();
  }
  
  @Input() lobby: Lobby = Lobby();
  @Input() user: User = User();
  lobbySubscription!: Subscription;
  subscriptions = {
    "lobby": false,
  }

  subscribeLobby(): void {
    if (!this.subscriptions["lobby"]) {
      this.lobbySubscription = this.lobbyService.sharedLobby.subscribe(lobby => {
        this.lobby = <Lobby>lobby;
      });
      this.subscriptions["lobby"] = true;
    }
  }
}
