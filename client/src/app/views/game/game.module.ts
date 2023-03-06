// angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// coreui
import {
  AlertModule,
  AvatarModule,
  BadgeModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  FormModule,
  GridModule,
  ModalModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule,
  ToastModule,
  UtilitiesModule
} from '@coreui/angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { IconModule } from '@coreui/icons-angular';

// Game
import { GameRoutingModule } from './game-routing.module';

import { GameComponent } from './game/game.component';
import { BettingBetboardComponent } from './game/betting/betboard/betboard.component';
import { BettingComponent } from './game/betting/betting.component';
import { BettingHandComponent } from './game/betting/hand/hand.component';
import { PlayingComponent } from './game/playing/playing.component';
import { PlayingDetailsComponent } from './game/playing/details/details.component';
import { PlayingHandComponent } from './game/playing/hand/hand.component';
import { PlayingHelpComponent } from './game/playing/help/help.component';
import { PlayingPlayersComponent } from './game/playing/players/players.component';
import { ScoreBoardComponent } from './game/scoreboard/scoreboard.component';
import { HandleComponent } from './handle/handle.component';
import { HandleToastComponent } from './handle/toast/toast.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LobbyOptionsComponent } from './lobby/options/options.component';
import { LobbyPlayersComponent } from './lobby/players/players.component';
import { MessagesComponent } from './messages/messages.component';
import { RulesComponent } from './title/rules/rules.component';
import { TitleComponent } from './title/title.component';
import { TitleToastComponent } from './title/toast/toast.component';

import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  imports: [
    AlertModule,
    AvatarModule,
    BadgeModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    ChartjsModule,
    CommonModule,
    FormModule,
    FormsModule,
    GameRoutingModule,
    GridModule,
    IconModule,
    ModalModule,
    NavModule,
    ProgressModule,
    ReactiveFormsModule,
    TableModule,
    TabsModule,
    ToastModule,
    UtilitiesModule,
    WidgetsModule,
  ],
  declarations: [
    BettingBetboardComponent,
    BettingComponent,
    BettingHandComponent,
    GameComponent,
    HandleComponent,
    HandleToastComponent,
    LobbyComponent,
    LobbyOptionsComponent,
    LobbyPlayersComponent,
    MessagesComponent,
    PlayingComponent,
    PlayingDetailsComponent,
    PlayingHandComponent,
    PlayingHelpComponent,
    PlayingPlayersComponent,
    RulesComponent,
    ScoreBoardComponent,
    TitleComponent,
    TitleToastComponent
  ]
})
export class GameModule {
}
