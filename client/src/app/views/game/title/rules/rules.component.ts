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
    this.initSlides();
  }

  public visible = false;
  slides: any[] = new Array(4).fill({id: -1, src: '', title: '', subtitle: ''});

  initSlides() {
    this.slides[0] = {
      src: './assets/img/rules/Scan10010.jpg',
    };
    this.slides[1] = {
      src: './assets/img/rules/Scan10011.jpg',
    };
    this.slides[2] = {
      src: './assets/img/rules/Scan10012.jpg',
    };
    this.slides[3] = {
      src: './assets/img/rules/Scan10013.jpg',
    };
    this.slides[4] = {
      src: './assets/img/rules/Scan10014.jpg',
    };
    this.slides[5] = {
      src: './assets/img/rules/Scan10015.jpg',
    };
    this.slides[6] = {
      src: './assets/img/rules/Scan10016.jpg',
    };
    this.slides[7] = {
      src: './assets/img/rules/Scan10017.jpg',
    };
    this.slides[8] = {
      src: './assets/img/rules/Scan10018.jpg',
    };
    this.slides[9] = {
      src: './assets/img/rules/Scan10019.jpg',
    };
    this.slides[10] = {
      src: './assets/img/rules/Scan10020.jpg',
    };
    this.slides[11] = {
      src: './assets/img/rules/Scan10021.jpg',
    };
  }

  toggleRules() {
    this.visible = !this.visible;
  }

  handleRulesChange(event: any) {
    this.visible = event;
  }
}
