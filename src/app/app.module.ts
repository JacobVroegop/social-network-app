import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import the library
import { NgUserManagementModule } from 'ng-usermanagement';

import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RegisterComponent } from './register/register.component';

const ngUsermanagmentConfig = {
  firebaseConfig: {
    apiKey: "AIzaSyBkyKrhQlDnMxXY1vkOzYvrMK4p5fwkhOQ",
    authDomain: "social-network-app-19f8a.firebaseapp.com",
    databaseURL: "https://social-network-app-19f8a.firebaseio.com",
    projectId: "social-network-app-19f8a",
    storageBucket: "social-network-app-19f8a.appspot.com",
    messagingSenderId: "532284872490",
    appId: "1:532284872490:web:9b8e3829fb5d74b569b053"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    MessageComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,

    AngularFirestoreModule,
    
    NgUserManagementModule.forRoot(ngUsermanagmentConfig),

  ],
  providers: [AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
