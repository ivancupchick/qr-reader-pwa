import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.component.html',
  styleUrls: ['./qr-reader.component.sass']
})
export class QrReaderComponent implements OnInit {
  @ViewChild(QrScannerComponent, { static: true }) qrScannerComponent: QrScannerComponent ;
  @ViewChild('result', { static: true }) resultElement: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.qrScannerComponent.getMediaDevices().then(devices => {
      console.log(devices);
      const videoDevices: MediaDeviceInfo[] = [];
      for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
              videoDevices.push(device);
          }
      }
      if (videoDevices.length > 0) {
        let choosenDev;
        for (const dev of videoDevices) {
          if (dev.label.includes('front')) {
            choosenDev = dev;
            break;
          }
        }
        if (choosenDev) {
          this.qrScannerComponent.chooseCamera.next(choosenDev);
        } else {
          this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
        }
      }
    });

    this.qrScannerComponent.capturedQr.subscribe(result => {
      const resultItem: HTMLElement = this.renderer.createElement('span');
      resultItem.innerHTML = `${result}`;
      this.renderer.appendChild(this.resultElement.nativeElement, resultItem);
    });
  }
}
