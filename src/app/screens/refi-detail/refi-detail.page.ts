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

import { IonDatetime } from '@ionic/angular';

import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-refi-detail',
  templateUrl: './refi-detail.page.html',
  styleUrls: ['./refi-detail.page.scss'],
})
export class RefiDetailPage implements OnInit {
  selectedDate: string;

  dateChanged(event) {
    console.dir(event.detail);

    this.selectedDate = event.detail.value;
  }

  ionSelectSexo: FormControl = new FormControl([]);
  ionSelectClienteNivel: FormControl = new FormControl([]);
  ionSelectClienteEstadoCivil: FormControl = new FormControl([]);
  ionSelectTipoVivienda: FormControl = new FormControl([]);
  ionSelectTrabajoActividad: FormControl = new FormControl([]);

  dataForm = new FormGroup({
    // username: new FormControl('', [Validators.required]),
    // email: new FormControl('', [Validators.required, Validators.email]),
    // password: new FormControl('', [
    //   Validators.required,
    //   Validators.minLength(8),
    // ]),
  });

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
  imagen_paths: string[] = [];

  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;

  public currentDate: string;

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
    this.currentDate = new Date().toISOString();
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
    this.nombreUsuario = JSON.parse(localStorage.getItem('user'));
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.operacion = this.activatedRoute.snapshot.paramMap.get('operacion');

    console.log(this.id + ' - ' + this.operacion);

    const users = JSON.parse(localStorage.getItem('refi-storage'));

    // this.getdata = this._services.getDatosCliente(this.id);

    this._services.getDatosCliente(this.id).subscribe(
      (data) => {
        console.log(data[0]);

        // this.presentToast(JSON.stringify(data), 'pulse-outline', 'success');
        this.getdata = data[0];
        localStorage.setItem('refi-storage', JSON.stringify(data));
        console.log(this.getdata['des_sexo']);

        this.ionSelectSexo.setValue(this.getdata['des_sexo']);
        this.ionSelectClienteNivel.setValue(this.getdata['nivel_instruccion']);
        this.ionSelectClienteEstadoCivil.setValue(this.getdata['estado_civ']);
        this.ionSelectTipoVivienda.setValue(this.getdata['tipo_vivienda']);
        this.ionSelectTrabajoActividad.setValue(
          this.getdata['relacion_dependencia']
        );
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

  ngAfterViewInit() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoiZHNhbGF6YXIxOTg4IiwiYSI6ImNsZG95aWhrczBuZHgzb3V1ZWp4bHJqYjIifQ.L1vMimye2NhSQKaxsvbFtQ';
    const map = new mapboxgl.Map({
      // style: 'mapbox://styles/mapbox/streets-v12',
      style: 'mapbox://styles/mapbox/light-v10',
      center: [50, 50],
      zoom: 5,
      pitch: 0,
      bearing: -17.6,
      container: 'map',
      antialias: true,
    });

    map.on('load', () => {
      map.resize(); //cambiar el tamanio
      //marcador|| marker

      new mapboxgl.Marker()
        .setLngLat([this.longitude, this.latitude])
        .addTo(map);
      // console.log(mapboxgl)
      // Insert the layer beneath any symbol layer.
      const layers = map.getStyle().layers;
      let labelLayerId;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }
    });
  }

  submitForm(e) {
    const {
      refi_usuario,
      refi_operacion,
      refi_autorizacion,
      refi_autorizacion_original,
      refi_plazo,
      refi_valor_cuota,
      refi_pago_gastos_admin,
      refi_total_reest,
      refi_total_pagar,
      cliente_cedula,
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
      dir_provincia,
      dir_canton_ciudad,
      dir_parroquia,
      dir_direccion,
      dir_calle_transversal,
      dir_numero,
      dir_latitud,
      dir_longitud,
      dir_referencia,
      dir_tipo_vivienda,
      dir_tiempo,
      dir_telf_1,
      dir_telf_2,
      dir_email,
      dir_nombre_arrendador,
      dir_telf_arrendador,
      conyuge_cedula,
      conyuge_nombres,
      conyuge_email,
      conyuge_telf_1,
      conyuge_telf_2,
      conyuge_tipo_actividad,
      conyuge_nombre_empresa,
      conyuge_actividad_empresa,
      conyuge_cargo,
      conyuge_telefono_empresa,
      conyuge_ingresos_mensuales,
      ref1_nombres,
      ref1_parentesco,
      ref1_telf_1,
      ref1_telf_2,
      ref2_nombres,
      ref2_parentesco,
      ref2_telf_1,
      ref2_telf_2,
      trabajo_tipo_actividad,
      trabajo_ruc,
      trabajo_nombre,
      trabajo_provincia,
      trabajo_canton,
      trabajo_parroquia,
      trabajo_barrio,
      trabajo_direccion,
      trabajo_numero,
      trabajo_calle_transversal,
      trabajo_ref_ubicacion,
      trabajo_telefono,
      trabajo_antiguedad,
    } = e.target;
    const postData = {
      refi_usuario: refi_usuario.value,
      refi_operacion: refi_operacion.value,
      refi_autorizacion: refi_autorizacion.value,
      refi_autorizacion_original: refi_autorizacion_original.value,
      refi_plazo: refi_plazo.value,
      refi_valor_cuota: refi_valor_cuota.value,
      refi_pago_gastos_admin: refi_pago_gastos_admin.value,
      refi_total_reest: refi_total_reest.value,
      refi_total_pagar: refi_total_pagar.value,
      cliente_cedula: cliente_cedula.value,
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
      dir_provincia: dir_provincia.value,
      dir_canton_ciudad: dir_canton_ciudad.value,
      dir_parroquia: dir_parroquia.value,
      dir_direccion: dir_direccion.value,
      dir_calle_transversal: dir_calle_transversal.value,
      dir_numero: dir_numero.value,
      dir_latitud: dir_latitud.value,
      dir_longitud: dir_longitud.value,
      dir_referencia: dir_referencia.value,
      dir_tipo_vivienda: dir_tipo_vivienda.value,
      dir_tiempo: dir_tiempo.value,
      dir_telf_1: dir_telf_1.value,
      dir_telf_2: dir_telf_2.value,
      dir_email: dir_email.value,
      dir_nombre_arrendador: dir_nombre_arrendador.value,
      dir_telf_arrendador: dir_telf_arrendador.value,
      conyuge_cedula: conyuge_cedula.value,
      conyuge_nombres: conyuge_nombres.value,
      conyuge_email: conyuge_email.value,
      conyuge_telf_1: conyuge_telf_1.value,
      conyuge_telf_2: conyuge_telf_2.value,
      conyuge_tipo_actividad: conyuge_tipo_actividad.value,
      conyuge_nombre_empresa: conyuge_nombre_empresa.value,
      conyuge_actividad_empresa: conyuge_actividad_empresa.value,
      conyuge_cargo: conyuge_cargo.value,
      conyuge_telefono_empresa: conyuge_telefono_empresa.value,
      conyuge_ingresos_mensuales: conyuge_ingresos_mensuales.value,
      ref1_nombres: ref1_nombres.value,
      ref1_parentesco: ref1_parentesco.value,
      ref1_telf_1: ref1_telf_1.value,
      ref1_telf_2: ref1_telf_2.value,
      ref2_nombres: ref2_nombres.value,
      ref2_parentesco: ref2_parentesco.value,
      ref2_telf_1: ref2_telf_1.value,
      ref2_telf_2: ref2_telf_2.value,
      trabajo_tipo_actividad: trabajo_tipo_actividad.value,
      trabajo_ruc: trabajo_ruc.value,
      trabajo_nombre: trabajo_nombre.value,
      trabajo_provincia: trabajo_provincia.value,
      trabajo_canton: trabajo_canton.value,
      trabajo_parroquia: trabajo_parroquia.value,
      trabajo_barrio: trabajo_barrio.value,
      trabajo_direccion: trabajo_direccion.value,
      trabajo_numero: trabajo_numero.value,
      trabajo_calle_transversal: trabajo_calle_transversal.value,
      trabajo_ref_ubicacion: trabajo_ref_ubicacion.value,
      trabajo_telefono: trabajo_telefono.value,
      trabajo_antiguedad: trabajo_antiguedad.value,
      imagen_files: this.photoService.photosBase64,
    };
    console.dir(postData);

    if (cliente_cedula.value && cliente_cedula.value != undefined) {
      if (this.status) {
        const url = `http://171.23.12.43/api_cobranzas/controller/refinanciamiento.php?op=insertRefi`;

        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        };

        // console.log(JSON.stringify(this.photoService.photosBase64.length));
        this._http.post(url, JSON.stringify(postData), httpOptions).subscribe(
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

  handleChange(event: Event) {}

  redirect() {
    this.navCtrl.navigateForward('home/listing');
  }
}
