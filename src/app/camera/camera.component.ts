import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  patientId: string = null;

  cameraToggle = true;
  // allowCameraSwitch = true;
  multipleWebcamsAvailable = false;

  videoOptions: MediaTrackConstraints = {
    // width: { ideal: 1024 },
    // height: { ideal: 576 }

    // For mobile only, will give error in PC, comment out in PC
    facingMode: { exact: "environment" } // comment out in PC
  }

  // latest snapshot
  webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  trigger: Subject<void> = new Subject<void>();

  errors: WebcamInitError[] = [];
  postError = false;
  postSuccess = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  triggerSnapshot() {
    this.trigger.next();
    this.cameraToggle = false;
  }

  toggleWebcam() {
    this.cameraToggle = !this.cameraToggle;
  }

  handleInitError(error: WebcamInitError) {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError")
      console.warn("Camera access was not allowed by user!");

    this.errors.push(error);
  }

  handleImage(image: WebcamImage) {
    this.webcamImage = image;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  postImage() {
    this.postSuccess = this.postError = false;

    let presImg = new FormData();
    presImg.append('PatientId', this.patientId);
    presImg.append('ImageFile', this.webcamImage.imageAsBase64);

    this.http.post("https://localhost:44320/api/image", presImg)
      .subscribe({
        next: () => {
          this.postSuccess = true;
        },
        error: () => {
          this.postError = true;
        }
      });

    this.patientId = null;
  }


  tryAgain() {
    this.postSuccess = this.postError = null;

    this.webcamImage = null;
    this.cameraToggle = true;
  }

}
