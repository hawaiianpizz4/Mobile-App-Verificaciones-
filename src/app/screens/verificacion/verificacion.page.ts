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
import { Router } from '@angular/router';


declare var mapboxgl: any;

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.page.html',
  styleUrls: ['./verificacion.page.scss'],
})
export class VerificacionPage implements OnInit {
  status: boolean;
  dataClienteFromLista: any;
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
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) {
    // this.changeStatus();



  }

  async ngOnInit() {


    this.dataForm.controls.nombre_gestor.setValue(this.activatedRoute.snapshot.paramMap.get('vf_nombre_vendedor'));
    this.dataForm.controls.nombre_tienda.setValue(this.activatedRoute.snapshot.paramMap.get('vf_nombre_tienda'));
    this.dataForm.controls.nombre_cliente.setValue(this.activatedRoute.snapshot.paramMap.get('vf_nombre_cliente'));
    this.dataForm.controls.numero_cedula.setValue(this.activatedRoute.snapshot.paramMap.get('vf_cedula_cliente'));
    this.dataForm.controls.direccion_cliente.setValue(this.activatedRoute.snapshot.paramMap.get('dndlD_direccion_domiciliaria'));

  }



  async submitForm() {
    const postData = {
      nombre_tienda: this.dataForm.controls.nombre_tienda.value,
      nombre_cliente: this.dataForm.controls.nombre_cliente.value,
      numero_cedula: this.dataForm.controls.numero_cedula.value,
      direccion_cliente: this.dataForm.controls.direccion_cliente.value,

      tipo_vivienda: this.dataForm.get('tipo_vivienda').value,
      // persona_verificacion: this.dataForm.controls.persona_verificacion.value,
      persona_verificacion: this.dataForm.get('persona_verificacion').value,
      tiempo_residencia: this.dataForm.get('tiempo_residencia').value,
      local_terreno: this.dataForm.get('local_terreno').value,
      planilla_servicios: this.dataForm.controls.planilla_servicios.value,

      seguridad_puertas: this.dataForm.controls.seguridad_puertas.value,
      muebleria_basica: this.dataForm.controls.muebleria_basica.value,
      // material_casa: this.dataForm.controls.material_casa.value,
      material_casa: this.dataForm.get('material_casa').value,
      periodicidad_actividades: this.dataForm.controls.periodicidad_actividades.value,
      vecino_confirm: this.dataForm.controls.vecino_confirm.value,
      vecino_nombre: this.dataForm.controls.vecino_nombre.value,
      vecino_celular: this.dataForm.controls.vecino_celular.value,
      codigo: this.dataForm.controls.codigo.value,
      latitud: this.dataForm.controls.latitud.value,
      longitud: this.dataForm.controls.longitud.value,
    };

    console.dir(postData);
    // if (postData.numero_cedula && postData.numero_cedula != undefined)
    {
      // if (this.status)
      {
        const url = `${environment.apiUrl}verificacion.php?op=insertVer`;

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        };

        // console.log(JSON.stringify(this.photoService.photosBase64.length));
        await this._http
          .post(url, JSON.stringify(postData), httpOptions)
          .subscribe(
            () => {
              this.showLoading('Guardando Registro...').then((e) => { });
              setTimeout(() => {
                this.presentToast(
                  'Registro Enviado',
                  'checkmark-outline',
                  'success'
                );
                this.redirect();
              }, 3000);
            },
            (error) => {
              setTimeout(() => {
                this.presentToast('Error', error, 'error');
                this.redirect();
              }, 3000);
              console.log(error);
            }
          );

        setTimeout(() => {
          this.presentToast('Registro Enviado', 'checkmark-outline', 'success');
          this.redirect();
        }, 3000);
      }
    }

    //   } else {
    // var dataInLocalStorage = localStorage.getItem('refi-storageWait');
    // var local = [];
    // if (dataInLocalStorage) {
    //   local = Array.from(JSON.parse(dataInLocalStorage));
    //   local.push(JSON.parse(data));
    //   localStorage.setItem('refi-storageWait', JSON.stringify(local));
    //   this.showLoading('Guardando registro para ser enviado');
    //   setTimeout(() => {
    //     this.presentToast(
    //       'Registro Guardado',
    //       'checkmark-outline',
    //       'success'
    //     );
    //   }, 3000);
    // }
    // else {
    //   var insert = Array.from(JSON.parse(data));
    //   insert.push(JSON.parse(data));
    //   localStorage.setItem('refi-storageWait', JSON.stringify(insert));
    //   this.showLoading('Guardando registro para ser enviado');
    //   setTimeout(() => {
    //     this.presentToast(
    //       'Registro Guardado',
    //       'checkmark-outline',
    //       'success'
    //     );
    //     this.redirect();
    //   }, 3000);
    // }
    //   }
    // } else {
    //   this.presentToast('No debe existir campos vacios', 'alert', 'warning');
    // }
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
    this.navCtrl.navigateRoot('/verificaciones2', {
      animated: true,
      animationDirection: 'forward',
    });
  }



  addPhoto(tipo: string) {
    this.photoService.addNewToGallery(tipo);
  }






}
