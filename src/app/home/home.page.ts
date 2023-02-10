import { Component } from '@angular/core';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {

  }
  menuOptions: any[] = [
    { title: 'Gestiones Cobranza', icon: 'flask', route:'/listing' },
    { title: 'Historiales ', icon: 'logo-github' , route:'/historial'},
    { title: '----', icon: 'cube', route:'' },
    { title: 'formulario-verificacion', icon: 'cube', route:'/verificacion' },
  ];


}
