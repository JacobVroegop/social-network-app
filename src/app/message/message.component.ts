import { Component, OnInit, Input } from '@angular/core';
import { Message, ChatMessagesService } from '../services/chat-messages.service';
import * as firebase from 'firebase'
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message: Message;
  @Input() chatId: string;

  public showDeleteButton: boolean = false;

  constructor(
    private CMService: ChatMessagesService
  ) { }

  ngOnInit() {
    this.checkIfCurrentUserIsAdmin();
  }

  public removeMessage() {
    this.CMService.removeMessage(this.chatId, this.message.messageId)
  }

  private checkIfCurrentUserIsAdmin() {
    firebase.auth().currentUser.getIdTokenResult()
      .then(idTokenResult => {
        if (!!idTokenResult.claims.admin) {
          // Show admin UI.
          this.showDeleteButton = true;
        } else {
          // Show regular user UI.
          this.showDeleteButton = false;
        }
      })
  }

}
