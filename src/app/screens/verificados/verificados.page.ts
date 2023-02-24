import { dataService } from 'src/app/services/data.service';

import { Component, OnInit } from '@angular/core';

//import { RefiModalMapPage } from 'src/app/components/refi-modal-map/refi-modal-map.page';

@Component({
  selector: 'app-verificados',
  templateUrl: './verificados.page.html',
  styleUrls: ['./verificados.page.scss'],
})
export class VerificadosPage implements OnInit {
  dataList = [];
  constructor(private _service: dataService) {}

  ngOnInit() {
   
    this._service.getUsersVerifi2(JSON.parse(localStorage.getItem('user'))).subscribe((data) => {
      this.dataList = data;
      console.log(this.dataList);
    });
  }
}
