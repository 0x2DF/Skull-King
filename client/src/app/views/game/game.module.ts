// angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// coreui
import {
  AccordionModule,
  AlertModule,
  AvatarModule,
  BadgeModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  CarouselModule,
  FormModule,
  FooterModule,
  GridModule,
  ModalModule,
  NavModule,
  OffcanvasModule,
  ProgressModule,
  SharedModule,
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
import { PlayingDetailsTricksComponent } from './game/playing/details/tricks/tricks.component';
import { PlayingHandComponent } from './game/playing/hand/hand.component';
import { PlayingHandTigressComponent } from './game/playing/hand/tigress/tigress.component';
import { PlayingHelpComponent } from './game/playing/help/help.component';
import { PlayingPlayersComponent } from './game/playing/players/players.component';
import { PlayingResolveComponent } from './game/playing/resolve/resolve.component';
import { PlayingResolveBendtComponent } from './game/playing/resolve/bendt/bendt.component';
import { PlayingResolveHarryComponent } from './game/playing/resolve/harry/harry.component';
import { PlayingResolveJuanitaComponent } from './game/playing/resolve/juanita/juanita.component';
import { PlayingResolveRascalComponent } from './game/playing/resolve/rascal/rascal.component';
import { PlayingResolveRosieComponent } from './game/playing/resolve/rosie/rosie.component';
import { ScoreBoardComponent } from './game/scoreboard/scoreboard.component';
import { HandleComponent } from './handle/handle.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LobbyOptionsComponent } from './lobby/options/options.component';
import { LobbyPlayersComponent } from './lobby/players/players.component';
import { MessagesComponent } from './messages/messages.component';
import { RulesComponent } from './title/rules/rules.component';
import { TitleComponent } from './title/title.component';
import { ToastComponent } from './toast/toast.component';

import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  imports: [
    AccordionModule,
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
    FooterModule,
    GameRoutingModule,
    GridModule,
    IconModule,
    ModalModule,
    NavModule,
    OffcanvasModule,
    ProgressModule,
    ReactiveFormsModule,
    SharedModule,
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
    LobbyComponent,
    LobbyOptionsComponent,
    LobbyPlayersComponent,
    MessagesComponent,
    PlayingComponent,
    PlayingDetailsComponent,
    PlayingDetailsTricksComponent,
    PlayingHandComponent,
    PlayingHandTigressComponent,
    PlayingHelpComponent,
    PlayingPlayersComponent,
    PlayingResolveComponent,
    PlayingResolveBendtComponent,
    PlayingResolveHarryComponent,
    PlayingResolveJuanitaComponent,
    PlayingResolveRascalComponent,
    PlayingResolveRosieComponent,
    RulesComponent,
    ScoreBoardComponent,
    TitleComponent,
    ToastComponent
  ]
})
export class GameModule {
}
