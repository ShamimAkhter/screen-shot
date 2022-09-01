import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent implements OnInit {

  url = "https://localhost:44320/"; // When using IIS 
  // url = "https://192.168.1.38:5001/";  // When using dotnet run

  // patientId: string = null;
  doctorName: string = "Dr. ABCD";
  imageBlobFile: Blob;

  windowWidth;
  windowHeight;

  cameraToggle = true;
  // allowCameraSwitch = true;
  multipleWebcamsAvailable = false;

  videoOptions: MediaTrackConstraints = {

    // width: { ideal: 3264 }, // reverse for mobile
    // height: { ideal: 2448 } // 8 Megapixels

    width: { ideal: 1156 }, // reverse for mobile
    height: { ideal: 864 }  // 1 Megapixels

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

    this.windowWidth = document.documentElement.clientWidth;
    this.windowHeight = document.documentElement.clientHeight;
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

    this.base64DataToBlobFile();

    let prescriptionData = new FormData();
    prescriptionData.append('DoctorName', this.doctorName);
    prescriptionData.append('ImageFile', this.imageBlobFile);

    this.http.post(this.url + "api/image", prescriptionData)
      .subscribe({
        next: () => {
          this.postSuccess = true;
        },
        error: () => {
          this.postError = true;
        }
      });

    // this.doctorName = null;
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
    this.base64DataToBlobFile();

    saveAs(this.imageBlobFile, "img.jpeg");
  }
}
