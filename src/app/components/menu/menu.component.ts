import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  menuOptions: any[] = [
    { title: 'Gestiones Cobranza', icon: 'flask', route: '/' },
    { title: 'Historial Gestión ', icon: 'logo-github', route: '/historial' },
    {
      title: 'Historial Refinanciamiento ',
      icon: 'logo-github',
      route: '/refi-historial',
    },
    {
      title: 'Verificacion',
      icon: 'flask',
      subMenu: [
        { title: 'Por Reservar', icon: 'checkmark', route: '/verificaciones' },
        {
          title: 'Por Verificar',
          icon: 'checkmark',
          route: '/verificaciones2',
        },
        { title: 'Verificados', icon: 'checkmark', route: '/verificados' },
      ],
    },
  ];
}
