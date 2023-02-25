import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { User } from '../../../models/user';

@Component({
  selector: 'game-messages',
  templateUrl: './messages.component.html',
})
export class MessagesComponent implements OnInit {
  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    //this.messageService.listenForMessages();
  }

  @Input() user: User = {handle:""};
  message!: string;


  SendMessage()
  {
    //event.preventDefault();
    this.messageService.SendMessage(this.message, this.user);
    this.message = '';
  }

}
