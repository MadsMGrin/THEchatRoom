import {Component, OnInit} from '@angular/core';
import {FireService} from "./fire.service";
import {Message} from "../Entities/Message";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  sendThisMessage: any;
  messageList: any;

  constructor(public fireService: FireService) {
  }

  async ngOnInit() {
    await this.getMessage();
    this.fireService.auth.onAuthStateChanged((user) => {
      if(user) {
        this.getMessage();
      }
    });
  }

  async getMessage(){
    this.messageList = await this.fireService.getMessage();
  }

  async sendMessage(sendThisMessage: any) {
    await this.fireService.sendMessage(sendThisMessage);
  }

  async editMessage(editThisMessage: any, id) {
    await this.fireService.editMessage(editThisMessage);
    console.log(editThisMessage);
    console.log(id);
  }
}
