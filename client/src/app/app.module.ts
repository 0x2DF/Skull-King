import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TitleComponent } from './title/title.component';
import { NameComponent } from './name/name.component';
import { LobbyPlayersComponent } from './lobby-players/lobby-players.component';
import { LobbyOptionsComponent } from './lobby-options/lobby-options.component';
import { TimerComponent } from './timer/timer.component';
import { DeckComponent } from './deck/deck.component';
import { GameDetailsComponent } from './game-details/game-details.component';
import { GamePlayersComponent } from './game-players/game-players.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { BetboardComponent } from './betboard/betboard.component';
import { MessagesComponent } from './messages/messages.component';
import { RoundDetailsComponent } from './round-details/round-details.component';
import { SocketService } from './socket.service';
import { GameComponent } from './game/game.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HandComponent } from './hand/hand.component';

import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    NameComponent,
    LobbyPlayersComponent,
    LobbyOptionsComponent,
    TimerComponent,
    DeckComponent,
    GameDetailsComponent,
    GamePlayersComponent,
    ScoreboardComponent,
    BetboardComponent,
    MessagesComponent,
    RoundDetailsComponent,
    GameComponent,
    PageNotFoundComponent,
    HandComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    AppHeaderModule,
    HttpClientModule,
    TabsModule.forRoot()
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
