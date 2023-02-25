import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from './game/game.component';
import { TitleComponent } from './title/title.component';

const routes: Routes = [
  {
    path: '',
    component: TitleComponent,
    data: {
      title: $localize`Skull King`
    },
  },
  { path: ':code', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {
}
