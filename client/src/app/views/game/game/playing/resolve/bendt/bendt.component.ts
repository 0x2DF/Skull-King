import { Component, OnInit, Input } from '@angular/core';
import { GameService } from '../../../../../../services/game.service';
import { Card } from '../../../../../../models/card';

@Component({
  selector: 'game-playing-resolve-bendt',
  templateUrl: './bendt.component.html',
})
export class PlayingResolveBendtComponent implements OnInit {
  constructor(
    private gameService: GameService
    ) { }

  ngOnInit(): void {
    this.hand.forEach((c, i) => {
      this.selected.set(c.id, false);
    });
  }

  ngOnDestroy() {}

  @Input() hand = <Card[]>([]);
  selected: Map<number, boolean> = new Map<number, boolean>();
  private MAX_SELECTED = 2;

  isSelected(card_id: number): boolean {
    let val = this.selected.get(card_id);
    if (val != undefined) {
      return val;
    };
    return false;
  }

  selectedCards(): number {
    let selected = 0;
    this.selected.forEach((s) => {
      selected += (s == true ? 1 : 0);
    });
    return selected;
  }

  toggleSelectCard(card: Card): void {
    let selected = this.selected.get(card.id);
    if (selected == true || this.selectedCards() < this.MAX_SELECTED) {
      this.selected.set(card.id, !selected);
    }
  }

  accept(): void {
    let cards = <Card[]>([]);
    this.hand.forEach((c, i) => {
      if (this.selected.get(c.id) == true) {
        cards.push(c);
      }
    });

    if (cards.length != this.MAX_SELECTED) {
      return;
    }

    let data = { cards : cards };
    this.gameService.resolveTrick(data);
  }

  cancel(): void {
    this.gameService.resolveTrick(null);
  }
}
