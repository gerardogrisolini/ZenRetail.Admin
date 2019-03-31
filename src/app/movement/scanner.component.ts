import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit, Output, EventEmitter } from '@angular/core';
import { BarcodeDecoderService } from '../services/barcode-decoder.service';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
})
export class ScannerComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild('interactive') interactive;
  @Output() onPicked = new EventEmitter<string>();

  constructor(private decoderService: BarcodeDecoderService) {};

  ngOnInit() {
    this.decoderService.onLiveStreamInit();
    this.decoderService.onDecodeProcessed();
    this.decoderService.onDecodeDetected(this.onPicked);
  }

  ngAfterContentInit() {
    this.interactive.nativeElement.children[0].style.position = 'absolute';
  }

  ngOnDestroy() {
    this.decoderService.onDecodeStop();
  }
}
