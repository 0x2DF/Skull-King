import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../../../models/game';
import { User } from '../../../../models/user';


@Component({
    selector: 'game-playing',
    templateUrl: './playing.component.html',
})
export class PlayingComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
  @Input() game: Game = Game();
  @Input() user: User = User();
}
