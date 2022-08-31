import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  // templateUrl: './camera2.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {
  patientId: string = null;
  imageBlobFile: Blob;

  cameraToggle = true;
  // allowCameraSwitch = true;
  multipleWebcamsAvailable = false;

  videoOptions: MediaTrackConstraints = {
    // width: { ideal: 1024 },
    // height: { ideal: 576 }

    // width: { ideal: 320 },
    // height: { ideal: 480 } 
    // width: { ideal: 640 }, // reverse for mobile
    // height: { ideal: 480 } 

    width: { ideal: 1280 }, // reverse for mobile
    height: { ideal: 960 }

    // For mobile only, will give error in PC, comment out in PC
    // facingMode: { exact: "environment" } // comment out for PC's webcam
  }

  // latest snapshot
  webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  trigger: Subject<void> = new Subject<void>();

  errors: WebcamInitError[] = [];
  postError = false;
  postSuccess = false;

  constructor(private http: HttpClient) { }

  // ngOnInit(): Promise<void> {
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

  // postImage() {
  //   this.postSuccess = this.postError = false;

  //   let presImg = new FormData();
  //   presImg.append('PatientId', this.patientId);
  //   presImg.append('ImageFile', this.webcamImage.imageAsBase64);

  //   this.http.post("https://localhost:44320/api/image", presImg)
  //     .subscribe({
  //       next: () => {
  //         this.postSuccess = true;
  //       },
  //       error: () => {
  //         this.postError = true;
  //       }
  //     });

  //   this.patientId = null;
  // }

  postImage2() {
    this.postSuccess = this.postError = false;

    this.base64DataToBlobFile();

    let prescriptionData = new FormData();
    prescriptionData.append('DoctorName', 'DoctorName');
    prescriptionData.append('ImageFile', this.imageBlobFile);

    this.http.post("https://localhost:44320/api/image", prescriptionData)
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

  base64DataToBlobFile() {
    let byteString = window.atob(this.webcamImage.imageAsBase64);
    let arrayBuffer = new ArrayBuffer(byteString.length);
    let int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    this.imageBlobFile = new Blob([int8Array], { type: 'image/png' });
    // console.log(blob);


  }

  downloadImage() {
    saveAs(this.imageBlobFile, "img.jpeg");
  }

  // streamSettings;

  // async getMyStreamSettings() {

  //   let stream = await navigator.mediaDevices.getUserMedia(this.constraint);
  //   this.streamSettings = stream.getVideoTracks()[0].getSettings().deviceId;
  //   // stream.getVideoTracks().forEach((cam) => {
  //   //   // this.streamSettings = cam.getSettings();
  //   //   this.streamSettings.push(cam.getSettings());
  //   // })


  //   // this.streamSettings = stream.getVideoTracks()[0].getSettings();
  //   // console.log(streamSettings);
  //   // let streamCapabilities = stream.getVideoTracks()[0].getCapabilities();
  //   // console.log(streamCapabilities);
  //   // let streamConstraints = stream.getVideoTracks()[0].getConstraints();
  //   // console.log(streamConstraints);
  // }
}
