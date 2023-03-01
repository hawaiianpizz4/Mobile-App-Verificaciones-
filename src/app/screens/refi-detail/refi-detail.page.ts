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

  dataForm: FormGroup;
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

    const postData = {
      refi_usuario: this.dataForm.controls.refi_usuario.value,
      refi_fecha: this.dataForm.controls.refi_fecha.value,
      refi_operacion: this.dataForm.controls.refi_operacion.value,
      refi_autorizacion: this.dataForm.controls.refi_autorizacion.value,
      refi_autorizacion_original: this.dataForm.controls.refi_autorizacion_original.value,
      refi_plazo: this.dataForm.controls.refi_plazo.value,
      refi_valor_cuota: this.dataForm.get('refi_valor_cuota').value,
      refi_pago_gastos_admin: this.dataForm.controls.refi_pago_gastos_admin.value,
      refi_total_reest: this.dataForm.controls.refi_total_reest.value,
      refi_total_pagar: this.dataForm.controls.refi_total_pagar.value,
      cliente_cedula: this.dataForm.controls.cliente_cedula.value,
      cliente_nombres: this.dataForm.controls.cliente_nombres.value,
      cliente_nacionalidad: this.dataForm.controls.cliente_nacionalidad.value,
      cliente_ciudad_nacimiento: this.dataForm.controls.cliente_ciudad_nacimiento.value,
      cliente_fecha_nacimiento: this.dataForm.controls.cliente_fecha_nacimiento.value,
      // cliente_sexo: this.dataForm.controls.cliente_sexo.value,
      cliente_sexo: this.dataForm.get('cliente_sexo').value,
      cliente_nivel_educativo: this.dataForm.get('cliente_nivel_educativo').value,
      cliente_profesion: this.dataForm.controls.cliente_profesion.value,
      cliente_estado_civil: this.dataForm.get('cliente_estado_civil').value,
      cliente_numero_dependientes: this.dataForm.controls.cliente_numero_dependientes.value,
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
      conyuge_nombre_empresa: this.dataForm.controls.conyuge_nombre_empresa.value,
      conyuge_actividad_empresa: this.dataForm.controls.conyuge_actividad_empresa.value,
      conyuge_cargo: this.dataForm.controls.conyuge_cargo.value,
      conyuge_telefono_empresa: this.dataForm.controls.conyuge_telefono_empresa.value,
      conyuge_ingresos_mensuales: this.dataForm.controls.conyuge_ingresos_mensuales.value,
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
      trabajo_calle_transversal: this.dataForm.controls.trabajo_calle_transversal.value,
      trabajo_ref_ubicacion: this.dataForm.controls.trabajo_ref_ubicacion.value,
      trabajo_telefono: this.dataForm.controls.trabajo_telefono.value,
      trabajo_antiguedad: this.dataForm.controls.trabajo_antiguedad.value,
      imagen_files: this.photoService.photosBase64,
    };

    console.dir(postData);

    if (postData.cliente_cedula && postData.cliente_cedula != undefined) {
      if (this.networkStatus) {
        const url = `${environment.apiUrl}refinanciamiento.php?opcion=postDatosRefi`;

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
          }, 3000);
          console.log(error);
        }

        setTimeout(() => {
          presentToast('Registro Enviado', 'checkmark-outline', 'success');
          this.redirect();
        }, 3000);
      } else {
        var dataInLocalStorage = localStorage.getItem('refi-storageWait');
        var local = [];
        if (dataInLocalStorage) {
          local = Array.from(JSON.parse(dataInLocalStorage));
          local.push(JSON.stringify(postData));
          localStorage.setItem('refi-storageWait', JSON.stringify(local));
          this.showLoading('Guardando registro para ser enviado');
          setTimeout(() => {
            presentToast('Registro Guardado', 'checkmark-outline', 'success');
          }, 3000);
        } else {
          var insert = Array.from(JSON.stringify(postData));
          console.log('here');
          insert.push(JSON.stringify(postData));
          localStorage.setItem('refi-storageWait', JSON.stringify(insert));
          this.showLoading('Guardando registro para ser enviado');
          setTimeout(() => {
            presentToast('Registro Guardado', 'checkmark-outline', 'success');
            this.redirect();
          }, 3000);
        }
      }
    } else {
      presentToast('No debe existir campos vacios', 'alert', 'warning');
    }
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

        this.dataForm.controls.dir_latitud.setValue(lngLat.lat);
        this.dataForm.controls.dir_longitud.setValue(lngLat.lng);
        this.dataForm.controls.dir_longitud.setValue(lngLat.lng);
        this.dataForm.controls.dir_longitud.setValue(lngLat.lng);

        this.dataForm.controls.dir_direccion.setValue(data.features[0].place_name);
        this.dataForm.controls.dir_canton_ciudad.setValue(data.features[0].context[1].text);
        this.dataForm.controls.dir_provincia.setValue(data.features[0].context[2].text);
      },
      (error) => {
        presentToast('Error al crear marcador!', '', 'error');
        console.dir(error);
      }
    );
  }

  createDataForm() {
    const VALIDATOR_REQUIRED = [Validators.required];

    this.dataForm = new FormGroup({
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

    this.dataForm.controls.refi_fecha.setValue(this.currentDate);
    this.dataForm.controls.refi_operacion.setValue(this.operacion);
    this.dataForm.controls.refi_usuario.setValue(this.nombreUsuario);
    this.dataForm.controls.cliente_cedula.setValue(this.idCliente);
  }

  loadMineDataInForm() {
    this.dataForm.controls.cliente_nombres.setValue(this.datosSolicitudCliente['nombres']);
    this.dataForm.controls.cliente_nacionalidad.setValue(this.datosSolicitudCliente['nacionalidad']);
    this.dataForm.controls.cliente_fecha_nacimiento.setValue(this.datosSolicitudCliente['fecha_naci']);
    this.dataForm.controls.cliente_sexo.setValue(this.datosSolicitudCliente['des_sexo']);
    this.dataForm.controls.cliente_profesion.setValue(this.datosSolicitudCliente['des_profes']);
    this.dataForm.controls.cliente_estado_civil.setValue(this.datosSolicitudCliente['estado_civ']);
    this.dataForm.controls.cliente_numero_dependientes.setValue(this.datosSolicitudCliente['num_hijos']);
    this.dataForm.controls.cliente_nivel_educativo.setValue(this.datosSolicitudCliente['nivel_instruccion']);

    this.dataForm.controls.dir_provincia.setValue(this.datosSolicitudCliente['cod_prov_dom']);
    this.dataForm.controls.dir_canton_ciudad.setValue(this.datosSolicitudCliente['cod_cant_dom']);
    this.dataForm.controls.dir_parroquia.setValue(this.datosSolicitudCliente['cod_parr_dom']);
    this.dataForm.controls.dir_tipo_vivienda.setValue(this.datosSolicitudCliente['tipo_vivienda']);

    this.dataForm.controls.trabajo_nombre.setValue(this.datosSolicitudCliente['nombre_empresa_titular']);
    this.dataForm.controls.trabajo_provincia.setValue(this.datosSolicitudCliente['cod_prov_trabajo_titular']);
    this.dataForm.controls.trabajo_canton.setValue(this.datosSolicitudCliente['cod_cant_trabajo_titular']);
    this.dataForm.controls.trabajo_parroquia.setValue(this.datosSolicitudCliente['cod_parr_trabajo_titular']);
    this.dataForm.controls.trabajo_antiguedad.setValue(this.datosSolicitudCliente['antiguedad_lab']);

    this.dataForm.controls.trabajo_tipo_actividad.setValue(this.datosSolicitudCliente['relacion_dependencia']);
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
    let valor = String(this.dataForm.get('cliente_estado_civil').value);

    console.log(valor);
    if (valor == 'S' || valor == 'D' || valor == 'V') {
      this.dataForm.controls.conyuge_cedula.disable();
      this.dataForm.controls.conyuge_nombres.disable();
      this.dataForm.controls.conyuge_email.disable();
      this.dataForm.controls.conyuge_telf_1.disable();
      this.dataForm.controls.conyuge_telf_2.disable();
      this.dataForm.controls.conyuge_tipo_actividad.disable();
      this.dataForm.controls.conyuge_nombre_empresa.disable();
      this.dataForm.controls.conyuge_actividad_empresa.disable();
      this.dataForm.controls.conyuge_cargo.disable();
      this.dataForm.controls.conyuge_telefono_empresa.disable();
      this.dataForm.controls.conyuge_ingresos_mensuales.disable();
    } else {
      this.dataForm.controls.conyuge_cedula.enable();
      this.dataForm.controls.conyuge_nombres.enable();
      this.dataForm.controls.conyuge_email.enable();
      this.dataForm.controls.conyuge_telf_1.enable();
      this.dataForm.controls.conyuge_telf_2.enable();
      this.dataForm.controls.conyuge_tipo_actividad.enable();
      this.dataForm.controls.conyuge_nombre_empresa.enable();
      this.dataForm.controls.conyuge_actividad_empresa.enable();
      this.dataForm.controls.conyuge_cargo.enable();
      this.dataForm.controls.conyuge_telefono_empresa.enable();
      this.dataForm.controls.conyuge_ingresos_mensuales.enable();
    }
  }

  onTipoActividadConyugeSelected() {
    let valor = String(this.dataForm.get('conyuge_tipo_actividad').value);

    console.log(valor);
    if (valor == 'CES') {
      this.dataForm.controls.conyuge_nombre_empresa.disable();
      this.dataForm.controls.conyuge_actividad_empresa.disable();
      this.dataForm.controls.conyuge_cargo.disable();
      this.dataForm.controls.conyuge_telefono_empresa.disable();
      this.dataForm.controls.conyuge_ingresos_mensuales.disable();
    } else {
      this.dataForm.controls.conyuge_nombre_empresa.enable();
      this.dataForm.controls.conyuge_actividad_empresa.enable();
      this.dataForm.controls.conyuge_cargo.enable();
      this.dataForm.controls.conyuge_telefono_empresa.enable();
      this.dataForm.controls.conyuge_ingresos_mensuales.enable();
    }
  }

  onTipoViviendaChanged() {
    let valor = String(this.dataForm.get('dir_tipo_vivienda').value);

    console.log(valor);
    if (valor == 'P') {
      this.dataForm.controls.dir_nombre_arrendador.disable();
      this.dataForm.controls.dir_telf_arrendador.disable();
    } else {
      this.dataForm.controls.dir_nombre_arrendador.enable();
      this.dataForm.controls.dir_telf_arrendador.enable();
    }
  }

  onTipoActividadChange() {
    let valor = String(this.dataForm.get('trabajo_tipo_actividad').value);

    console.log(valor);
    if (valor == 'CES') {
      this.dataForm.controls.trabajo_ruc.disable();
      this.dataForm.controls.trabajo_nombre.disable();
      this.dataForm.controls.trabajo_provincia.disable();
      this.dataForm.controls.trabajo_canton.disable();
      this.dataForm.controls.trabajo_parroquia.disable();
      this.dataForm.controls.trabajo_barrio.disable();
      this.dataForm.controls.trabajo_direccion.disable();
      this.dataForm.controls.trabajo_numero.disable();
      this.dataForm.controls.trabajo_calle_transversal.disable();
      this.dataForm.controls.trabajo_ref_ubicacion.disable();
      this.dataForm.controls.trabajo_telefono.disable();
      this.dataForm.controls.trabajo_antiguedad.disable();
    } else {
      this.dataForm.controls.trabajo_ruc.enable();
      this.dataForm.controls.trabajo_nombre.enable();
      this.dataForm.controls.trabajo_provincia.enable();
      this.dataForm.controls.trabajo_canton.enable();
      this.dataForm.controls.trabajo_parroquia.enable();
      this.dataForm.controls.trabajo_barrio.enable();
      this.dataForm.controls.trabajo_direccion.enable();
      this.dataForm.controls.trabajo_numero.enable();
      this.dataForm.controls.trabajo_calle_transversal.enable();
      this.dataForm.controls.trabajo_ref_ubicacion.enable();
      this.dataForm.controls.trabajo_telefono.enable();
      this.dataForm.controls.trabajo_antiguedad.enable();
    }
  }
}
