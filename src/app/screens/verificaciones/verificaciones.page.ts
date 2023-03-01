import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { dataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-verificaciones',
  templateUrl: './verificaciones.page.html',
  styleUrls: ['./verificaciones.page.scss'],
})
export class VerificacionesPage implements OnInit {
  dataList = [];
  constructor(private _service: dataService, private loadingCtrl: LoadingController, private toastController: ToastController) {}

  ngOnInit() {
    this._service.getClientesParaReservar().subscribe((data) => {
      this.dataList = data;
      console.log(this.dataList);
    });
  }
  handleRefresh(event) {
    setTimeout(() => {
      this._service.getClientesParaReservar().subscribe((data) => {
        this.dataList = data;
      });
      event.target.complete();
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
    this.dataList = Total.filter((e) => e.vf_cedula_cliente.includes(query));
  }

  setClienteReservado(user) {
    console.log(JSON.parse(localStorage.getItem('user')));
    this._service.setClienteReservado(user.vf_cedula_cliente, JSON.parse(localStorage.getItem('user'))).subscribe((data) => {
      console.log(data);
    });
    this.showLoading('Reservando verificacion...').then((e) => {});
    setTimeout(() => {
      this.presentToast('Registro Enviado', 'checkmark-outline', 'success');
    }, 3000);
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
}
