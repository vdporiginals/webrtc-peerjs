import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatModalComponent } from './chat-modal/chat-modal.component';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'webrtc';
  uid: string;
  partnerId: string;
  constructor(private modal: MatDialog, private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.connect();
    this.socketService.messages$.subscribe((res) => {
      console.log(res);
      this.openModal();
    });
  }

  openModal() {
    this.modal.open(ChatModalComponent, {
      width: '100%',
      height: '100%',
      data: {
        partnerId: this.partnerId,
        userId: this.uid,
      },
    });
  }
}
