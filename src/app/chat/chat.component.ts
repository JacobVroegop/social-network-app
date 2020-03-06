import { Component, OnInit } from '@angular/core';
import { UserService, AuthenticationService } from 'ng-usermanagement';
import { UserModel } from 'ng-usermanagement/lib/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatMessagesService, Message } from '../services/chat-messages.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public currentMessage$: Observable<Message[]>;
  public user$: Observable<UserModel>;
  private curUser: UserModel;
  public curChatId: string = '1';

  constructor(
    private CMService: ChatMessagesService,
    private userService: UserService,
    private authService: AuthenticationService,
    private router: Router
  ) {
   }

  ngOnInit() {
    this.currentMessage$ = this.CMService.getMessages("1");
    this.user$ = this.userService.user$.pipe(
      map(user => this.curUser = user)
    );
  }

  addPost(post: string) {
    this.CMService.createPost("1", post, this.curUser);
  }
  
  public signOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }


}
