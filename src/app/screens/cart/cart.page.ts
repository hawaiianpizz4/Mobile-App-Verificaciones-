import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  storageW8: [];
  refresh: boolean = true;
  status: boolean;
  constructor(
    private alertCtrl: AlertController,
    private _http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private ngZone: NgZone
  ) {}
  handleRefresh(event) {
    setTimeout(() => {
      this.storageW8 = JSON.parse(localStorage.getItem('storageWait'));
      this.presentToast('La Informacion ha sido Actualizada correctamente', 'pulse-outline', 'success');
      event.target.complete();
    }, 2000);
  }

  async ngOnInit() {
    this.storageW8 = JSON.parse(localStorage.getItem('storageWait'));
    if (this.storageW8 === null) {
      this.storageW8 = [];
    } else {
      this.storageW8 = JSON.parse(localStorage.getItem('storageWait'));
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
  }

  async sendStorageW8() {
    if (this.status) {
      setTimeout(() => {
        var data = JSON.parse(localStorage.getItem('storageWait'));
        data.map((e) => {
          const url = `http://200.7.249.20/vision360ServicioCliente/Api_rest_movil/controller/categoria.php?op=pull&data=${JSON.stringify(
            e
          )}`;
          var send = this._http.get(url);
          send.subscribe((data) => {
            console.log(data);
          });
        });
        localStorage.setItem('storageWait', JSON.stringify([]));
        this.showLoading().then((e) => {});
        setTimeout(() => {
          this.presentToast('Registros Enviados', 'checkmark-outline', 'success');
        }, 3000);
      }, 1000);
    } else {
      this.presentAlert();
    }
  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando Registros...!',
      duration: 2000,
    });

    loading.present();
  }
  async presentToast(message, icon, color) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      position: 'bottom',
      icon: icon,
      color: color,
    });

    await toast.present();
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Debes tener conexion a internet para realizar esta accion',
      subHeader: 'Intenta conectarte a una red wifi ',
      message: 'Intentalo de nuevo',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
