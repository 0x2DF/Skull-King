import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Error } from '../../../../models/error'

import { LobbyService } from '../../../../services/lobby.service';

@Component({
    selector: 'game-handle-toast',
    templateUrl: './toast.component.html',
})
export class HandleToastComponent implements OnInit {

  constructor(
    private lobbyService: LobbyService
    ) {
      this.error = {name:""};
  }

  ngOnInit(): void {
    console.log("HandleToastComponent ngOnInit()");
    this.subscribeError();
  }

  position = 'top-end';
  visible = false;
  percentage = 0;
  error!: Error;
  errorSubscription!: Subscription;

  subscribeError(): void {
    console.log("Hello?");
    this.errorSubscription = this.lobbyService.sharedError.subscribe(
      error => {
        console.log("HandleToastComponent subscribeError() lobbyService.sharedError.subscribe");
        this.error = <Error>error;
        this.toggleToast();
      }
    );
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
