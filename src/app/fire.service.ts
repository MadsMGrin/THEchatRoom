import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import * as config from '../../firebaseconfig.js'

@Injectable({
  providedIn: 'root'
})
export class FireService {

  firebaseApplication;
  firestore: firebase.firestore.Firestore;
  messages: any[] = [];

  constructor() {
    this.firebaseApplication = firebase.initializeApp(config.firebaseConfig);
    this.firestore = firebase.firestore();
    this.getMessage();
  }

  sendMessage(sendThisMessage: any) : void {
    let messageDTO : MessageDTO = {
      messageContent: sendThisMessage,
      timestamp: new Date(),
      user: 'some user'
    }
    this.firestore
      .collection('myChat')
      .add(messageDTO)
  }

  async getMessage(): Promise<void> {
    const query = await this.firestore
      .collection('myChat')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type=="added"){
            this.messages.push(change.doc.data());
          }
        })
      });

  }

}

export interface MessageDTO {
  messageContent : string;
  timestamp : Date;
  user : string;
}
