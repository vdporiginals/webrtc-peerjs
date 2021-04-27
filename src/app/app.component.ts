import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatModalComponent } from './chat-modal/chat-modal.component';
import { LocalStorageService } from './services/localstorage.service';
import { SocketService } from './services/socket.service';
import * as uuid from 'uuid';
import { PeerService } from './services/peer.service';
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
  selectedUser = 17;
  constructor(
    private modal: MatDialog,
    private peerService: PeerService,
    private socketService: SocketService,
    private storage: LocalStorageService
  ) {}

  ngOnInit() {
    console.log(this.token);

    this.uid = this.token.ProviderId;
    this.socketService.connect();
    this.socketService.messages$.subscribe((res) => {
      try {
        let result = JSON.parse(res);
        console.log(result);
        this.partnerId = result.peerId;
        if (result.action == 'videoCallDisconnect') {
          this.modal.closeAll();
          return this.peerService.disconnect();
        }

        if (this.partnerId) return this.openModal();
      } catch (e) {
        return console.log(e);
      } finally {
        this.partnerId = res.peerId;
        if (res.action == 'videoCallDisconnect') {
          this.modal.closeAll();
          return this.peerService.disconnect();
        }

        if (this.partnerId) return this.openModal();
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
        recipientUserProfileId: this.selectedUser,
        createdOn: new Date().toISOString(),
        peerId: myId,
        type: 1,
      });
    }
    this.modal.afterOpened.subscribe(() => {});
  }
}
