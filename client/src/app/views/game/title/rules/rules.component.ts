import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'game-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
  constructor(
  ) {}

  ngOnInit(): void {
  }

  public rulesVisible = false;


  toggleRules() {
    this.rulesVisible = !this.rulesVisible;
  }

  handleRulesChange(event: boolean) {
    this.rulesVisible = event;
  }
}
