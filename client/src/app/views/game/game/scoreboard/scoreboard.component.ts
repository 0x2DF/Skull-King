import { Component, OnInit, Input } from '@angular/core';

import { Game } from '../../../../models/game';
import { User } from '../../../../models/user';

@Component({
    selector: 'game-scoreboard',
    templateUrl: './scoreboard.component.html',
})
export class ScoreBoardComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
    this.game.players.sort((a, b) => { 
      return <number>b.score - <number>a.score;
    });
    this.stats[0] = { title: 'Leroy Jenkins', body: 'Most successful 0 bets'}
    this.stats[1] = { title: 'Big dick energy', body: 'Highest successful bidder'}
    this.stats[2] = { title: 'Cant touch me', body: 'Longest first place streak'}
    this.stats[3] = { title: 'Make it rain', body: 'Most points gained in a single round'}
    this.stats[4] = { title: 'Handicap coming through', body: 'Most points lost in a single round'}
    // biggest comeback
    // start with 0 -> end with 0 score
  }

  @Input() game: Game = Game();
  @Input() user: User = User();

  stats = new Array(5).fill({body: ''});

  getWinnerHandle(): string {
    return this.game.players[0].handle;
  }

}
