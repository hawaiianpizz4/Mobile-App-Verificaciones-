

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, NgZone, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController, LoadingController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Network } from '@capacitor/network';
import { PhotoService } from '../../services/photoVerificacion.service';
import { dataService } from 'src/app/services/data.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { presentToast } from 'src/app/utils/Utils';
const url = `${environment.apiUrl}verificacion.php?opcion=setClienteVerificado`;

@Component({
  selector: 'app-verificacion',
  templateUrl: './verificacion.page.html',
  styleUrls: ['./verificacion.page.scss'],
})
export class VerificacionPage implements OnInit {
  @Input() item;

  isPlanillaDisabled: boolean = true;
  isVecinoDisabled: boolean = true;

  //IMAGENES
  btnEstabilidadEnabled: boolean = false;
  btnFacturasEnabled: boolean = false;
  btnExteriorEnabled: boolean = false;
  btnInteriorEnabled: boolean = false;
  btnClienteExteriorEnabled: boolean = false;
  btnClienteInteriorEnabled: boolean = false;
  btnTituloEnabled: boolean = false;
  btnImpuestoEnabled: boolean = false;
  btnRespaldoEnabled: boolean = false;
  btnCertificadoEnabled: boolean = false;
  btnInteriorDomEnabled: boolean = false;

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
    fecha_actual: new FormControl({ value: new Date().toUTCString(), disabled: true }, []),
    nombre_tienda: new FormControl('', []),
    nombre_cliente: new FormControl('', []),
    numero_cedula: new FormControl('', []),
    direccion_cliente: new FormControl('', []),
    tipo_vivienda: new FormControl('', []),
    persona_verificacion: new FormControl('', []),
    residencia_minima: new FormControl('', []),
    localTerreno_propio: new FormControl('', []),
    localTerreno_arrendado: new FormControl('', []),
    tipo_usuario: new FormControl('', []),

    planilla_servicios: new FormControl('', []),
    puertas_ventanas: new FormControl('', []),
    muebleria_basica: new FormControl('', []),
    material_casa: new FormControl('', []),
    periodicidad_actividades: new FormControl('', []),

    vecino_confirma: new FormControl('', []),
    vecino_nombre: new FormControl('', [Validators.required]),
    vecino_celular: new FormControl('', [Validators.required]),

    //imagene

    codigo: new FormControl({ value: '', disabled: true }, []),
    latitud: new FormControl({ value: '', disabled: true }, []),
    longitud: new FormControl({ value: '', disabled: true }, []),
  });

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private ngZone: NgZone,
    private _http: HttpClient,
    public photoService: PhotoService,
    private _services: dataService
  ) {
    // this.changeStatus();
  }

  handleUserTypeChange() {
    this.deshabilitarBotones();

    const userType = this.dataForm.get('tipo_usuario').value;

    if (userType === 'DEPENDIENTE') {
      this.btnEstabilidadEnabled = true;
      this.btnFacturasEnabled = true;
      this.btnExteriorEnabled = true;
      this.btnInteriorEnabled = true;
      this.btnClienteExteriorEnabled = true;
      this.btnClienteInteriorEnabled = true;
      this.btnTituloEnabled = true;
      this.btnImpuestoEnabled = true;
      this.btnRespaldoEnabled = true;
      this.btnCertificadoEnabled = true;
    } else if (userType === 'INDEPENDIENTE') {
      this.btnFacturasEnabled = true;
      this.btnExteriorEnabled = true;
      this.btnInteriorEnabled = true;
      this.btnClienteExteriorEnabled = true;
      this.btnClienteInteriorEnabled = true;
      this.btnTituloEnabled = true;
      this.btnImpuestoEnabled = true;
      this.btnRespaldoEnabled = true;
      this.btnCertificadoEnabled = true;
      this.btnInteriorDomEnabled = true;
    } else userType === 'INFORMAL';
    {
      this.btnFacturasEnabled = true;
      this.btnExteriorEnabled = true;
      this.btnInteriorEnabled = true;
      this.btnClienteExteriorEnabled = true;
      this.btnClienteInteriorEnabled = true;
      this.btnTituloEnabled = true;
      this.btnImpuestoEnabled = true;
      this.btnRespaldoEnabled = true;
    }
  }

  deshabilitarBotones() {
    this.btnEstabilidadEnabled = false;
    this.btnFacturasEnabled = false;
    this.btnExteriorEnabled = false;
    this.btnInteriorEnabled = false;
    this.btnClienteExteriorEnabled = false;
    this.btnClienteInteriorEnabled = false;
    this.btnTituloEnabled = false;
    this.btnImpuestoEnabled = false;
    this.btnRespaldoEnabled = false;
    this.btnCertificadoEnabled = false;
    this.btnInteriorDomEnabled = false;
  }

  async getCodigoSMS(numeroTelf) {
    let codigo = null;
    // create a new loading controller instance
    this.isServiceCallInProgress = await this.loadingCtrl.create({
      message: 'Cargando Datos de Cliente...',
      spinner: 'bubbles',
      duration: 10000, // set a timeout of 5 seconds (5000 milliseconds)
    });
    // present the loading controller
    await this.isServiceCallInProgress.present();

    try {
      this._services.getSmsCode(numeroTelf).subscribe(
        (data) => {
          codigo = data[0]['datos'];
          console.log(codigo);
          console.log(numeroTelf);
          this.dataForm.controls.codigo.setValue(codigo);
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

    return codigo;
  }

  async ngOnInit() {
    this.deshabilitarBotones();
    let numCelular = this.activatedRoute.snapshot.paramMap.get('dndlN_telefonocelular');
    this.getCurrentCoordinates();
    this.photoService.limpiarImagenes();
    this.dataForm.controls.nombre_gestor.setValue(localStorage.getItem('user').replace(/"/g, ''));
    this.dataForm.controls.nombre_tienda.setValue(this.activatedRoute.snapshot.paramMap.get('vf_nombre_tienda'));
    this.dataForm.controls.nombre_cliente.setValue(this.activatedRoute.snapshot.paramMap.get('vf_nombre_cliente'));
    this.dataForm.controls.numero_cedula.setValue(this.activatedRoute.snapshot.paramMap.get('vf_cedula_cliente'));
    this.dataForm.controls.direccion_cliente.setValue(this.activatedRoute.snapshot.paramMap.get('dndlD_direccion_domiciliaria'));

    console.log(this.item);

    Network.addListener('networkStatusChange', (status) => {
      this.ngZone.run(() => {
        this.changeStatus();
      });
    });

    this.changeStatus();
    await this.getCodigoSMS(numCelular);
  }

  async submitForm() {
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

  async changeStatus() {
    const status = await Network.getStatus();
    this.networkStatus = status?.connected;
    this.networkStatus ? presentToast('Conectado', 'wifi-outline', 'success') : presentToast('Sin conexion', 'globe-outline', 'warning');
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

  onPlanillaSelected() {
    let valorPlanilla = String(this.dataForm.get('planilla_servicios').value);

    this.isPlanillaDisabled = true;

    if (valorPlanilla == 'si') this.isPlanillaDisabled = false;
  }

  onVecinoConfirmaChange() {
    let valorVecino = String(this.dataForm.get('vecino_confirma').value);
    console.log(valorVecino);
    this.isVecinoDisabled = true;

    if (valorVecino == 'si') this.isVecinoDisabled = false;
  }

  validatePhoneNumber(event: any) {
    const input = event.target as HTMLInputElement;
    let phoneNumber = input.value.replace(/\D/g, ''); // Remueve los caracteres no numéricos
    if (phoneNumber.length > 10) {
      phoneNumber = phoneNumber.substr(0, 10); // Limita el número de caracteres a 10
    }
    this.dataForm.get('vecino_celular').setValue(phoneNumber);
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

  private loadPostData() {
    return {
      cedulaCliente: this.dataForm.controls.numero_cedula.value,
      nombreCliente: this.dataForm.controls.nombre_cliente.value,
      // codigoVerificacion: this.dataForm.controls.codigo.value,
      codigoVerificacion: 10,
      direccionDomiciliaria: this.dataForm.controls.direccion_cliente.value,
      //vivienda
      tipoVivienda: this.dataForm.get('tipo_vivienda').value,
      personaQuienRealizaLaVerificacion: this.dataForm.get('persona_verificacion').value,
      residenciaMinimaTresMeses: this.dataForm.controls.residencia_minima.value,
      localTerrenoPropio: this.dataForm.controls.localTerreno_propio.value,
      localTerrenoArrendado: this.dataForm.controls.localTerreno_arrendado.value,
      //tipo_usuario: this.dataForm.controls.tipo_usuario.value,

      //servicios
      planillaServicioBasico: this.dataForm.controls.planilla_servicios.value,
      planillaServicioBasicoImagen: this.photoService.photosPlanilla64,
      seguridadPuertasVentanas: this.dataForm.get('puertas_ventanas').value,
      muebleriaBasica: this.dataForm.get('muebleria_basica').value,
      materialCasa: this.dataForm.get('material_casa').value,
      periodicidadActividadesLaborales: this.dataForm.controls.periodicidad_actividades.value,
      //acordeon confimacion vecino
      confirmacionInfoVecinos: this.dataForm.controls.vecino_confirma.value,
      nombreInfoVecino: this.dataForm.controls.vecino_nombre.value,
      celularInfoVecino: this.dataForm.controls.vecino_celular.value,

      //imagenes

      estabilidadLaboraSeisMesesImagen: this.photoService.photosEstabilidad64,
      facturasProveedoresUltimosTresMesesImagen: this.photoService.photosFacturas64,
      fachadaDelNegocioImagen: this.photoService.photosExterior64,
      interiorDelNegocioImagen: this.photoService.photosInterior64,
      clienteFueraDelNegocioImagen: this.photoService.photosClienteExterior64,
      clienteDentroDelNegocioImagen: this.photoService.photosClienteInterior64,
      tituloPropiedaGaranteOCodeudorImagen: this.photoService.photosTitulo64,
      impuestoPredialImagen: this.photoService.photosImpuesto64,
      respaldoIngresosImagen: this.photoService.photosRespaldo64,
      certificadoLaboralImagen: this.photoService.photosCertificado64,
      interiorDomicilioImagen: this.photoService.photosInteriorDom64,

      //latitud
      latitud: this.dataForm.controls.latitud.value,
      longitud: this.dataForm.controls.longitud.value,
      vf_nombre_tienda: this.dataForm.controls.nombre_tienda.value,
      nombreGestor: this.dataForm.controls.nombre_gestor.value,
    };
  }
}
