import { Injectable } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor() {}
  public photos: UserPhoto[] = [];
  public photosBase64: string[] = [];
  public photosBlob: Blob[] = [];

  public resetPhotos() {
    this.photos = []; //
    this.photosBase64 = []; //
    this.photosBlob = []; //
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const filePath = await this.readAsBase64(capturedPhoto.webPath);

    this.photos.unshift({
      filepath: filePath,
      webviewPath: capturedPhoto.webPath,
    });
    console.log(filePath);
    this.photosBase64.unshift(filePath.split(',')[1]);

    const response = await fetch(capturedPhoto.webPath);
    const blob = new Blob([await response.arrayBuffer()], {
      type: 'image/png',
    });
    this.photosBlob.unshift(blob);
  }

  private async readAsBase64(webviewPath: string) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(webviewPath);
    const blob = await response.blob();

    return (await this.convertBlobToBase64(blob)) as string;
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
