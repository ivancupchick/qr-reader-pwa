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

  @ViewChild(QrScannerComponent, { static: true }) qrScannerComponent: QrScannerComponent ;
  @ViewChild('result', { static: true }) resultElement: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
    this.updateCameras();

    this.qrScannerComponent.capturedQr.subscribe(result => {
      this.appendMessageToPage(result); // routerLink to show account info or show error
    });
  }

  updateCameras(withoutReChoose = false, usePromise = false): Promise<void> {
    return (!usePromise ? this.getDevices() : this.qrScannerComponent.getMediaDevices())
      .then(devices => {
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
            if (dev.label.toLowerCase().includes('back') || dev.label.toLowerCase().includes('зад')) {
              this.backCamera = dev;
              this.appendMessageToPage('задняя');
              this.appendMessageToPage(dev.label);
              // choosenDev = dev;
              // break;
            }
            if (dev.label.toLowerCase().includes('front') || dev.label.toLowerCase().includes('перед')) {
              choosenDev = dev;
              this.frontCamera = dev;
              this.appendMessageToPage('передняя');
              this.appendMessageToPage(dev.label);
              break;
            }
          }
          if (choosenDev) {
            if (!withoutReChoose) {
              this.qrScannerComponent.chooseCamera.next(choosenDev);
            }

            this.factCameara = choosenDev;
          } else {
            if (!withoutReChoose) {
              this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
            }

            this.factCameara = videoDevices[0];
          }
        }
      });
  }

  getDevices(): Promise<MediaDeviceInfo[]> {
    let getUserMedia: (
      constraints: MediaStreamConstraints,
      successCallback: NavigatorUserMediaSuccessCallback,
      errorCallback: NavigatorUserMediaErrorCallback) => void;

    if (navigator.getUserMedia) {
      // this.isWebkit = true;
      getUserMedia =  navigator.getUserMedia;
    } else if ((navigator as any).webkitGetUserMedia) {
      // this.isWebkit = true;
      getUserMedia =  (navigator as any).webkitGetUserMedia;
    } else if ((navigator as any).mozGetUserMedia) {
      // this.isMoz = true;
      getUserMedia = (navigator as any).mozGetUserMedia;
    } else {
      getUserMedia = null;
    }

    if (getUserMedia) {
      return new Promise((resolve) => {
        const devices: MediaDeviceInfo[] = [];
        getUserMedia({ video: true, audio: false}, (res) => {
          res.getTracks().forEach(track => {
            const settings = track.getSettings();

            devices.push({
              label: track.label,
              deviceId: settings.deviceId,
              groupId: settings.groupId,
              kind: track.kind as MediaDeviceKind,
              toJSON: () => ''
            });

            this.appendMessageToPage(track.kind);
          });

          if (devices.length === 0) {
            return this.qrScannerComponent.getMediaDevices();
          }

          resolve(devices);
        }, (err) => {
          this.appendMessageToPage(err.message);
        });
      });
    } else {
      this.appendMessageToPage('navigator.getUserMedia = false');

      return this.qrScannerComponent.getMediaDevices();
    }
  }

  appendMessageToPage(text: string) {
    const resultItem: HTMLElement = this.renderer.createElement('span');
    resultItem.innerHTML = `${text}`;
    this.renderer.appendChild(this.resultElement.nativeElement, resultItem);
  }

  // showCamera() {
  //   this.isShowCamera = true;

  //   if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
  //     navigator.mediaDevices.enumerateDevices()
  //       .then(devices => {
  //         const videoDevices: MediaDeviceInfo[] = [];
  //         for (const device of devices) {
  //             if (device.kind.toString() === 'videoinput') {
  //                 videoDevices.push(device);
  //             }
  //         }
  //         if (videoDevices.length > 0) {
  //           for (const dev of videoDevices) {
  //             if (dev.label.toLowerCase().includes('back') || dev.label.toLowerCase().includes('зад')) {
  //               this.backCamera = dev;
  //               break;
  //             }
  //           }
  //         }
  //       })
  //       .then(() => {
  //         if (this.backCamera) {
  //           this.appendMessageToPage('задняя');
  //           this.appendMessageToPage(this.backCamera.label);
  //           this.qrScannerComponent.chooseCamera.next(this.backCamera);
  //         } else {
  //           this.appendMessageToPage('задняя не найдена');
  //         }
  //       });
  //   } else {
  //     this.appendMessageToPage('navigator.mediaDevices.enumerateDevices = false');
  //   }
  // }

  chooseCamera(cam: Event) {
    this.isShowCamera = true;
    if ((cam.target as any).value === 'front' && this.frontCamera) {
      this.qrScannerComponent.chooseCamera.next(this.frontCamera);
    } else if ((cam.target as any).value === 'back' && this.backCamera) {
      this.qrScannerComponent.chooseCamera.next(this.backCamera);
    } else if (this.factCameara) {
      this.qrScannerComponent.chooseCamera.next(this.factCameara);
    } else {
      this.updateCameras()
        .then(() => {
          if ((cam.target as any).value === 'front' && this.frontCamera) {
            this.qrScannerComponent.chooseCamera.next(this.frontCamera);
          } else if ((cam.target as any).value === 'back' && this.backCamera) {
            this.qrScannerComponent.chooseCamera.next(this.backCamera);
          } else if (this.factCameara) {
            this.qrScannerComponent.chooseCamera.next(this.factCameara);
          }
        });
      this.appendMessageToPage('Какой-то из камер нету');
    }

    this.updateCameras(true, true);
    console.log(cam);
  }
}
