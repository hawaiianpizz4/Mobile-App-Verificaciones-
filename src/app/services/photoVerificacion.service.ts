import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor() {}
  public photosPlanilla: UserPhoto[] = [];
  public photosPlanilla64: string[] = [];

  public photosEstabilidad: UserPhoto[] = [];
  public photosEstabilidad64: string[] = [];

  public photosFacturas: UserPhoto[] = [];
  public photosFacturas64: string[] = [];

  public photosExterior: UserPhoto[] = [];
  public photosExterior64: string[] = [];

  public photosInterior: UserPhoto[] = [];
  public photosInterior64: string[] = [];

  public photosClienteExterior: UserPhoto[] = [];
  public photosClienteExterior64: string[] = [];

  public photosClienteInterior: UserPhoto[] = [];
  public photosClienteInterior64: string[] = [];

  public photosTitulo: UserPhoto[] = [];
  public photosTitulo64: string[] = [];

  public photosImpuesto: UserPhoto[] = [];
  public photosImpuesto64: string[] = [];

  public photosRespaldo: UserPhoto[] = [];
  public photosRespaldo64: string[] = [];

  public photosCertificado: UserPhoto[] = [];
  public photosCertificado64: string[] = [];

  public photosInteriorDom: UserPhoto[] = [];
  public photosInteriorDom64: string[] = [];

  public async addNewToGallery(tipo: string) {
    switch (tipo) {
      case 'planilla':
        this.addPhotos(this.photosPlanilla, this.photosPlanilla64);
        break;
      case 'estabilidad':
        this.addPhotos(this.photosEstabilidad, this.photosEstabilidad64);
        break;
      case 'facturas':
        this.addPhotos(this.photosFacturas, this.photosFacturas64);
        break;
      case 'exterior':
        this.addPhotos(this.photosExterior, this.photosExterior64);
        break;
      case 'interior':
        this.addPhotos(this.photosInterior, this.photosInterior64);
        break;
      case 'clienteExterior':
        this.addPhotos(this.photosClienteExterior, this.photosClienteExterior64);
        break;
      case 'clienteInterior':
        this.addPhotos(this.photosClienteInterior, this.photosClienteInterior64);
        break;
      case 'titulo':
        this.addPhotos(this.photosTitulo, this.photosTitulo64);
        break;
      case 'impuesto':
        this.addPhotos(this.photosImpuesto, this.photosImpuesto64);
        break;
      case 'respaldo':
        this.addPhotos(this.photosRespaldo, this.photosRespaldo64);
        break;
      case 'certificado':
        this.addPhotos(this.photosCertificado, this.photosCertificado64);
        break;
      case 'interiorDom':
        this.addPhotos(this.photosInteriorDom, this.photosInteriorDom64);
        break;
    }
  }

  public async addPhotos(photos: UserPhoto[], photosBase64: string[]) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 30,
    });

    const filePath = await this.readAsBase64(capturedPhoto.webPath);
    photos.pop();
    photos.unshift({
      filepath: filePath,
      webviewPath: capturedPhoto.webPath,
    });
    console.log(filePath);
    photosBase64.pop();
    photosBase64.unshift(filePath.split(',')[1]);

    const response = await fetch(capturedPhoto.webPath);
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

  public limpiarImagenes() {
    this.photosPlanilla = [];
    this.photosPlanilla64 = [];

    this.photosEstabilidad = [];
    this.photosEstabilidad64 = [];

    this.photosFacturas = [];
    this.photosFacturas64 = [];

    this.photosExterior = [];
    this.photosExterior64 = [];

    this.photosInterior = [];
    this.photosInterior64 = [];

    this.photosClienteExterior = [];
    this.photosClienteExterior64 = [];

    this.photosClienteInterior = [];
    this.photosClienteInterior64 = [];

    this.photosTitulo = [];
    this.photosTitulo64 = [];

    this.photosImpuesto = [];
    this.photosImpuesto64 = [];

    this.photosRespaldo = [];
    this.photosRespaldo64 = [];

    this.photosCertificado = [];
    this.photosCertificado64 = [];

    this.photosInteriorDom = [];
    this.photosInteriorDom64 = [];
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
