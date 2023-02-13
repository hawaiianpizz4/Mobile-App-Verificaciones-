import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ModalController,
  NavController,
  ToastController,
  LoadingController,
} from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { PhotoService } from '../../services/photoVerificacion.service';
import { ElementRef, ViewChild } from '@angular/core';

import { dataService } from 'src/app/services/data.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var mapboxgl: any;

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.page.html',
  styleUrls: ['./verificacion.page.scss'],
})
export class VerificacionPage implements OnInit {
  status: boolean;

    dataForm = new FormGroup({
    nombre_gestor: new FormControl('', []),
    fecha_actual: new FormControl(
      { value: new Date().toUTCString(), disabled: true },
      []),
    nombre_tienda: new FormControl('', []),
    nombre_cliente: new FormControl('', []),
    numero_cedula: new FormControl('', []),
    direccion_cliente: new FormControl('', []),
    tipo_vivienda: new FormControl('', []),
    persona_verificacion: new FormControl('', []),
    tiempo_residencia: new FormControl('', []),
    local_terreno: new FormControl('', []),

    planilla_servicios: new FormControl(false, []),
    seguridad_puertas: new FormControl(false, []),
    muebleria_basica: new FormControl(false, []),
    material_casa: new FormControl('', []),
    periodicidad_actividades: new FormControl('', []),

    vecino_confirm: new FormControl(false, []),
    vecino_nombre: new FormControl('', []),
    vecino_celular: new FormControl('', []),

    codigo: new FormControl({ value: '', disabled: true }, []),
    latitud: new FormControl({ value: '', disabled: true }, []),
    longitud: new FormControl({ value: '', disabled: true }, []),
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private ngZone: NgZone,
    private _http: HttpClient,
    public photoService: PhotoService,
    private _services: dataService,

    private modalCtrl: ModalController
  ) {
    // this.changeStatus();
  }

  async ngOnInit() {
  }


  async showLoading(msg) {
    const loading = await this.loadingCtrl.create({
      message: msg,
      duration: 2000,
    });

    loading.present();
  }
  async presentToast(message, iconInsert, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'top',
      icon: iconInsert,
      color: color,
    });

    await toast.present();
  }

  redirect() {
    // this.navCtrl.navigateForward('home/listing');
    this.navCtrl.navigateRoot('/home/listing', {
      animated: true,
      animationDirection: 'forward',
    });
  }


  
  addPhoto(tipo: string) {
    this.photoService.addNewToGallery(tipo);
  }






}
