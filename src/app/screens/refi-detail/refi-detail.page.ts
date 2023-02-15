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
import { Network } from '@capacitor/network';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { PhotoService } from '../../services/photo.service';

import { RefiModalMapPage } from 'src/app/components/refi-modal-map/refi-modal-map.page';
import { dataService } from 'src/app/services/data.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-refi-detail',
  templateUrl: './refi-detail.page.html',
  styleUrls: ['./refi-detail.page.scss'],
})
export class RefiDetailPage implements OnInit {
  selectedDatePrimerPago: string;

  dateChangedPrimerPago(event) {
    console.dir(event.detail);
    this.selectedDatePrimerPago = event.detail.value;
  }

  map;
  infoPoss = [];
  dataForm = new FormGroup({
    refi_fecha: new FormControl(
      { value: new Date().toUTCString(), disabled: true },
      []
    ),
    refi_usuario: new FormControl({ value: '', disabled: true }, []),
    refi_operacion: new FormControl({ value: '', disabled: true }, []),
    refi_autorizacion: new FormControl('', []),
    refi_autorizacion_original: new FormControl('', []),
    refi_plazo: new FormControl('', []),
    refi_valor_cuota: new FormControl('', []),
    refi_pago_gastos_admin: new FormControl('', []),
    refi_total_reest: new FormControl('', []),
    refi_total_pagar: new FormControl('', []),
    cliente_cedula: new FormControl('', []),
    cliente_nombres: new FormControl('', []),
    cliente_nacionalidad: new FormControl('', []),
    cliente_ciudad_nacimiento: new FormControl('', []),
    cliente_fecha_nacimiento: new FormControl('', []),
    cliente_sexo: new FormControl('', []),
    cliente_nivel_educativo: new FormControl('', []),
    cliente_profesion: new FormControl('', []),
    cliente_estado_civil: new FormControl('', []),
    cliente_numero_dependientes: new FormControl('', []),
    dir_direccion_exacta: new FormControl('', []),
    dir_provincia: new FormControl('', []),
    dir_canton_ciudad: new FormControl('', []),
    dir_parroquia: new FormControl('', []),
    dir_direccion: new FormControl('', []),
    dir_calle_transversal: new FormControl('', []),
    dir_numero: new FormControl('', []),
    dir_latitud: new FormControl('', []),
    dir_longitud: new FormControl('', []),
    dir_referencia: new FormControl('', []),
    dir_tipo_vivienda: new FormControl('', []),
    dir_tiempo: new FormControl('', []),
    dir_telf_1: new FormControl('', []),
    dir_telf_2: new FormControl('', []),
    dir_email: new FormControl('', []),
    dir_nombre_arrendador: new FormControl('', []),
    dir_telf_arrendador: new FormControl('', []),
    conyuge_cedula: new FormControl('', []),
    conyuge_nombres: new FormControl('', []),
    conyuge_email: new FormControl('', []),
    conyuge_telf_1: new FormControl('', []),
    conyuge_telf_2: new FormControl('', []),
    conyuge_tipo_actividad: new FormControl('', []),
    conyuge_nombre_empresa: new FormControl('', []),
    conyuge_actividad_empresa: new FormControl('', []),
    conyuge_cargo: new FormControl('', []),
    conyuge_telefono_empresa: new FormControl('', []),
    conyuge_ingresos_mensuales: new FormControl('', []),
    ref1_nombres: new FormControl('', []),
    ref1_parentesco: new FormControl('', []),
    ref1_telf_1: new FormControl('', []),
    ref1_telf_2: new FormControl('', []),
    ref2_nombres: new FormControl('', []),
    ref2_parentesco: new FormControl('', []),
    ref2_telf_1: new FormControl('', []),
    ref2_telf_2: new FormControl('', []),
    trabajo_tipo_actividad: new FormControl('', []),
    trabajo_ruc: new FormControl('', []),
    trabajo_nombre: new FormControl('', []),
    trabajo_provincia: new FormControl('', []),
    trabajo_canton: new FormControl('', []),
    trabajo_parroquia: new FormControl('', []),
    trabajo_barrio: new FormControl('', []),
    trabajo_direccion: new FormControl('', []),
    trabajo_numero: new FormControl('', []),
    trabajo_calle_transversal: new FormControl('', []),
    trabajo_ref_ubicacion: new FormControl('', []),
    trabajo_telefono: new FormControl('', []),
    trabajo_antiguedad: new FormControl('', []),
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

  public currentDate: string = new Date().toISOString();

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
    this.initMap();
    this.getCurrentCoordinates();
    this.photoService.resetPhotos();
    this.nombreUsuario = JSON.parse(localStorage.getItem('user'));
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.operacion = this.activatedRoute.snapshot.paramMap.get('operacion');

    console.log(`${this.id} - ${this.operacion} - ${this.currentDate}`);

    const users = JSON.parse(localStorage.getItem('refi-storage'));

    this.dataForm.controls.refi_fecha.setValue(this.currentDate);
    this.dataForm.controls.refi_operacion.setValue(this.operacion);
    this.dataForm.controls.refi_usuario.setValue(this.nombreUsuario);
    this.dataForm.controls.cliente_cedula.setValue(this.id);

    this._services.getDatosCliente(this.id).subscribe(
      (data) => {
        console.log(data[0]);

        // this.presentToast(JSON.stringify(data), 'pulse-outline', 'success');
        this.getdata = data[0];
        localStorage.setItem('refi-storage', JSON.stringify(data));
        // console.log(this.getdata['des_sexo']);

        this.dataForm.controls.cliente_sexo.setValue(this.getdata['des_sexo']);
        this.dataForm.controls.cliente_nivel_educativo.setValue(
          this.getdata['nivel_instruccion']
        );
        this.dataForm.controls.cliente_estado_civil.setValue(
          this.getdata['estado_civ']
        );
        this.dataForm.controls.dir_tipo_vivienda.setValue(
          this.getdata['tipo_vivienda']
        );
        this.dataForm.controls.trabajo_tipo_actividad.setValue(
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
        this.changeStatus();
      });
    });
    this.changeStatus();
  }

  async changeStatus() {
    const status = await Network.getStatus();
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

  async submitForm(e) {
    const postData = {
      refi_usuario: this.dataForm.controls.refi_usuario.value,
      refi_fecha: this.dataForm.controls.refi_fecha.value,
      refi_operacion: this.dataForm.controls.refi_operacion.value,
      refi_autorizacion: this.dataForm.controls.refi_autorizacion.value,
      refi_autorizacion_original:
        this.dataForm.controls.refi_autorizacion_original.value,
      refi_plazo: this.dataForm.controls.refi_plazo.value,
      refi_valor_cuota: this.dataForm.get('refi_valor_cuota').value,
      refi_pago_gastos_admin:
        this.dataForm.controls.refi_pago_gastos_admin.value,
      refi_total_reest: this.dataForm.controls.refi_total_reest.value,
      refi_total_pagar: this.dataForm.controls.refi_total_pagar.value,
      cliente_cedula: this.dataForm.controls.cliente_cedula.value,
      cliente_nombres: this.dataForm.controls.cliente_nombres.value,
      cliente_nacionalidad: this.dataForm.controls.cliente_nacionalidad.value,
      cliente_ciudad_nacimiento:
        this.dataForm.controls.cliente_ciudad_nacimiento.value,
      cliente_fecha_nacimiento:
        this.dataForm.controls.cliente_fecha_nacimiento.value,
      // cliente_sexo: this.dataForm.controls.cliente_sexo.value,
      cliente_sexo: this.dataForm.get('cliente_sexo').value,
      cliente_nivel_educativo: this.dataForm.get('cliente_nivel_educativo')
        .value,
      cliente_profesion: this.dataForm.controls.cliente_profesion.value,
      cliente_estado_civil: this.dataForm.get('cliente_estado_civil').value,
      cliente_numero_dependientes:
        this.dataForm.controls.cliente_numero_dependientes.value,
      dir_direccion_exacta: this.dataForm.controls.dir_direccion_exacta.value,
      dir_provincia: this.dataForm.controls.dir_provincia.value,
      dir_canton_ciudad: this.dataForm.controls.dir_canton_ciudad.value,
      dir_parroquia: this.dataForm.controls.dir_parroquia.value,
      dir_direccion: this.dataForm.controls.dir_direccion.value,
      dir_calle_transversal: this.dataForm.controls.dir_calle_transversal.value,
      dir_numero: this.dataForm.controls.dir_numero.value,
      dir_latitud: this.dataForm.controls.dir_latitud.value,
      dir_longitud: this.dataForm.controls.dir_longitud.value,
      dir_referencia: this.dataForm.controls.dir_referencia.value,
      dir_tipo_vivienda: this.dataForm.get('dir_tipo_vivienda').value,
      dir_tiempo: this.dataForm.controls.dir_tiempo.value,
      dir_telf_1: this.dataForm.controls.dir_telf_1.value,
      dir_telf_2: this.dataForm.controls.dir_telf_2.value,
      dir_email: this.dataForm.controls.dir_email.value,
      dir_nombre_arrendador: this.dataForm.controls.dir_nombre_arrendador.value,
      dir_telf_arrendador: this.dataForm.controls.dir_telf_arrendador.value,
      conyuge_cedula: this.dataForm.controls.conyuge_cedula.value,
      conyuge_nombres: this.dataForm.controls.conyuge_nombres.value,
      conyuge_email: this.dataForm.controls.conyuge_email.value,
      conyuge_telf_1: this.dataForm.controls.conyuge_telf_1.value,
      conyuge_telf_2: this.dataForm.controls.conyuge_telf_2.value,
      conyuge_tipo_actividad: this.dataForm.get('conyuge_tipo_actividad').value,
      conyuge_nombre_empresa:
        this.dataForm.controls.conyuge_nombre_empresa.value,
      conyuge_actividad_empresa:
        this.dataForm.controls.conyuge_actividad_empresa.value,
      conyuge_cargo: this.dataForm.controls.conyuge_cargo.value,
      conyuge_telefono_empresa:
        this.dataForm.controls.conyuge_telefono_empresa.value,
      conyuge_ingresos_mensuales:
        this.dataForm.controls.conyuge_ingresos_mensuales.value,
      ref1_nombres: this.dataForm.controls.ref1_nombres.value,
      ref1_parentesco: this.dataForm.controls.ref1_parentesco.value,
      ref1_telf_1: this.dataForm.controls.ref1_telf_1.value,
      ref1_telf_2: this.dataForm.controls.ref1_telf_2.value,
      ref2_nombres: this.dataForm.controls.ref2_nombres.value,
      ref2_parentesco: this.dataForm.controls.ref2_parentesco.value,
      ref2_telf_1: this.dataForm.controls.ref2_telf_1.value,
      ref2_telf_2: this.dataForm.controls.ref2_telf_2.value,
      trabajo_tipo_actividad: this.dataForm.get('trabajo_tipo_actividad').value,
      trabajo_ruc: this.dataForm.controls.trabajo_ruc.value,
      trabajo_nombre: this.dataForm.controls.trabajo_nombre.value,
      trabajo_provincia: this.dataForm.controls.trabajo_provincia.value,
      trabajo_canton: this.dataForm.controls.trabajo_canton.value,
      trabajo_parroquia: this.dataForm.controls.trabajo_parroquia.value,
      trabajo_barrio: this.dataForm.controls.trabajo_barrio.value,
      trabajo_direccion: this.dataForm.controls.trabajo_direccion.value,
      trabajo_numero: this.dataForm.controls.trabajo_numero.value,
      trabajo_calle_transversal:
        this.dataForm.controls.trabajo_calle_transversal.value,
      trabajo_ref_ubicacion: this.dataForm.controls.trabajo_ref_ubicacion.value,
      trabajo_telefono: this.dataForm.controls.trabajo_telefono.value,
      trabajo_antiguedad: this.dataForm.controls.trabajo_antiguedad.value,
      imagen_files: this.photoService.photosBase64,
    };

    console.dir(postData);

    if (postData.cliente_cedula && postData.cliente_cedula != undefined) {
      if (this.status) {
        const url = `${environment.apiUrl}refinanciamiento.php?op=postDatosRefi`;

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

  handleChange(event: Event) {}

  redirect() {
    // this.navCtrl.navigateForward('home/listing');
    this.navCtrl.navigateRoot('/home/listing', {
      animated: true,
      animationDirection: 'forward',
    });
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: RefiModalMapPage,
    });
    await modal.present();
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
