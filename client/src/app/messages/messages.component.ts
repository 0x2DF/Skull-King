import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  message: string;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.listenForMessages();
  }

  SendMessage()
  {
    event.preventDefault();
    this.messageService.SendMessage(this.message);
    this.message = '';
  }

}
