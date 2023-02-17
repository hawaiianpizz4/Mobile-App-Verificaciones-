//import mapboxgl from 'mapbox-gl/';
//import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

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
import { Network } from '@capacitor/network';

import { PhotoService } from '../../services/photoVerificacion.service';
import { ElementRef, ViewChild } from '@angular/core';

import { dataService } from 'src/app/services/data.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.page.html',
  styleUrls: ['./verificacion.page.scss'],
})
export class VerificacionPage implements OnInit {
 // map;
  infoPoss = [];
  status: boolean;
  dataClienteFromLista: any;

  postInfoCliente: Observable<any>;
  latitude: number;
  longitude: number;

  isServiceCallInProgress: any;
  networkStatus: boolean;

  dataForm = new FormGroup({
    nombre_gestor: new FormControl('', []),
    fecha_actual: new FormControl(
      { value: new Date().toUTCString(), disabled: true },[]),
    nombre_tienda: new FormControl('', []),
    nombre_cliente: new FormControl('', []),
    numero_cedula: new FormControl('', []),
    direccion_cliente: new FormControl('', []),
    tipo_vivienda: new FormControl('', []),
    persona_verificacion: new FormControl('', []),
    tiempo_residencia: new FormControl('', []),
    local_terreno: new FormControl('', []),

    planilla_servicios: new FormControl(false, []),
    puertas_ventanas: new FormControl(false, []),
    muebleria_basica: new FormControl(false, []),
    material_casa: new FormControl('', []),
    periodicidad_actividades: new FormControl('', []),

    vecino_confirma: new FormControl(false, []),
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
    this.getCurrentCoordinates();
    //this.photoService.resetPhotos();

    this.dataForm.controls.nombre_gestor.setValue(
      this.activatedRoute.snapshot.paramMap.get('vf_nombre_vendedor')
    );
    this.dataForm.controls.nombre_tienda.setValue(
      this.activatedRoute.snapshot.paramMap.get('vf_nombre_tienda')
    );
    this.dataForm.controls.nombre_cliente.setValue(
      this.activatedRoute.snapshot.paramMap.get('vf_nombre_cliente')
    );
    this.dataForm.controls.numero_cedula.setValue(
      this.activatedRoute.snapshot.paramMap.get('vf_cedula_cliente')
    );
    this.dataForm.controls.direccion_cliente.setValue(
      this.activatedRoute.snapshot.paramMap.get('dndlD_direccion_domiciliaria')
    );
    this.dataForm.controls.codigo.setValue(
      this.activatedRoute.snapshot.paramMap.get('dndlD_codigo')
    );

    Network.addListener('networkStatusChange', (status) => {
      this.ngZone.run(() => {
        this.changeStatus();
      });
    });

    this.changeStatus();
  }

  async submitForm() {
    const postData = {

      nombreGestor: this.dataForm.controls.nombre_gestor.value,
      //fechaverificacion: this.dataForm.controls.fecha_actual.value,
      vf_nombre_tienda: this.dataForm.controls.nombre_tienda.value,
      nombreCliente: this.dataForm.controls.nombre_cliente.value,
      cedulaCliente: this.dataForm.controls.numero_cedula.value,
      codigoVerificacion: this.dataForm.controls.codigo.value,
      direccionDomiciliaria: this.dataForm.controls.direccion_cliente.value,
      //vivienda
      tipoVivienda: this.dataForm.get('tipo_vivienda').value,
      personaQuienRealizaLaVerificacion: this.dataForm.get('persona_verificacion').value,
      residenciaMinimaTresMeses: this.dataForm.get('residencia_minima').value,
      localTerrenoPropio: this.dataForm.get('localTerreno_propio').value,
      localTerrenoArrendado: this.dataForm.get('localTerreno_arrendado').value,
      //servicios
      planillaServicioBasico: this.dataForm.controls.planilla_servicios.value,
      planillaServicioBasicoImagen: this.photoService.photosPlanilla64,
      seguridadPuertasVentanas: this.dataForm.controls.puertas_ventanas.value,
      muebleriaBasica: this.dataForm.controls.muebleria_basica.value,
      materialCasa: this.dataForm.get('material_casa').value,
      periodicidadActividadesLaborales:this.dataForm.controls.periodicidad_actividades.value,
      //acordeon confimacion vecino
      confirmacionInfoVecinos: this.dataForm.controls.vecino_confirma.value,
      nombreInfoVecino: this.dataForm.controls.vecino_nombre.value,
      celularInfoVecino: this.dataForm.controls.vecino_celular.value,

      //imagenes



      estabilidadLaboraSeisMesesImagen: this.photoService.photosEstabilidad,
      facturasProveedoresUltimosTresMesesImagen:this.photoService.photosFacturas,
      clienteFueraDelNegocioImagen: this.photoService.photosExterior,
      clienteDentroDelNegocioImagen: this.photoService.photosInterior,
      tituloPropiedaGaranteOCodeudorImagen: this.photoService.photosTitulo,
      impuestoPredialImagen: this.photoService.photosImpuesto,
      respaldoIngresosImagen: this.photoService.photosRespaldo,
      certificadoLaboralImagen: this.photoService.photosCertificado,
      interiorDomicilioImagen: this.photoService.photosInteriorDom,

      //latitud
      latitud: this.dataForm.controls.latitud.value,
      longitud: this.dataForm.controls.longitud.value,



    };

    console.dir(this.photoService.photosPlanilla64);
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
              this.showLoading('Guardando Registro...').then((e) => {});
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


  async changeStatus() {
    const status = await Network.getStatus();
    this.networkStatus = status?.connected;
    this.networkStatus
      ? this.presentToast('Conectado', 'wifi-outline', 'success')
      : this.presentToast('Sin conexion', 'globe-outline', 'warning');
  }

  getCurrentCoordinates() {
    this.geolocation
      .getCurrentPosition()
      .then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
      })
      .catch((error) => {
        console.log(error);
      });
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
