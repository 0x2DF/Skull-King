import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Error } from '../../../../models/error'

import { LobbyService } from '../../../../services/lobby.service';

@Component({
    selector: 'game-title-toast',
    templateUrl: './toast.component.html',
})
export class TitleToastComponent implements OnInit {
  constructor(
    private lobbyService: LobbyService
    ) {
      this.error = {name:""};
      this.subscribeError();
  }

  ngOnInit(): void { 
    console.log("TitleToastComponent ngOnInit()");
  }

  ngOnDestroy() {
    console.log("Game component ngOnDestroy()")
    this.errorSubscription.unsubscribe();
    console.log("GameComponent ngOnDestroy() lobbySubscription.unsubscribe")
  }

  position = 'top-end';
  visible = false;
  percentage = 0;
  error!: Error;
  errorSubscription!: Subscription;
  subscriptions = {
    "error": false,
  }


  subscribeError(): void {
    if (!this.subscriptions["error"]) {
      this.errorSubscription = this.lobbyService.sharedError.subscribe(
        error => {
          console.log("TitleToastComponent subscribeError() lobbyService.sharedError.subscribe");
          this.error = <Error>error;
          this.toggleToast();
        }
      );
      this.subscriptions["error"] = true;
    }
    console.log(this.errorSubscription);
  }

  toggleToast() {
    this.visible = !this.visible;
  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }
}
