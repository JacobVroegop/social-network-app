import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { UserService } from 'ng-usermanagement';
import { UserModel } from 'ng-usermanagement/lib/models/user.model';

export class Message {
  post: string;
  date: Date;
  userEmail: string;
  userId: string;
  messageId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatMessagesService {
  private collectionChats: AngularFirestoreCollection = this.db.collection('chats')

  constructor(
    private db: AngularFirestore,
    private userService: UserService
  ) { }

  public createPost(chatId: string, post: string, user: UserModel): any {
    var docData = {
      userEmail: user.email,
      userId: user.uid,
      post: post,
      date: firebase.firestore.Timestamp.fromDate(new Date()),
    };
  
    return this.collectionChats.doc(chatId).collection('thread').add(docData).then(
      val => console.log(val)
    ).catch((err) => console.error(err));    
  }

  public getMessages(chatId: string): Observable<Message[]> {
    return this.collectionChats.doc(chatId).collection('thread').snapshotChanges().pipe(
      map(actions => {
        let messageList = [];
        actions.map(doc => {
          const data = doc.payload.doc.data() as Message;
          data.messageId = doc.payload.doc.id;
          data.date = doc.payload.doc.data().date.toDate()
          messageList.push(data as Message);
        })
        return messageList;
      })
    );
  }

  public removeMessage(chatId: string, messageId: string): Promise<void> {
    return this.collectionChats.doc(chatId).collection('thread').doc(messageId).delete();
  }
}
