import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  // camera toggle
  showWebcam = true;
  // allowCameraSwitch = true;

  multipleWebcamsAvailable = false;

  videoOptions: MediaTrackConstraints = {
    // width: { ideal: 1024 },
    // height: { ideal: 576 }
  }

  errors: WebcamInitError[] = [];

  // latest snapshot
  webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  trigger: Subject<void> = new Subject<void>();



  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  triggerSnapshot() {
    this.trigger.next();
  }

  toggleWebcam() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push();
  }

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
  }


  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }



}
