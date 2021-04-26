import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeerService } from '../services/peer.service';
import { SocketService } from '../services/socket.service';
@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss'],
})
export class ChatModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() partnerId: string;
  @ViewChild('videoUser') videoUser: ElementRef;
  @ViewChild('videoPartner') videoPartner: ElementRef;
  topVideoFrame = 'partner-video';
  userId: string;
  myEl: HTMLMediaElement;
  partnerEl: HTMLMediaElement;
  peer: any;
  constructor(
    private socketService: SocketService,
    private peerService: PeerService,
    private modalRef: MatDialogRef<ChatModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.init();
  }

  ngOnDestroy() {
    this.socketService.close(true);
  }

  init() {
    this.myEl = this.videoUser.nativeElement;
    this.partnerEl = this.videoPartner.nativeElement;
    this.peerService.init(this.data.userId, this.myEl, this.partnerEl);
  }

  call() {
    this.peerService.call(this.data.partnerId);
    this.swapVideo('my-video');
  }

  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }

  closeModal() {
    this.modalRef.close();
  }
}
