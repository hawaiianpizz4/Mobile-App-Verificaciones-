import { Component, OnInit } from '@angular/core';

import { LoadingController, ToastController } from '@ionic/angular';
import { dataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-verificaciones2',
  templateUrl: './verificaciones2.page.html',
  styleUrls: ['./verificaciones2.page.scss'],
})
export class Verificaciones2Page implements OnInit {
  dataList2 = [];
  dndlN_telefonocelular;
  codigo: string = '1234';

  constructor(private _service: dataService, private loadingCtrl: LoadingController, private toastController: ToastController) {}

  ngOnInit() {

    this._service.getUsersVerifi2(JSON.parse(localStorage.getItem('user'))).subscribe((data) => {
      this.dataList2 = data;
      console.log(this.dataList2);
    });
  }

  handleRefresh(event) {
    setTimeout(() => {
      this._service.getUsersVerifi2(JSON.parse(localStorage.getItem('user'))).subscribe((data) => {
        this.dataList2 = data;
      });
      event.target.complete();
      this.presentToast('La Informacion ha sido Actualizada correctamente', 'pulse-outline', 'success');
    }, 2000);
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

  // getUsersVerifi2(user){
  //   console.log(user.vf_gestor);
  //   this._service.getUsersVerifi2(user.vf_cedula_cliente).subscribe((data)=>{
  //     console.log(data);
  //   });
  //   this.showLoading('Reservando verificacion...').then((e) => {});
  //   setTimeout(() => {
  //     this.presentToast('Registro Enviado', 'checkmark-outline', 'success');
  //   }, 3000);
  // }
}
