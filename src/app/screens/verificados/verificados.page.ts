import { dataService } from 'src/app/services/data.service';
import { Network } from '@capacitor/network';
import { Component, OnInit } from '@angular/core';
import { presentToast } from 'src/app/utils/Utils';

@Component({
  selector: 'app-verificados',
  templateUrl: './verificados.page.html',
  styleUrls: ['./verificados.page.scss'],
})
export class VerificadosPage implements OnInit {
  dataList = [];
  networkStatus: boolean;
  constructor(private _service: dataService) {}

  ngOnInit() {
    this._service.getClientesVerificados(JSON.parse(localStorage.getItem('user'))).subscribe((data) => {
      this.dataList = data;
      console.log(this.dataList);
    });
  }

  async changeStatus() {
    const status = await Network.getStatus();
    this.networkStatus = status?.connected;
    this.networkStatus ? presentToast('Conectado', 'wifi-outline', 'success') : presentToast('Sin conexion', 'globe-outline', 'warning');
  }

  handleRefresh(event) {
    this._service.getClientesVerificados(JSON.parse(localStorage.getItem('user'))).subscribe((data) => {
      this.dataList = data;
      console.log(this.dataList);
    });
    event.target.complete();
  }
}
