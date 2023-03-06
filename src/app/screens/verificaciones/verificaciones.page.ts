import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { dataService } from 'src/app/services/data.service';
import { getCurrentCoordinates } from 'src/app/utils/Utils';

@Component({
  selector: 'app-verificaciones',
  templateUrl: './verificaciones.page.html',
  styleUrls: ['./verificaciones.page.scss'],
})
export class VerificacionesPage implements OnInit {
  dataList = [];
  currentLocation;
  public results: any[] = [];
  public checkenviodatos: any[] = [];

  isServiceCallInProgress: any;

  constructor(private _service: dataService, private loadingCtrl: LoadingController, private toastController: ToastController) {}

  async ngOnInit() {
    this.cargarDatos();
    this.currentLocation = await getCurrentCoordinates();
  }
  handleRefresh(event) {
    this.cargarDatos();
    event.target.complete();
  }

  cargarDatos() {
    setTimeout(() => {
      this._service.getClientesParaReservar().subscribe((data) => {
        this.dataList = data;
        console.log(this.dataList);
      });
      this.presentToast('La Informacion ha sido Actualizada correctamente', 'pulse-outline', 'success');
    }, 2000);
  }

  handleChange(event) {
    const query = event.target.value;
    const v = Object.entries(this.dataList);
    const Total: any = [];
    v.map((m) => {
      Total.push(m[1]);
    });
    this.results = Total.filter((e) => e.vf_cedula_cliente.includes(query));
    console.log('Probando');
    console.log(this.results);
  }

  // handleChange(event) {
  //   const query = event.target.value.toLowerCase();
  //   var users = JSON.parse(localStorage.getItem('storage'));
  //   const v = Object.entries(users);
  //   const Total: any = [];
  //   v.map((m) => {
  //     Total.push(m[1]);
  //   });
  //   this.results = Total.filter((e) => e.numeroCredito.includes(query));
  // }

  async setClienteReservado(user) {
    console.log(JSON.parse(localStorage.getItem('user')));
    try {
      this._service
        .setClienteReservado(
          user.vf_cedula_cliente,
          JSON.parse(localStorage.getItem('user')),
          this.currentLocation.latitude,
          this.currentLocation.longitude
        )
        .subscribe(
          (data) => {
            this.showLoading('Reservando verificacion...').then((e) => {});
            setTimeout(() => {
              this.presentToast('Registro Enviado', 'checkmark-outline', 'success');
              this.cargarDatos();
            }, 3000);
            console.log(data);
          },
          (error) => {
            console.log(error);
            console.log('Hola');
            this.presentToast('Error al enviar datos', 'checkmark-outline', 'danger');
            // this.isServiceCallInProgress.dismiss();
          }
        );
    } catch (error) {
      this.presentToast('Error al guardar información', 'checkmark-outline', 'danger');
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
}
