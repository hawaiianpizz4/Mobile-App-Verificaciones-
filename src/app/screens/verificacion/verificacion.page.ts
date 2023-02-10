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
import { Network } from '@capacitor/network';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { PhotoService } from '../../services/photo.service';
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

  dataFormVer = new FormGroup({
    fechaVer: new FormControl(
      { value: new Date().toUTCString(), disabled: true },
      []
    ),

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

      this.changeStatus();

  }

  async ngOnInit() {
    this.photoService.resetPhotos();





  }





  async changeStatus() {
    const status = await Network.getStatus();
   // this.status = status?.connected;
   // this.status
      //? this.presentToast('Conectado', 'wifi-outline', 'success')
      //: this.presentToast('Sin conexion', 'globe-outline', 'warning');
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




}
