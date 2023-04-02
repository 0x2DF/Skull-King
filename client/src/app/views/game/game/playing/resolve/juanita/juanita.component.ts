import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../../../../../../services/game.service';
import { Card } from '../../../../../../models/card';

@Component({
  selector: 'game-playing-resolve-juanita',
  templateUrl: './juanita.component.html',
})
export class PlayingResolveJuanitaComponent implements OnInit {
  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void { }

  ngOnDestroy() { }
  
  @Input() data: any = <Card[]>([]);

  accept(): void {
    this.gameService.resolveTrick(null);
  }

  cancel(): void {
    this.gameService.resolveTrick(null);
  }
}
