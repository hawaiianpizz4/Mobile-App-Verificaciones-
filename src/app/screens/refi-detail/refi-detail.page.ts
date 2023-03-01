import mapboxgl from 'mapbox-gl/';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController, ToastController, LoadingController, IonAccordion } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@capacitor/network';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PhotoService } from '../../services/photo.service';
import { RefiModalMapPage } from 'src/app/components/refi-modal-map/refi-modal-map.page';
import { dataService } from 'src/app/services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { getCurrentCoordinates, presentToast } from 'src/app/utils/utils';
import { iCurrentLocation } from 'src/interfaces/currentLocation.interface';
const url = `${environment.apiUrl}refinanciamiento.php?opcion=postformData`;

@Component({
  selector: 'app-refi-detail',
  templateUrl: './refi-detail.page.html',
  styleUrls: ['./refi-detail.page.scss'],
})
export class RefiDetailPage implements OnInit {
  map: mapboxgl;

  currentLocation: iCurrentLocation;

  datosSolicitudCliente = [];

  idCliente: string;
  operacion: string;
  nombreUsuario: string;
  selectedDatePrimerPago: string;
  currentDate: string = new Date().toLocaleString();

  formData: FormGroup;
  postInfoCliente: Observable<any>;

  isServiceCallInProgress: any;
  networkStatus: boolean;

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
    this.createDataForm();
  }

  async ngOnInit() {
    this.currentLocation = await getCurrentCoordinates();
    console.dir(this.currentLocation);
    this.initMap();

    this.photoService.resetPhotos();

    this.cargarDatosDesdeLista();

    await this.getDatosCliente();

    this.checkDatosCargados();

    console.log(`${this.idCliente} - ${this.operacion} - ${this.currentDate}`);
    Network.addListener('networkStatusChange', (status) => {
      this.ngZone.run(() => {
        this.changeStatus();
      });
    });
  }

  async IonViewDidLeave() {
    this.photoService.limpiarImagenes();
  }

  checkDatosCargados() {
    if (!this.datosSolicitudCliente) {
      presentToast('El usuario no se pudo encontrar', 'Error', 'warning');
      this.redirect();
    }
  }

  async getDatosCliente() {
    // create a new loading controller instance
    this.isServiceCallInProgress = await this.loadingCtrl.create({
      message: 'Cargando Datos de Cliente...',
      spinner: 'bubbles',
      duration: 10000, // set a timeout of 5 seconds (5000 milliseconds)
    });
    // present the loading controller
    await this.isServiceCallInProgress.present();

    try {
      this._services.getDatosCliente(this.idCliente).subscribe(
        (data) => {
          console.log(data[0]);
          this.datosSolicitudCliente = data[0];
          this.loadMineDataInForm();
          this.isServiceCallInProgress.dismiss();
        },
        (error) => {
          console.log(error);
          presentToast('Error al obtener datos del cliente.', 'checkmark-outline', 'danger');
          this.isServiceCallInProgress.dismiss();
        }
      );
    } catch (error) {
      presentToast('Error al enviar datos', 'checkmark-outline', 'danger');
      this.isServiceCallInProgress.dismiss();
    }
  }

  async submitForm(e) {
    // create a new loading controller instance
    this.isServiceCallInProgress = await this.loadingCtrl.create({
      message: 'Enviando actualización de datos...',
      spinner: 'bubbles',
    });
    // present the loading controller
    await this.isServiceCallInProgress.present();
    const postData = this.loadPostData();

    console.dir(postData);

    if (this.networkStatus) {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      };

      try {
        await this._http.post(url, JSON.stringify(postData), httpOptions).toPromise();
        this.isServiceCallInProgress.dismiss();
        this.redirect();
        setTimeout(() => {
          presentToast('Registro Enviado', 'checkmark-outline', 'success');
          this.redirect();
        }, 1000);
      } catch (error) {
        this.isServiceCallInProgress.dismiss();
        setTimeout(() => {
          presentToast('Error al enviar registro', 'checkmark-outline', 'success');
          this.redirect();
        }, 1000);
        console.log(error);
      }

      setTimeout(() => {
        presentToast('Registro Enviado', 'checkmark-outline', 'success');
        this.redirect();
      }, 1000);
    } else {
      setTimeout(() => {
        presentToast('Error, No hay conexión a internet', 'checkmark-outline', 'success');
        this.redirect();
      }, 1000);
    }
  }

  loadPostData() {
    return {
      refi_usuario: this.formData.controls.refi_usuario.value,
      refi_fecha: this.formData.controls.refi_fecha.value,
      refi_operacion: this.formData.controls.refi_operacion.value,
      refi_autorizacion: this.formData.controls.refi_autorizacion.value,
      refi_autorizacion_original: this.formData.controls.refi_autorizacion_original.value,
      refi_plazo: this.formData.controls.refi_plazo.value,
      refi_valor_cuota: this.formData.get('refi_valor_cuota').value,
      refi_pago_gastos_admin: this.formData.controls.refi_pago_gastos_admin.value,
      refi_total_reest: this.formData.controls.refi_total_reest.value,
      refi_total_pagar: this.formData.controls.refi_total_pagar.value,
      cliente_cedula: this.formData.controls.cliente_cedula.value,
      cliente_nombres: this.formData.controls.cliente_nombres.value,
      cliente_nacionalidad: this.formData.controls.cliente_nacionalidad.value,
      cliente_ciudad_nacimiento: this.formData.controls.cliente_ciudad_nacimiento.value,
      cliente_fecha_nacimiento: this.formData.controls.cliente_fecha_nacimiento.value,
      // cliente_sexo: this.dataForm.controls.cliente_sexo.value,
      cliente_sexo: this.formData.get('cliente_sexo').value,
      cliente_nivel_educativo: this.formData.get('cliente_nivel_educativo').value,
      cliente_profesion: this.formData.controls.cliente_profesion.value,
      cliente_estado_civil: this.formData.get('cliente_estado_civil').value,
      cliente_numero_dependientes: this.formData.controls.cliente_numero_dependientes.value,
      dir_direccion_exacta: this.formData.controls.dir_direccion_exacta.value,
      dir_provincia: this.formData.controls.dir_provincia.value,
      dir_canton_ciudad: this.formData.controls.dir_canton_ciudad.value,
      dir_parroquia: this.formData.controls.dir_parroquia.value,
      dir_direccion: this.formData.controls.dir_direccion.value,
      dir_calle_transversal: this.formData.controls.dir_calle_transversal.value,
      dir_numero: this.formData.controls.dir_numero.value,
      dir_latitud: this.formData.controls.dir_latitud.value,
      dir_longitud: this.formData.controls.dir_longitud.value,
      dir_referencia: this.formData.controls.dir_referencia.value,
      dir_tipo_vivienda: this.formData.get('dir_tipo_vivienda').value,
      dir_tiempo: this.formData.controls.dir_tiempo.value,
      dir_telf_1: this.formData.controls.dir_telf_1.value,
      dir_telf_2: this.formData.controls.dir_telf_2.value,
      dir_email: this.formData.controls.dir_email.value,
      dir_nombre_arrendador: this.formData.controls.dir_nombre_arrendador.value,
      dir_telf_arrendador: this.formData.controls.dir_telf_arrendador.value,
      conyuge_cedula: this.formData.controls.conyuge_cedula.value,
      conyuge_nombres: this.formData.controls.conyuge_nombres.value,
      conyuge_email: this.formData.controls.conyuge_email.value,
      conyuge_telf_1: this.formData.controls.conyuge_telf_1.value,
      conyuge_telf_2: this.formData.controls.conyuge_telf_2.value,
      conyuge_tipo_actividad: this.formData.get('conyuge_tipo_actividad').value,
      conyuge_nombre_empresa: this.formData.controls.conyuge_nombre_empresa.value,
      conyuge_actividad_empresa: this.formData.controls.conyuge_actividad_empresa.value,
      conyuge_cargo: this.formData.controls.conyuge_cargo.value,
      conyuge_telefono_empresa: this.formData.controls.conyuge_telefono_empresa.value,
      conyuge_ingresos_mensuales: this.formData.controls.conyuge_ingresos_mensuales.value,
      ref1_nombres: this.formData.controls.ref1_nombres.value,
      ref1_parentesco: this.formData.controls.ref1_parentesco.value,
      ref1_telf_1: this.formData.controls.ref1_telf_1.value,
      ref1_telf_2: this.formData.controls.ref1_telf_2.value,
      ref2_nombres: this.formData.controls.ref2_nombres.value,
      ref2_parentesco: this.formData.controls.ref2_parentesco.value,
      ref2_telf_1: this.formData.controls.ref2_telf_1.value,
      ref2_telf_2: this.formData.controls.ref2_telf_2.value,
      trabajo_tipo_actividad: this.formData.get('trabajo_tipo_actividad').value,
      trabajo_ruc: this.formData.controls.trabajo_ruc.value,
      trabajo_nombre: this.formData.controls.trabajo_nombre.value,
      trabajo_provincia: this.formData.controls.trabajo_provincia.value,
      trabajo_canton: this.formData.controls.trabajo_canton.value,
      trabajo_parroquia: this.formData.controls.trabajo_parroquia.value,
      trabajo_barrio: this.formData.controls.trabajo_barrio.value,
      trabajo_direccion: this.formData.controls.trabajo_direccion.value,
      trabajo_numero: this.formData.controls.trabajo_numero.value,
      trabajo_calle_transversal: this.formData.controls.trabajo_calle_transversal.value,
      trabajo_ref_ubicacion: this.formData.controls.trabajo_ref_ubicacion.value,
      trabajo_telefono: this.formData.controls.trabajo_telefono.value,
      trabajo_antiguedad: this.formData.controls.trabajo_antiguedad.value,
      imagen_files: this.photoService.photosBase64,
    };
  }

  initMap() {
    console.log(this.currentLocation);
    mapboxgl.accessToken = 'pk.eyJ1IjoianF1aWxjaGFtaW4iLCJhIjoiY2xkdzJiaTN4MDM5NjNvbnV4eTI5MmV0MCJ9.xkxeH8IUvBcUTyHOLEORJg';
    this.map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      // center: [this.currentLocation.longitude, this.currentLocation.latitude],
      center: [-78.47748161030977, -0.12763545952685718],

      zoom: 20,
    });
    // Add the control to the map.
    this.map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
      })
    );

    this.map.on('idle', function () {
      this.resize();
    });

    // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({ draggable: true })
      // .setLngLat([this.currentLocation.longitude, this.currentLocation.latitude])
      .setLngLat([-78.47748161030977, -0.12763545952685718])
      .addTo(this.map);

    marker.on('dragend', () => {
      //mostrar coordenadas
      // const features = this.map.queryRenderedFeatures(marker._pos);
      this.crearMarker(marker);
    });
  }

  crearMarker(marker: mapboxgl.Marker) {
    const lngLat = marker.getLngLat();

    this._services.getCurrentPoss(lngLat.lng, lngLat.lat, mapboxgl.accessToken).subscribe(
      (data) => {
        console.dir(data);
        console.dir(data.features[0].context[1].text);

        this.formData.controls.dir_latitud.setValue(lngLat.lat);
        this.formData.controls.dir_longitud.setValue(lngLat.lng);
        this.formData.controls.dir_longitud.setValue(lngLat.lng);
        this.formData.controls.dir_longitud.setValue(lngLat.lng);

        this.formData.controls.dir_direccion.setValue(data.features[0].place_name);
        this.formData.controls.dir_canton_ciudad.setValue(data.features[0].context[1].text);
        this.formData.controls.dir_provincia.setValue(data.features[0].context[2].text);
      },
      (error) => {
        presentToast('Error al crear marcador!', '', 'error');
        console.dir(error);
      }
    );
  }

  createDataForm() {
    const VALIDATOR_REQUIRED = [Validators.required];

    this.formData = new FormGroup({
      refi_fecha: new FormControl({ value: this.currentDate, disabled: true }, []),
      refi_usuario: new FormControl({ value: this.nombreUsuario, disabled: true }, []),
      refi_operacion: new FormControl({ value: this.operacion, disabled: true }, []),
      refi_autorizacion: new FormControl('', VALIDATOR_REQUIRED),
      refi_autorizacion_original: new FormControl('', VALIDATOR_REQUIRED),
      refi_plazo: new FormControl('', VALIDATOR_REQUIRED),
      refi_valor_cuota: new FormControl('', VALIDATOR_REQUIRED),
      refi_pago_gastos_admin: new FormControl('', VALIDATOR_REQUIRED),
      refi_total_reest: new FormControl('', VALIDATOR_REQUIRED),
      refi_total_pagar: new FormControl('', VALIDATOR_REQUIRED),
      cliente_cedula: new FormControl(this.idCliente, VALIDATOR_REQUIRED),
      cliente_nombres: new FormControl('', VALIDATOR_REQUIRED),
      cliente_nacionalidad: new FormControl('', VALIDATOR_REQUIRED),
      cliente_ciudad_nacimiento: new FormControl('', VALIDATOR_REQUIRED),
      cliente_fecha_nacimiento: new FormControl('', VALIDATOR_REQUIRED),
      cliente_sexo: new FormControl('', []),
      cliente_nivel_educativo: new FormControl('', []),
      cliente_profesion: new FormControl('', []),
      cliente_estado_civil: new FormControl('', []),
      cliente_numero_dependientes: new FormControl('', []),
      dir_direccion_exacta: new FormControl('', VALIDATOR_REQUIRED),
      dir_provincia: new FormControl('', VALIDATOR_REQUIRED),
      dir_canton_ciudad: new FormControl('', VALIDATOR_REQUIRED),
      dir_parroquia: new FormControl('', VALIDATOR_REQUIRED),
      dir_direccion: new FormControl('', VALIDATOR_REQUIRED),
      dir_calle_transversal: new FormControl('', VALIDATOR_REQUIRED),
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
  }

  cargarDatosDesdeLista() {
    this.nombreUsuario = JSON.parse(localStorage.getItem('user'));
    this.idCliente = this.activatedRoute.snapshot.paramMap.get('id');
    this.operacion = this.activatedRoute.snapshot.paramMap.get('operacion');

    this.formData.controls.refi_fecha.setValue(this.currentDate);
    this.formData.controls.refi_operacion.setValue(this.operacion);
    this.formData.controls.refi_usuario.setValue(this.nombreUsuario);
    this.formData.controls.cliente_cedula.setValue(this.idCliente);
  }

  loadMineDataInForm() {
    this.formData.controls.cliente_nombres.setValue(this.datosSolicitudCliente['nombres']);
    this.formData.controls.cliente_nacionalidad.setValue(this.datosSolicitudCliente['nacionalidad']);
    this.formData.controls.cliente_fecha_nacimiento.setValue(this.datosSolicitudCliente['fecha_naci']);
    this.formData.controls.cliente_sexo.setValue(this.datosSolicitudCliente['des_sexo']);
    this.formData.controls.cliente_profesion.setValue(this.datosSolicitudCliente['des_profes']);
    this.formData.controls.cliente_estado_civil.setValue(this.datosSolicitudCliente['estado_civ']);
    this.formData.controls.cliente_numero_dependientes.setValue(this.datosSolicitudCliente['num_hijos']);
    this.formData.controls.cliente_nivel_educativo.setValue(this.datosSolicitudCliente['nivel_instruccion']);

    this.formData.controls.dir_provincia.setValue(this.datosSolicitudCliente['cod_prov_dom']);
    this.formData.controls.dir_canton_ciudad.setValue(this.datosSolicitudCliente['cod_cant_dom']);
    this.formData.controls.dir_parroquia.setValue(this.datosSolicitudCliente['cod_parr_dom']);
    this.formData.controls.dir_tipo_vivienda.setValue(this.datosSolicitudCliente['tipo_vivienda']);

    this.formData.controls.trabajo_nombre.setValue(this.datosSolicitudCliente['nombre_empresa_titular']);
    this.formData.controls.trabajo_provincia.setValue(this.datosSolicitudCliente['cod_prov_trabajo_titular']);
    this.formData.controls.trabajo_canton.setValue(this.datosSolicitudCliente['cod_cant_trabajo_titular']);
    this.formData.controls.trabajo_parroquia.setValue(this.datosSolicitudCliente['cod_parr_trabajo_titular']);
    this.formData.controls.trabajo_antiguedad.setValue(this.datosSolicitudCliente['antiguedad_lab']);

    this.formData.controls.trabajo_tipo_actividad.setValue(this.datosSolicitudCliente['relacion_dependencia']);
  }

  async changeStatus() {
    const status = await Network.getStatus();
    this.networkStatus = status?.connected;
    this.networkStatus ? presentToast('Conectado', 'wifi-outline', 'success') : presentToast('Sin conexion', 'globe-outline', 'warning');
  }

  async showLoading(msg) {
    const loading = await this.loadingCtrl.create({
      message: msg,
    });
    return loading;
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }

  redirect() {
    // this.navCtrl.navigateForward('home/listing');
    this.navCtrl.navigateRoot('home/listing', {
      animated: true,
      animationDirection: 'forward',
    });
  }

  dateChangedPrimerPago(event) {
    console.dir(event.detail);
    this.selectedDatePrimerPago = event.detail.value;
  }

  onEstadoCivilSelected() {
    let valor = String(this.formData.get('cliente_estado_civil').value);

    console.log(valor);
    if (valor == 'S' || valor == 'D' || valor == 'V') {
      this.formData.controls.conyuge_cedula.disable();
      this.formData.controls.conyuge_nombres.disable();
      this.formData.controls.conyuge_email.disable();
      this.formData.controls.conyuge_telf_1.disable();
      this.formData.controls.conyuge_telf_2.disable();
      this.formData.controls.conyuge_tipo_actividad.disable();
      this.formData.controls.conyuge_nombre_empresa.disable();
      this.formData.controls.conyuge_actividad_empresa.disable();
      this.formData.controls.conyuge_cargo.disable();
      this.formData.controls.conyuge_telefono_empresa.disable();
      this.formData.controls.conyuge_ingresos_mensuales.disable();
    } else {
      this.formData.controls.conyuge_cedula.enable();
      this.formData.controls.conyuge_nombres.enable();
      this.formData.controls.conyuge_email.enable();
      this.formData.controls.conyuge_telf_1.enable();
      this.formData.controls.conyuge_telf_2.enable();
      this.formData.controls.conyuge_tipo_actividad.enable();
      this.formData.controls.conyuge_nombre_empresa.enable();
      this.formData.controls.conyuge_actividad_empresa.enable();
      this.formData.controls.conyuge_cargo.enable();
      this.formData.controls.conyuge_telefono_empresa.enable();
      this.formData.controls.conyuge_ingresos_mensuales.enable();
    }
  }

  onTipoActividadConyugeSelected() {
    let valor = String(this.formData.get('conyuge_tipo_actividad').value);

    console.log(valor);
    if (valor == 'CES') {
      this.formData.controls.conyuge_nombre_empresa.disable();
      this.formData.controls.conyuge_actividad_empresa.disable();
      this.formData.controls.conyuge_cargo.disable();
      this.formData.controls.conyuge_telefono_empresa.disable();
      this.formData.controls.conyuge_ingresos_mensuales.disable();
    } else {
      this.formData.controls.conyuge_nombre_empresa.enable();
      this.formData.controls.conyuge_actividad_empresa.enable();
      this.formData.controls.conyuge_cargo.enable();
      this.formData.controls.conyuge_telefono_empresa.enable();
      this.formData.controls.conyuge_ingresos_mensuales.enable();
    }
  }

  onTipoViviendaChanged() {
    let valor = String(this.formData.get('dir_tipo_vivienda').value);

    console.log(valor);
    if (valor == 'P') {
      this.formData.controls.dir_nombre_arrendador.disable();
      this.formData.controls.dir_telf_arrendador.disable();
    } else {
      this.formData.controls.dir_nombre_arrendador.enable();
      this.formData.controls.dir_telf_arrendador.enable();
    }
  }

  onTipoActividadChange() {
    let valor = String(this.formData.get('trabajo_tipo_actividad').value);

    console.log(valor);
    if (valor == 'CES') {
      this.formData.controls.trabajo_ruc.disable();
      this.formData.controls.trabajo_nombre.disable();
      this.formData.controls.trabajo_provincia.disable();
      this.formData.controls.trabajo_canton.disable();
      this.formData.controls.trabajo_parroquia.disable();
      this.formData.controls.trabajo_barrio.disable();
      this.formData.controls.trabajo_direccion.disable();
      this.formData.controls.trabajo_numero.disable();
      this.formData.controls.trabajo_calle_transversal.disable();
      this.formData.controls.trabajo_ref_ubicacion.disable();
      this.formData.controls.trabajo_telefono.disable();
      this.formData.controls.trabajo_antiguedad.disable();
    } else {
      this.formData.controls.trabajo_ruc.enable();
      this.formData.controls.trabajo_nombre.enable();
      this.formData.controls.trabajo_provincia.enable();
      this.formData.controls.trabajo_canton.enable();
      this.formData.controls.trabajo_parroquia.enable();
      this.formData.controls.trabajo_barrio.enable();
      this.formData.controls.trabajo_direccion.enable();
      this.formData.controls.trabajo_numero.enable();
      this.formData.controls.trabajo_calle_transversal.enable();
      this.formData.controls.trabajo_ref_ubicacion.enable();
      this.formData.controls.trabajo_telefono.enable();
      this.formData.controls.trabajo_antiguedad.enable();
    }
  }
}
