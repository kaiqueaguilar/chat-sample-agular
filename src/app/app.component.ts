import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message, Text, User } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('chat') private chatComponent!: ElementRef;

  title = 'chat-angular';
  socket = new WebSocket('ws://localhost:3003');
  user!: User;
  text: string = '';
  messages: Message[] = [];

  constructor(private http: HttpClient,) {

  }

  sendMessage() {
    const message: Text = {
      text: this.text,
      user_id: this.user.id,
    }
    const encodedMessage = JSON.stringify(message)
    this.socket.send(encodedMessage)
    this.text = ''
  }

  getUser() {
    const name = () => window.prompt("Name") ?? "Clovis"
    const body = { name: name() }
    this.http.post<User>('http://localhost:3000/login', body).subscribe((user) => this.user = user);
  }

  async scrollToBottom() {
    try {
      this.chatComponent.nativeElement.scrollTop = (this.chatComponent.nativeElement.scrollHeight - 70);
    } catch (err) { }
  }

  ngOnInit(): void {
    this.getUser();
    this.socket.onmessage = (event) => {
      const decodedMessages: Message[] = JSON.parse(event.data)
      for (const message of decodedMessages) {
        this.messages.push(message)
      }
      this.scrollToBottom()
    }
  }


}