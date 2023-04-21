import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth'

import * as config from '../../firebaseconfig.js'
import {Message} from "../Entities/Message";

@Injectable({
  providedIn: 'root'
})
export class FireService {

  firebaseApplication;
  firestore: firebase.firestore.Firestore;
  auth: firebase.auth.Auth;
  messages: any[] = [];

  constructor() {
    this.firebaseApplication = firebase.initializeApp(config.firebaseConfig);
    this.firestore = firebase.firestore();
    this.auth = firebase.auth();
  }

   sendMessage(sendThisMessage: any) : void {
    let messageDTO : Message = {
      messageContent: sendThisMessage,
      timestamp: new Date(),
      user: 'some user'
    }
    this.firestore
      .collection('myChat')
      .add(messageDTO)
  }

  async editMessage(sendThisMessage: any): Promise<Message[]> {
    const query = await this.firestore
      .collection('myChat').doc().update([{
          messageContent: sendThisMessage
        }]
      )
    return this.messages
  }

  async getMessage(): Promise<Message[]> {
    const query = await this.firestore
      .collection('myChat')
      .orderBy('timestamp')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if(change.type=="added"){
            this.messages.push({id: change.doc.id, data: change.doc.data()});
          } if (change.type=='modified') {
            const index : number = this.messages.findIndex(document => document.id != change.doc.id)
            this.messages[index] = {
              id: change.doc.id, data: change.doc.data()
            }
          } if(change.type=="removed") {
            this.messages = this.messages.filter(m => m.id != change.doc.id);
          }
        })
      });
    return this.messages;
  }

  async register(email: string, password: string){
    await this.auth.createUserWithEmailAndPassword(email, password);
  }

  async signIn(email: string, password: string){
    await this.auth.signInWithEmailAndPassword(email, password);
  }

  async signOut() {
    await this.auth.signOut();
  }
}
