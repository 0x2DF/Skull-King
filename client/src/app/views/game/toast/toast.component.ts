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
      this.error = Error();
  }

  ngOnInit(): void {
    this.subscribeError();
  }

  ngOnDestroy() {
    this.errorSubscription.unsubscribe();
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
          let prev_error = this.error;
          this.error = <Error>error;
          // Toggle toast when there is a new error.
          if (prev_error.name !== this.error.name) { this.toggleToast(); }
        }
      );
      this.subscriptions["error"] = true;
    }
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
