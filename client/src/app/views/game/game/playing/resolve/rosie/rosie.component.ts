import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../../../../../../services/game.service';
import { Game } from '../../../../../../models/game';

@Component({
  selector: 'game-playing-resolve-rosie',
  templateUrl: './rosie.component.html',
})
export class PlayingResolveRosieComponent implements OnInit {
  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {
    this.selected = Array.from(Array(this.game.players.length),(x)=>false);
  }

  ngOnDestroy() {
  }

  @Input() game: Game = Game();
  selected: Array<Boolean> = [];

  accept(): void {
    let player_idx = 0;
    this.selected.forEach( (s, i) => {
      if (s == true) {
        player_idx = i;
        return;
      }
    });
    let data = { pid : player_idx }
    this.gameService.resolveTrick(data);
  }

  cancel(): void {
    this.gameService.resolveTrick(null);
  }

  updateSelectedPlayer(handle: String)
  {
    this.game.players.forEach( (player, i) => {
      let btn = document.getElementById(`${i}_btn`);
      if (btn != null) {
        btn.className = "btn rounded-pill ";
        if (handle == player.handle){
          btn.className += "btn-warning active";
          this.selected[i] = true;
        } else {
          btn.className += "btn-light active";
          this.selected[i] = false;
        }
      }
    });
  }
}
