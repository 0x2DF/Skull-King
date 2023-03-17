import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Lobby } from '../../../models/lobby';
import { LobbyService } from '../../../services/lobby.service';

@Component({
  selector: 'game-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public lobbyService: LobbyService,
  ) {}

  ngOnInit(): void {
    this.lobbyService.reset();
    this.subscribeLobby();
    this.setColor();
  }

  ngOnDestroy() {
    this.lobbySubscription.unsubscribe();
  }

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

  lobby: Lobby = Lobby();
  lobbySubscription!: Subscription;
  subscriptions = {
    "lobby": false,
  }
  
  setColor() {
    this.borderColor = this.colors[Math.floor(Math.random()*this.colors.length)].color;
  }

  subscribeLobby(): void {
    if (!this.subscriptions["lobby"]) {
      this.lobbySubscription = this.lobbyService.sharedLobby.subscribe(lobby => {
        this.lobby = <Lobby>lobby;
        this.redirectToLobby();
      });
      this.subscriptions["lobby"] = true;
    }
  }

  redirectToLobby(): void {
    if (this.lobby.code != "") {
      const url = `${this.lobby.code}`;
      this.router.navigate([`${url}`], { relativeTo: this.route });
    }
  }

  createLobby(): void {
    this.lobbyService.createLobby();
  }

  findLobby(code: string): void {
    code = code.trim();
    if (!code) { return; }
    let temp_lobby: Lobby = { code: code, clients: [], state: "", admin: "" }
    this.lobbyService.findLobby(temp_lobby);
  }

}
