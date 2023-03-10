import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { dataService } from 'src/app/services/data.service';

import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-list-users-verifi',
  templateUrl: './list-users-verifi.component.html',
  styleUrls: ['./list-users-verifi.component.scss'],
})
export class ListUsersVerifiComponent implements OnInit {
  currentLocation;
  latitude = 0;
  longitude = 0;
  @Input() item;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
  // @Output() esReservado = new EventEmitter<boolean>();

  constructor(
    private _service: dataService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,
    private geolocation: Geolocation
  ) {}

  async ngOnInit() {
    this.getCurrentCoordinates();
  }
  async setClienteReservado(user) {
    try {
      this._service.setClienteReservado(user.vf_cedula_cliente, JSON.parse(localStorage.getItem('user')), this.latitude, this.longitude).subscribe(
        (data) => {
          this.showLoading('Reservando verificacion...').then((e) => {});
          setTimeout(() => {
            this.presentToast('Registro Enviado', 'checkmark-outline', 'success');
            console.log('Success');
            this.clicked.emit('ok');
            // Recargar la página después de 3 segundos
            // this.esReservado.emit(true);
          }, 3000);
        },
        (error) => {
          console.log(error);
          this.presentToast('Error al enviar datos', 'checkmark-outline', 'danger');
          // this.esReservado.emit(false);
          // this.isServiceCallInProgress.dismiss();
        }
      );
    } catch (error) {
      this.presentToast('Error al guardar información', 'checkmark-outline', 'danger');
      // this.esReservado.emit(false);
      // this.isServiceCallInProgress.dismiss();
    }
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
}
