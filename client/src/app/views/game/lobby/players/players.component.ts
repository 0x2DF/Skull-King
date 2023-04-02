import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { Lobby } from '../../../../models/lobby';
import { User } from '../../../../models/user';
import { LobbyService } from '../../../../services/lobby.service';

@Component({
    selector: 'game-lobby-players',
    templateUrl: './players.component.html',
})
export class LobbyPlayersComponent implements OnInit, OnDestroy {
  constructor(private lobbyService: LobbyService) {
  }

  ngOnInit(): void {
    this.subscribeLobby();
    this.refreshLobby();
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
        this.refreshLobby();
      });
      this.subscriptions["lobby"] = true;
    }
  }

  refreshLobby(): void {
    let user_list = document.getElementById('user-list');
    if (user_list) { user_list.innerHTML = ''; }
    
    this.lobby.clients.forEach((u, i) => {
      const tr = document.createElement('tr');
      const td_handle = document.createElement('td');
      const badge = document.createElement('c-badge');
      const span = document.createElement('span');
      span.innerHTML = " " + u;
      tr.className = (this.user.handle == u) ? 'table-success' : '';

      if (this.lobby) {
        if (this.lobby.clients[i] == this.lobby.admin){
          badge.className = "me-1 badge bg-primary";
          badge.innerHTML = "Admin";
        }
      }
      td_handle.appendChild(badge);
      td_handle.appendChild(span);
      tr.append(td_handle);

      if (user_list) { user_list.appendChild(tr); }
    });

    let start_btn = document.getElementById('start-lobby-btn');
    if (this.user.handle == this.lobby.admin) {
      if (start_btn) { start_btn.style.visibility = "visible"; }
    } else {
      if (start_btn) { start_btn.style.visibility = "hidden"; }
    }
  }

  StartLobby(){
    if (this.lobbyService) this.lobbyService.startLobby();
  }
}
