import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit {
  sendThisMessage: any;
  messageList: any;

  constructor(public fireService: FireService) {
    this.fireService.auth.onAuthStateChanged((user) => {
      if (user) {
        if (!this.messageList) {
          this.getMessage();
        }
      }
    });
  }

  async ngOnInit() {

  }

  async getMessage() {
    this.messageList = await this.fireService.getMessage();
    this.messageList.forEach((message) => {
      message.originalContent = message.data.messageContent;
    });
  }

  async sendMessage(sendThisMessage: any) {
    await this.fireService.sendMessage(sendThisMessage);
  }

  async editMessage(messages: any) {
    const currentUser = this.fireService.auth.currentUser;
    if (!currentUser || messages.data.user !== currentUser.uid) {
      console.log('Not allowed to edit this message');
      return;
    }
    if (messages.editMode) {
      await this.fireService.editMessage(messages.id, messages.data.messageContent);
      messages.editMode = false;
    } else {
      messages.originalContent = messages.data.messageContent;
      messages.editMode = true;
    }
  }

  cancelEditing(messages: any) {
    messages.data.messageContent = messages.originalContent;
    messages.editMode = false;
  }

  async deleteMessage(id: string) {
    const currentUser = this.fireService.auth.currentUser;
    const message = this.messageList.find(m => m.id === id);
    if (!currentUser || message.data.user !== currentUser.uid) {
      console.log('Not allowed to delete this message');
      return;
    }
    await this.fireService.deleteMessage(id);
    this.messageList = this.messageList.filter(m => m.id !== id);
  }

  async signOut() {
    await this.fireService.signOut();
  }
}
