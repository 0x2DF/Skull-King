import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../../../../services/game.service';

@Component({
  selector: 'game-playing-resolve-harry',
  templateUrl: './harry.component.html',
})
export class PlayingResolveHarryComponent implements OnInit {
  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
  }

  bets: Array<String> = ["-1","0","+1"];
  selected: Array<Boolean> = [false,false,false];

  betStringToNumber(bet: String): Number {
    if (bet === "-1") return -1;
    else if (bet === "+1") return 1;
    else return 0;
  }

  accept(): void {
    let bet = "0";
    this.selected.forEach( (s, i) => {
      if (s == true) {
        bet == this.bets[i];
        return;
      }
    });
    let data = { bid : this.betStringToNumber(bet) }
    this.gameService.resolveTrick(data);
  }

  cancel(): void {
    this.gameService.resolveTrick(null);
  }

  updateSelectedBet(bet: String)
  {
    this.bets.forEach( (b, i) => {
      let btn = document.getElementById(`${b}_bet_btn`);
      if (btn != null) {
        btn.className = "btn rounded-pill ";
        if (bet == String(b)){
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
