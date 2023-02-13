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
  
  constructor(private _service: dataService,
    private loadingCtrl: LoadingController,
    private toastController: ToastController,) { }

  ngOnInit() {
    this._service.getUsersVerifi2().subscribe((data) => {
      this.dataList2=data;
      console.log(this.dataList2);
    });
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
