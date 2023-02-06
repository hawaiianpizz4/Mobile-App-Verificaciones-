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
import { GoogleMap, Marker, MapType } from '@capacitor/google-maps';
declare var mapboxgl: any;

import { RefiModalMapPage } from 'src/app/components/refi-modal-map/refi-modal-map.page';
import { dataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-refi-detail',
  templateUrl: './refi-detail.page.html',
  styleUrls: ['./refi-detail.page.scss'],
})
export class RefiDetailPage implements OnInit {
  id: string;
  getdata = [];
  cedula: string;
  operacion: string;
  nombreUsuario: string;
  image: string;

  PostUser: Observable<any>;
  latitude = 111.111;
  longitude = 1111.111;
  status: boolean;
  markerId: string = '';
  markersId: string[] = [];

  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;

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
    this.nombreUsuario = JSON.parse(localStorage.getItem('user'));
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    const users = JSON.parse(localStorage.getItem('refi-storage'));

    // this.getdata = this._services.getDatosCliente(this.id);

    this._services.getDatosCliente(this.id).subscribe(
      (data) => {
        console.log(data[0]);

        this.presentToast(JSON.stringify(data), 'pulse-outline', 'success');
        this.getdata = data[0];
        localStorage.setItem('refi-storage', JSON.stringify(data));
      },
      (error) => {
        console.log(error);
        this.presentToast(JSON.parse(error), 'pulse-outline', 'success');
      }
    );

    if (!this.getdata) {
      this.presentToast('El usuario no se pudo encontrar', 'Error', 'warning');
      this.redirect();
    }
  }

  // ionViewDidEnter() {
  //   this.createMap();
  // }

  // async createMap() {
  //   this.map = await GoogleMap.create({
  //     id: 'my-map',
  //     apiKey: environment.mapsKey,
  //     element: this.mapRef.nativeElement,
  //     forceCreate: true,

  //     config: {
  //       center: {
  //         lat: this.latitude,
  //         lng: this.longitude,
  //       },
  //       mapTypeControl: false,
  //       disableDefaultUI: true,
  //       zoom: 15,
  //     },
  //   });
  //   // await this.map.setMapType(MapType.Satellite);
  //   await this.map.enableCurrentLocation(true);

  //   this.map.setOnMapClickListener(async (marker) => {
  //     this.map.removeMarkers(this.markersId);
  //     this.map.removeMarker('asdfasdf');
  //     this.addMarkers(marker.latitude, marker.longitude);
  //     console.dir(this.map);
  //   });
  // }

  // async addMarkers(latitude: number, longitude: number) {
  //   const marker = {
  //     coordinate: {
  //       lat: latitude,
  //       lng: longitude,
  //     },
  //     title: 'Ubicación actual',
  //     snippet: 'Aquí',
  //   };

  //   const result = await this.map.addMarker(marker);
  //   this.markersId.push(result[0]);
  // }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: RefiModalMapPage,
    });
    await modal.present();
  }

  async ngOnInit() {
    this.getCurrentCoordinates();
    Network.addListener('networkStatusChange', (status) => {
      this.ngZone.run(() => {
        this.changeStatus(status);
      });
    });
    const status = await Network.getStatus();
    this.changeStatus(status);
  }

  changeStatus(status) {
    this.status = status?.connected;
    this.status
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

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  // ngAfterViewInit() {
  //   mapboxgl.accessToken =
  //     'pk.eyJ1IjoiZHNhbGF6YXIxOTg4IiwiYSI6ImNsZG95aWhrczBuZHgzb3V1ZWp4bHJqYjIifQ.L1vMimye2NhSQKaxsvbFtQ';
  //   const map = new mapboxgl.Map({
  //     // style: 'mapbox://styles/mapbox/streets-v12',
  //     style: 'mapbox://styles/mapbox/light-v10',
  //     // center: [5, 6],
  //     zoom: 5,
  //     pitch: 0,
  //     bearing: -17.6,
  //     container: 'map',
  //     antialias: true,
  //   });

  //   map.on('load', () => {
  //     map.resize(); //cambiar el tamanio
  //     //marcador|| marker

  //     new mapboxgl.Marker()
  //       .setLngLat([this.longitude, this.latitude])
  //       .addTo(map);
  //     // console.log(mapboxgl)
  //     // Insert the layer beneath any symbol layer.
  //     const layers = map.getStyle().layers;
  //     let labelLayerId;
  //     for (let i = 0; i < layers.length; i++) {
  //       if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
  //         labelLayerId = layers[i].id;
  //         break;
  //       }
  //     }
  //   });
  // }

  submitForm(e) {
    const {
      operacion,
      autorizacion,
      autorizacion_original,
      cedula,
      refi_plazo,
      refi_valor_cuota,
      refi_fecha_primer_pago,
      refi_pago_gastos_administrativos,
      refi_total_reestructuracion,
      refi_total_a_pagar,
      cliente_apellido_paterno,
      cliente_apellido_materno,
      cliente_nombres,
      cliente_nacionalidad,
      cliente_ciudad_nacimiento,
      cliente_fecha_nacimiento,
      cliente_sexo,
      cliente_nivel_educativo,
      cliente_profesion,
      cliente_estado_civil,
      cliente_numero_dependientes,
      dir_direccion_exacta,
      dir_direccion,
      dir_latitud,
      dir_longitud,
      dir_calle_secundaria,
      dir_referencia,
      dir_tipo_vivienda,
      dir_telefono_domicilio,
      dir_celular,
      dir_correo_electronico,
      conyuge_cedula,
      conyuge_apellido_paterno,
      conyuge_apellido_materno,
      conyuge_nombres,
      conyuge_celular,
      conyuge_correo_electronico,
      ref1_apellido_paterno,
      ref1_apellido_materno,
      ref1_nombres,
      ref1_parentesco,
      ref1_celular1,
      ref1_celular2,
      ref2_apellido_paterno,
      ref2_apellido_materno,
      ref2_nombres,
      ref2_parentesco,
      ref2_celular1,
      ref2_celular2,
      trabajo_ruc,
      trabajo_nombre,
      trabajo_telefono1,
      //filename,
    } = e.target;
    const postData = {
      operacion: operacion.value,
      autorizacion: autorizacion.value,
      autorizacion_original: autorizacion_original.value,
      cedula: cedula.value,
      refi_plazo: refi_plazo.value,
      refi_valor_cuota: refi_valor_cuota.value,
      refi_fecha_primer_pago: refi_fecha_primer_pago.value,
      refi_pago_gastos_administrativos: refi_pago_gastos_administrativos.value,
      refi_total_reestructuracion: refi_total_reestructuracion.value,
      refi_total_a_pagar: refi_total_a_pagar.value,
      cliente_apellido_paterno: cliente_apellido_paterno.value,
      cliente_apellido_materno: cliente_apellido_materno.value,
      cliente_nombres: cliente_nombres.value,
      cliente_nacionalidad: cliente_nacionalidad.value,
      cliente_ciudad_nacimiento: cliente_ciudad_nacimiento.value,
      cliente_fecha_nacimiento: cliente_fecha_nacimiento.value,
      cliente_sexo: cliente_sexo.value,
      cliente_nivel_educativo: cliente_nivel_educativo.value,
      cliente_profesion: cliente_profesion.value,
      cliente_estado_civil: cliente_estado_civil.value,
      cliente_numero_dependientes: cliente_numero_dependientes.value,
      dir_direccion_exacta: dir_direccion_exacta.value,
      dir_direccion: dir_direccion.value,
      dir_latitud: dir_latitud.value,
      dir_longitud: dir_longitud.value,
      dir_calle_secundaria: dir_direccion.value,
      dir_referencia: dir_referencia.value,
      dir_telefono_domicilio: dir_telefono_domicilio.value,
      dir_celular: dir_celular.value,
      dir_correo_electronico: dir_correo_electronico.value,
      conyuge_cedula: conyuge_cedula.value,
      conyuge_apellido_paterno: conyuge_apellido_paterno.value,
      conyuge_apellido_materno: conyuge_apellido_materno.value,
      conyuge_nombres: conyuge_nombres.value,
      conyuge_celular: conyuge_celular.value,
      conyuge_correo_electronico: conyuge_correo_electronico.value,
      ref1_apellido_paterno: ref1_apellido_paterno.value,
      ref1_apellido_materno: ref1_apellido_materno.value,
      ref1_nombres: ref1_nombres.value,
      ref1_parentesco: ref1_parentesco.value,
      ref1_celular1: ref1_celular1.value,
      ref1_celular2: ref1_celular2.value,
      ref2_apellido_paterno: ref2_apellido_paterno.value,
      ref2_apellido_materno: ref2_apellido_materno.value,
      ref2_nombres: ref2_nombres.value,
      ref2_parentesco: ref2_parentesco.value,
      ref2_celular1: ref2_celular1.value,
      ref2_celular2: ref2_celular2.value,
      trabajo_ruc: trabajo_ruc.value,
      trabajo_nombre: trabajo_nombre.value,
      trabajo_telefono1: trabajo_nombre.value,
      nombreUsuario: JSON.parse(localStorage.getItem('user')),
      archivoAdjunto: this.photoService.photos,
    };
    console.log(postData.nombreUsuario);

    if (cedula.value && cedula.value != undefined) {
      if (this.status) {
        const url = `http://localhost/api_rest_movil/controller/refinanciamiento.php?op=insertRefi`;

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        };

        console.log(JSON.stringify(this.photoService.photosBlob.length));
        // this._http.post(url, JSON.stringify(postData), httpOptions).subscribe(
        //   () => {
        //     this.showLoading('Guardando Registro...').then((e) => {});
        //     setTimeout(() => {
        //       this.presentToast(
        //         'Registro Enviado',
        //         'checkmark-outline',
        //         'success'
        //       );
        //       this.redirect();
        //     }, 3000);
        // this.photoService.photosBlob;
        //   },
        //   (error) => {
        //     setTimeout(() => {
        //       this.presentToast('Error', error, 'error');
        //       this.redirect();
        //     }, 3000);
        //     console.log(error);
        //   }
        // );

        setTimeout(() => {
          this.presentToast('Registro Enviado', 'checkmark-outline', 'success');
          this.redirect();
        }, 3000);
      } else {
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
        // } else {
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
      }
    } else {
      this.presentToast('No debe existir campos vacios', 'alert', 'warning');
    }
  }

  redirect() {
    this.navCtrl.navigateForward('home/refi-listing');
  }
}
