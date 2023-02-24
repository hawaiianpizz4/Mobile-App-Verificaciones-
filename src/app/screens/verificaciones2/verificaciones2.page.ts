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
    // let Data = [
    //   {
    //     vf_nombre_tienda: 'ORVE CONDADO', //
    //     vf_nombre_vendedor: 'CALULEMA', //
    //     vf_nombre_cliente: 'JUAN PEREZ', //
    //     vf_cedula_cliente: '3123123131', //
    //     vf_lugar_a_verificar: 'Domicilio',
    //     dndlD_ciudad_residencia: 'QUITO',
    //     dndlD_sector_de_domicilio: 'SECTOR 1',
    //     dndlD_direccion_domiciliaria: '07300 Inca, Islas Baleares, España', //
    //     dndlD_referencia_domiciliaria: 'LA KENNEDY',
    //     dndlN_nombre_empresa_trabaja: null,
    //     dndlN_actividad_laboral: null,
    //     dndlN_direccion_trabajo: null,
    //     dndlN_telefonofijo: null,
    //     dndlN_telefonocelular: '0969838598',
    //     vf_gestor: 'MRAMIREZ',
    //   },
    //   {
    //     vf_nombre_tienda: 'ORVE CONDADO',
    //     vf_nombre_vendedor: 'MARIA RODRIGUEZ',
    //     vf_nombre_cliente: 'CARLOS SANCHEZ',
    //     vf_cedula_cliente: '2233441234',
    //     vf_lugar_a_verificar: 'Trabajo',
    //     dndlD_ciudad_residencia: 'GUAYAQUIL',
    //     dndlD_sector_de_domicilio: 'SECTOR 5',
    //     dndlD_direccion_domiciliaria: 'Edificio Los Pinos, Calle Principal',
    //     dndlD_referencia_domiciliaria: 'CERCA DE LA IGLESIA',
    //     dndlN_nombre_empresa_trabaja: 'EMPRESA XYZ',
    //     dndlN_actividad_laboral: 'VENDEDOR',
    //     dndlN_direccion_trabajo: 'Edificio Central, Calle Los Robles',
    //     dndlN_telefonofijo: '0224455678',
    //     dndlN_telefonocelular: '0987654321',
    //     vf_gestor: 'MRAMIREZ',
    //   },
    //   {
    //     vf_nombre_tienda: 'ORVE CONDADO',
    //     vf_nombre_vendedor: 'PEDRO MARTINEZ',
    //     vf_nombre_cliente: 'ANA GOMEZ',
    //     vf_cedula_cliente: '3344556677',
    //     vf_lugar_a_verificar: 'Domicilio',
    //     dndlD_ciudad_residencia: 'CUENCA',
    //     dndlD_sector_de_domicilio: 'SECTOR 8',
    //     dndlD_direccion_domiciliaria: 'Casa 12, Calle Los Pinos',
    //     dndlD_referencia_domiciliaria: 'CERCA DEL PARQUE',
    //     dndlN_nombre_empresa_trabaja: null,
    //     dndlN_actividad_laboral: null,
    //     dndlN_direccion_trabajo: null,
    //     dndlN_telefonofijo: null,
    //     dndlN_telefonocelular: '0998765432',
    //     vf_gestor: 'MRAMIREZ',
    //   },
    // ];

    // this.dataList2 = Data;

    this._service.getUsersVerifi2(JSON.parse(localStorage.getItem('user'))).subscribe((data) => {
      this.dataList2 = data;
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
