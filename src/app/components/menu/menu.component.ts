import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() { }


  menuOptions: any[] = [
    { title: 'Gestiones Cobranza', icon: 'flask', route: '/', showSubMenu: false },
    { title: 'Historiales', icon: 'logo-github', route: '/historial', showSubMenu: false },
    {
      title: 'Verificacion', icon: 'flask', showSubMenu: false,
      subMenu: [
        { title: 'Por Reservar', icon: 'checkmark', route: '/verificaciones', showSubMenu: false },
        { title: 'Por Verificar', icon: 'checkmark', route: '/verificaciones2', showSubMenu: false },
        { title: 'Verificados', icon: 'checkmark', route: '/verificados', showSubMenu: false }
      ]
    }
  ];}
