import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'game-playing-help',
  templateUrl: './help.component.html',
})
export class PlayingHelpComponent implements OnInit {
  constructor(
  ) {}

  ngOnInit(): void {
    this.initSlides();
  }

  public visible = false;
  slides: any[] = new Array(4).fill({id: -1, src: '', title: '', subtitle: ''});




  initSlides() {
    this.slides[0] = {
      src: './assets/img/help/hierarchy.png',
    };
    this.slides[1] = {
      src: './assets/img/help/bonus_points.png',
    }
    this.slides[2] = {
      src: './assets/img/help/pirates.png',
    }
    this.slides[3] = {
      src: './assets/img/help/advanced.png',
    }
  }

  toggleHelp() {
    this.visible = !this.visible;
  }

  handleHelpChange(event: any) {
    this.visible = event;
  }
}
