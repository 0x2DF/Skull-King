import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../../../../services/game.service';

@Component({
  selector: 'game-playing-resolve-rascal',
  templateUrl: './rascal.component.html',
})
export class PlayingResolveRascalComponent implements OnInit {
  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  bonus: Array<Number> = [0,10,20];
  selected: Array<Boolean> = [false,false,false];

  accept(): void {
    let bonus = 0;
    this.selected.forEach( (s, i) => {
      if (s == true) {
        bonus == this.bonus[i];
        return;
      }
    });
    let data = { bonus : bonus }
    this.gameService.resolveTrick(data);
  }

  cancel(): void {
    this.gameService.resolveTrick(null);
  }

  updateSelectedBonus(bonus: Number)
  {
    this.bonus.forEach( (b, i) => {
      let btn = document.getElementById(`${b}_bonus_btn`);
      if (btn != null) {
        btn.className = "btn rounded-pill ";
        if (bonus == Number(b)){
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
