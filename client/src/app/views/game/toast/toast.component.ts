import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Error } from '../../../models/error'

@Component({
    selector: 'game-toast',
    templateUrl: './toast.component.html',
})
export class ToastComponent implements OnInit {
  constructor(
    ) {
      // this.error = {name:""};
      console.log(this.service);
  }

  ngOnInit(): void { 
    console.log("ToastComponent ngOnInit()");
    this.subscribeError();
  }

  ngOnDestroy() {
    console.log("Toast component ngOnDestroy()")
    this.errorSubscription.unsubscribe();
    console.log("ToastComponent ngOnDestroy() lobbySubscription.unsubscribe")
  }

  @Input() service: any;

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
      this.errorSubscription = this.service.sharedError.subscribe(
        (error: Error) => {
          console.log("ToastComponent subscribeError() lobbyService.sharedError.subscribe");
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
