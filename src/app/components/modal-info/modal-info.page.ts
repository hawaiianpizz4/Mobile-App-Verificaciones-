import { HttpClient } from '@angular/common/http';
import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Network } from '@capacitor/network';
import { LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.page.html',
  styleUrls: ['./modal-info.page.scss'],
})
export class ModalInfoPage implements OnInit {
  @Input() cedula;
  @Input() operacion;
  @Input() gestor;
  PostUser: Observable<any>;
  latitude = 111.111;
  longitude = 1111.111;
  status: boolean;
  constructor(
    private modalCtrl: ModalController,
    private _http: HttpClient,
    private loadingCtrl: LoadingController,
    private geolocation: Geolocation,
    private toastController: ToastController,
    private ngZone: NgZone,
    private navCtrl: NavController
  ) {}
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
    this.status ? this.presentToast('Conectado', 'wifi-outline', 'success') : this.presentToast('Sin conexion', 'globe-outline', 'warning');
  }

  redirect() {
    this.navCtrl.navigateForward('home/listing');
  }
  exit() {
    this.modalCtrl.dismiss();
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
      position: 'bottom',
      icon: iconInsert,
      color: color,
    });

    await toast.present();
  }

  submitForm(e) {
    e.preventDefault();
    const { gestion, cobranza, observacion, contacto, lat, long, plazo, valorRe } = e.target;
    if (
      gestion.value &&
      gestion.value != undefined &&
      cobranza != undefined &&
      observacion.value &&
      observacion.value != undefined &&
      contacto.value &&
      contacto.value != undefined
    ) {
      if (this.status) {
        var plazoInsert, valorInsert;
        if (plazo && valorRe) {
          plazoInsert = plazo.value;
          valorInsert = valorRe.value;
        } else {
          plazoInsert = '0';
          valorInsert = '0';
        }
        var data = `{"cedula":"${this.cedula}","operacion":"${this.operacion}","gestion":"${gestion.value}","cobranza":"${cobranza.value}","observacion":"${observacion.value}","contacto":"${contacto.value}","plazoNuevo":${plazoInsert},"valorRenegocio":${valorInsert},"latitud":${lat.value},"longitud":${long.value},"gestor":"${this.gestor}"}`;
        const url = `http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/categoria.php?op=pull&data=${data}`;
        this.PostUser = this._http.get(url);
        this.PostUser.subscribe((data) => {
          this.showLoading('Enviando Registro...').then((e) => {});
        });
        setTimeout(() => {
          this.presentToast('Registro Enviado', 'checkmark-outline', 'success');
          this.redirect();
          this.exit();
        }, 3000);
      } else {
        var plazoInsert, valorInsert;
        if (plazo && valorRe) {
          plazoInsert = plazo.value;
          valorInsert = valorRe.value;
        } else {
          plazoInsert = '0';
          valorInsert = '0';
        }
        var data = `{"cedula":"${this.cedula}","operacion":"${this.operacion}","gestion":"${gestion.value}","cobranza":"${cobranza.value}","observacion":"${observacion.value}","contacto":"${contacto.value}","plazoNuevo":${plazoInsert},"valorRenegocio":${valorInsert},"latitud":${lat.value},"longitud":${long.value},"gestor":"${this.gestor}"}`;
        var dataInLocalStorage = localStorage.getItem('storageWait');
        var local = [];
        if (dataInLocalStorage) {
          local = Array.from(JSON.parse(dataInLocalStorage));
          local.push(JSON.parse(data));
          localStorage.setItem('storageWait', JSON.stringify(local));
          this.showLoading('Guardando registro para ser enviado');
          setTimeout(() => {
            this.presentToast('Registro Guardado', 'checkmark-outline', 'success');
          }, 3000);
        } else {
          var insert = Array.from(JSON.parse(data));
          insert.push(JSON.parse(data));
          localStorage.setItem('storageWait', JSON.stringify(insert));
          this.showLoading('Guardando registro para ser enviado');
          setTimeout(() => {
            this.presentToast('Registro Guardado', 'checkmark-outline', 'success');
            this.redirect();
            this.exit();
          }, 3000);
        }
      }
    } else {
      this.presentToast('No debe existir campos vacios', 'alert', 'warning');
    }
  }
  handleChange(e) {
    const valor = e.target.value;
    var insertChangeValues = document.getElementById('change');
    var insertNewValuesRenegocioPlazo = document.getElementById('plazo');
    var insertNewValuesRenegocioValor = document.getElementById('valorRene');

    switch (valor) {
      case 'Renegociación':
        insertChangeValues.innerHTML =
          '<ion-select-option value="Renegociación valor 0">Renegociación valor 0</ion-select-option><ion-select-option value="Renegociación abono">Renegociación abono</ion-select-option><ion-select-option value="Renegociación">Renegociación</ion-select-option>';
        insertNewValuesRenegocioPlazo.innerHTML =
          '<ion-item><ion-label>Plazo a renegociar</ion-label><ion-select interface="action-sheet" placeholder="Seleccionar" name="plazo"><ion-select-option value="3">3</ion-select-option><ion-select-option value="6">6</ion-select-option><ion-select-option value="9">9</ion-select-option><ion-select-option value="12">12</ion-select-option><ion-select-option value="15">15</ion-select-option><ion-select-option value="18">18</ion-select-option><ion-select-option value="24">24</ion-select-option><ion-select-option value="28">28</ion-select-option><ion-select-option value="30">30</ion-select-option><ion-select-option value="36">36</ion-select-option><ion-select-option value="40">40</ion-select-option><ion-select-option value="44">44</ion-select-option><ion-select-option value="48">48</ion-select-option></ion-select></ion-item>';
        insertNewValuesRenegocioValor.innerHTML =
          '<ion-item><ion-label>Valor a renegociar</ion-label><ion-input type="number" placeholder="Ingresa el valor" name="valorRe"></ion-input></ion-item>';
        break;
      case 'Gestión Cobranza':
        insertChangeValues.innerHTML =
          '<ion-select-option value="Visita contactada">Visita contactada</ion-select-option><ion-select-option value="Visita no contactada">Visita no contactada</ion-select-option><ion-select-option value="Pago">Pago</ion-select-option>';
        insertNewValuesRenegocioPlazo.innerHTML = '';
        insertNewValuesRenegocioValor.innerHTML = '';
        break;
      case 'Recojo':
        insertChangeValues.innerHTML =
          '<ion-select-option value="Recojo">Recojo</ion-select-option><ion-select-option value="Recojo con abono">Recojo con abono</ion-select-option>';
        insertNewValuesRenegocioPlazo.innerHTML = '';
        insertNewValuesRenegocioValor.innerHTML = '';
        break;
      case 'Verificación':
        insertChangeValues.innerHTML =
          '<ion-select-option value="Exitosa">Exitosa</ion-select-option><ion-select-option value="No Exitosa">No Exitosa</ion-select-option>';
        break;
      case 'Matriculación':
        insertChangeValues.innerHTML =
          '<ion-select-option value="Exitosa">Exitosa</ion-select-option><ion-select-option value="No Exitosa">No Exitosa</ion-select-option>';
        insertNewValuesRenegocioPlazo.innerHTML = '';
        insertNewValuesRenegocioValor.innerHTML = '';
        break;
      default:
        break;
    }
  }
}
