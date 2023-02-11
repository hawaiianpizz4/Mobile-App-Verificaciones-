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
  public photosEsta: UserPhoto[] = [];
  public photosEsta64: string[] = [];

  public photosFact: UserPhoto[] = [];
  public photosFact64: string[] = [];

  public photosExte: UserPhoto[] = [];
  public photosExte64: string[] = [];

  public photosInter: UserPhoto[] = [];
  public photosInter64: string[] = [];

  public photosClienteDentro: UserPhoto[] = [];
  public photosClienteDentro64: string[] = [];

  public photosClienteFuera: UserPhoto[] = [];
  public photosClienteFuera64: string[] = [];

  public photosTitulo: UserPhoto[] = [];
  public photosTitulo64: string[] = [];

  public photosPredial: UserPhoto[] = [];
  public photosPredial64: string[] = [];

  public photosIngresos: UserPhoto[] = [];
  public photosIngresos64: string[] = [];

  public photosDom: UserPhoto[] = [];
  public photosDom64: string[] = [];

  public resetPhotos() {}

  public async addNewToGallery(photos: UserPhoto[], photos64: string[]) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const filePath = await this.readAsBase64(capturedPhoto.webPath);

    photos.unshift({
      filepath: filePath,
      webviewPath: capturedPhoto.webPath,
    });
    // console.log(filePath);
    photos64.unshift(filePath.split(',')[1]);
    return { photos: photos, photos64: photos64 };
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
