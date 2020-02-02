import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { QrScannerComponent } from 'angular2-qrscanner';

@Component({
  selector: 'app-qr-reader',
  templateUrl: './qr-reader.component.html',
  styleUrls: ['./qr-reader.component.sass']
})
export class QrReaderComponent implements OnInit {
  isShowCamera = true;

  backCamera;
  frontCamera;
  factCameara;

  selectValue;

  devices = [
    { value: 'none', label: 'Выберите каамеру' }
  ];

  /*
  for test on mobile:

  start serve with command
  ng s --host 0.0.0.0 --disable-host-check

  and another command window:
  ssh -R 80:0.0.0.0:4200 ssh.localhost.run
  */

  @ViewChild(QrScannerComponent, { static: true }) qrScannerComponent: QrScannerComponent ;
  @ViewChild('result', { static: true }) resultElement: ElementRef;
  @ViewChild('videoWrapper2', { static: true }) videoWrapper: ElementRef;
  @ViewChild('selecting', { static: true }) selecting: ElementRef;

  constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

  ngOnInit() {
    this.getStream().then(this.getDevices).then(this.gotDevices);
  }

  getDevices() {
    return navigator.mediaDevices.enumerateDevices();
  }

  gotDevices = (deviceInfos) => {
    (window as any).deviceInfos = deviceInfos; // may not need, realy, i have tested it
    for (const deviceInfo of deviceInfos) {
      if (deviceInfo.kind === 'videoinput') {
        this.devices.push({
          value: deviceInfo.deviceId,
          label: deviceInfo.label
        });
      }
    }
  }

  getStream = () => {
    if ((window as any).stream) {
      (window as any).stream.getTracks().forEach(track => {
        track.stop();
      });
    }

    const videoSource = this.selecting.nativeElement.value;

    if (videoSource === 'none') {
      // hide videoWrapper
      return;
    }

    const constraints = {
      audio: false,
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    return navigator.mediaDevices.getUserMedia(constraints).
      then(this.gotStream).catch(this.handleError);
  }

  gotStream = (stream: MediaStream) => {
    (window as any).stream = stream; // may not need
    this.selecting.nativeElement.selectedIndex = [...this.selecting.nativeElement.options].
      findIndex(option => option.text === stream.getVideoTracks()[0].label); // may not need
    this.videoWrapper.nativeElement.srcObject = stream;
  }

  handleError(error) {
    console.error('Error: ', error);
  }
}
