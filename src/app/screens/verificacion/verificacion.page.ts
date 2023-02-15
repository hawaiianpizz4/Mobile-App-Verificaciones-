import mapboxgl from 'mapbox-gl/';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

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

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.page.html',
  styleUrls: ['./verificacion.page.scss'],
})
export class VerificacionPage implements OnInit {
  map;
  infoPoss = [];
  status: boolean;
  dataClienteFromLista: any;
  dataForm = new FormGroup({
    nombre_gestor: new FormControl('', []),
    fecha_actual: new FormControl(
      { value: new Date().toUTCString(), disabled: true },
      []
    ),
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

    this.initMap();
  }

  async submitForm() {
    const postData = {
      cedulaCliente: this.dataForm.controls.numero_cedula.value,
      nombreCliente: this.dataForm.controls.nombre_cliente.value,
      codigoVerificacion: this.dataForm.controls.codigo.value,
      direccionDomiciliaria: this.dataForm.controls.direccion_cliente.value,
      tipoVivienda: this.dataForm.get('tipo_vivienda').value,
      personaQuienRealizaLaVerificacion: this.dataForm.get(
        'persona_verificacion'
      ).value,
      residenciaMinimaTresMeses: this.dataForm.get('tiempo_residencia').value,
      localTerrenoPropio: this.dataForm.get('local_terreno').value,
      localTerrenoArrendado: this.dataForm.get('local_terreno').value,
      planillaServicioBasico: this.dataForm.controls.planilla_servicios.value,
      planillaServicioBasicoImagen: this.photoService.photosPlanilla64,
      seguridadPuertasVentanas: this.dataForm.controls.seguridad_puertas.value,
      muebleriaBasica: this.dataForm.controls.muebleria_basica.value,
      materialCasa: this.dataForm.get('material_casa').value,
      periodicidadActividadesLaborales:
        this.dataForm.controls.periodicidad_actividades.value,
      confirmacionInfoVecinos: this.dataForm.controls.vecino_confirm.value,
      nombreInfoVecino: this.dataForm.controls.vecino_nombre.value,
      celularInfoVecino: this.dataForm.controls.vecino_celular.value,
      estabilidadLaboraSeisMesesImagen: this.photoService.photosPlanilla64,

      facturasProveedoresUltimosTresMesesImagen:
        this.photoService.photosPlanilla64,

      fachadaDelNegocioImagen: this.photoService.photosPlanilla64,
      interiorDelNegocioImagen: this.photoService.photosPlanilla64,

      clienteDentroDelNegocioImagen: this.photoService.photosPlanilla64, //CREAR SECCION
      clienteFueraDelNegocioImagen: this.photoService.photosPlanilla64, //CREAR SECCION

      tituloPropiedaGaranteOCodeudorImagen: this.photoService.photosPlanilla64,
      impuestoPredialImagen: this.photoService.photosPlanilla64,
      respaldoIngresosImagen: this.photoService.photosPlanilla64,
      certificadoLaboralImagen: this.photoService.photosPlanilla64,
      interiorDomicilioImagen: this.photoService.photosPlanilla64,

      latitud: this.dataForm.controls.latitud.value,
      longitud: this.dataForm.controls.longitud.value,

      vf_nombre_tienda: this.dataForm.controls.nombre_tienda.value,
      nombreGestor: this.dataForm.controls.nombre_cliente.value,
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

  initMap() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoianF1aWxjaGFtaW4iLCJhIjoiY2xkdzJiaTN4MDM5NjNvbnV4eTI5MmV0MCJ9.xkxeH8IUvBcUTyHOLEORJg';
    this.map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-79.4698468, -1.0037841],
      zoom: 18,
    });
    // Add the control to the map.
    this.map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      })
    );

    // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat([-79.4698468, -1.0037841])
      .addTo(this.map);

    const coordinates = document.getElementById('coordinates');

    function onDragEnd() {
      const lngLat = marker.getLngLat();
      coordinates.style.display = 'block';
      coordinates.innerHTML = `Longitud: ${lngLat.lng}<br />Latitud: ${lngLat.lat}`;
    }

    marker.on('dragend', () => {
      //mostrar coordenadas
      const features = this.map.queryRenderedFeatures(marker._pos);
      const lngLat = marker.getLngLat();
      onDragEnd();
      console.log(features[0].properties.name);
      this._services
        .getCurrentPoss(lngLat.lng, lngLat.lat, mapboxgl.accessToken)
        .subscribe(
          (data) => {
            this.infoPoss = data;
            console.log(this.infoPoss);
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }
}
