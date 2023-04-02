import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { Card } from '../../../../../../models/card';

import { GameService } from '../../../../../../services/game.service';

@Component({
    selector: 'game-playing-hand-tigress',
    templateUrl: './tigress.component.html',
})
export class PlayingHandTigressComponent implements OnInit {
  constructor() {
  }

  @Input() card: Card = Card();
  @Output() cardEvent = new EventEmitter<Card>();

  public visible = false;

  ngOnInit(): void { }
  ngOnDestroy(): void {}

  toggleTigressModal() { this.visible = !this.visible; }
  toggleTigressModalChange(event: any) { this.visible = event; }

  playTigress(playAsPirate: boolean) {
    this.card.type = (playAsPirate == true ? 'Pirate' : 'Wildcard');
    this.cardEvent.emit(this.card);
    this.toggleTigressModal();
  }
}
