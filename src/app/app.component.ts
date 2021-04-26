import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatModalComponent } from './chat-modal/chat-modal.component';
import { LocalStorageService } from './services/localstorage.service';
import { SocketService } from './services/socket.service';
import * as uuid from 'uuid';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'webrtc';
  uid: string;
  partnerId: string;
  token = this.storage.getToken();
  constructor(
    private modal: MatDialog,
    private socketService: SocketService,
    private storage: LocalStorageService
  ) {}

  ngOnInit() {
    console.log(this.token);

    this.uid = this.token.ProviderId;
    this.socketService.connect();
    this.socketService.messages$.subscribe((res) => {
      console.log(res);
      try {
        let result = JSON.parse(res);
        this.partnerId = result.peerId;
        return this.openModal();
      } catch (e) {
        return console.log(e);
      } finally {
        this.partnerId = res.peerId;
        return this.openModal();
      }
    });
  }

  openModal(type?) {
    const myId = uuid.v4();
    this.modal.open(ChatModalComponent, {
      width: '100%',
      height: '100%',
      data: {
        partnerId: this.partnerId,
        userId: myId,
      },
    });
    if (type == 'abc') {
      this.socketService.sendMessage({
        action: 'callRequest',
        recipientUserProfileId: 7,
        createdOn: '2021-04-26 07:59:26.290',
        peerId: myId,
        type: 1,
      });
    }
    this.modal.afterOpened.subscribe(() => {});
  }
}
