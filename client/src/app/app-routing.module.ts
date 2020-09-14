import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TitleComponent } from './title/title.component';
import { NameComponent } from './name/name.component';
import { GameComponent } from './game/game.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  // { path: '', redirectTo: '/title', pathMatch: 'full' },
  // { path: 'title', component: TitleComponent },
  { path: '', component: TitleComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: ':code', component: GameComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}