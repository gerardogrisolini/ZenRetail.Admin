import { Injectable, EventEmitter } from '@angular/core';
import { DECODER_LIVE_CONFIG } from '../config/decoder-config';
import * as Quagga from 'Quagga';

@Injectable()
export class BarcodeDecoderService {
  static lastResult = '';
  sound = new Audio('assets/barcode.wav');

  constructor() {}

  private setLiveStreamConfig() {
    DECODER_LIVE_CONFIG.inputStream = {
      type: 'LiveStream',
      constraints: {
        width: { min: 320 },
        height: { min: 240 },
        facingMode: 'environment',
        aspectRatio: {
          min: 1,
          max: 2,
        },
      },
    };
    return DECODER_LIVE_CONFIG;
  }

  onLiveStreamInit() {
    const state = this.setLiveStreamConfig();
    Quagga.init(state, (err) => {
      if (err) {
        return console.error(err);
      }
      Quagga.start();
    });
  }

  onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay, drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        const w = parseInt(drawingCanvas.getAttribute('width'), null);
        const h = parseInt(drawingCanvas.getAttribute('height'), null);
        drawingCtx.clearRect(0, 0, w, h);
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
          Quagga.ImageDebug.drawPath(box, {
            x: 0,
            y: 1,
          }, drawingCtx, {
            color: 'green',
            lineWidth: 2,
          });
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, {
          x: 0,
          y: 1,
        }, drawingCtx, {
          color: '#00F',
          lineWidth: 2,
        });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(result.line, {
          x: 'x',
          y: 'y',
        }, drawingCtx, {
          color: 'red',
          lineWidth: 3,
        });
      }
    }
  }

  onDecodeProcessed() {
    Quagga.onProcessed(this.onProcessed);
  }

  onDecodeDetected(emitter: EventEmitter<string>) {
    Quagga.onDetected(result => {
      if (!result || typeof result.codeResult === 'undefined' || BarcodeDecoderService.lastResult !== '') {
        // console.log(BarcodeDecoderService.lastResult);
        return;
      }
      BarcodeDecoderService.lastResult = result.codeResult.code;
      // console.log('decode: ' + JSON.stringify(result));
      emitter.emit(result.codeResult.code);
      this.onPlaySound();

      setTimeout(function () {
        BarcodeDecoderService.lastResult = '';
      }, 3000);
    });
  }

  onDecodeStop() {
    Quagga.stop();
    console.log('Camera Stopped Working!');
  }

  onPlaySound() {
    this.sound.play();
  }
}
