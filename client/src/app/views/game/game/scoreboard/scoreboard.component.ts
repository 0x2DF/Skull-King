import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../../../models/game';
import { User } from '../../../../models/user';

@Component({
    selector: 'game-scoreboard',
    templateUrl: './scoreboard.component.html',
})
export class ScoreBoardComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  @Input() game: Game = Game();
  @Input() user: User = User();
}
