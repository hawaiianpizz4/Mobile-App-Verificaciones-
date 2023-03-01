import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(private menu: MenuController) {}

  closeMenu(menuId: string) {
    this.menu.close(menuId);
  }

  ngOnInit() {}

  // menuOptions: any[] = [
  //   {
  //     title: 'Gestiones Cobranza',
  //     icon: 'wallet-outline',
  //     items: [
  //       { title: 'Gestiones Cobranza', icon: 'wallet-outline', route: '/' },
  //       { title: 'Historia Gestión', icon: 'receipt-outline', route: '/historial' },
  //       { title: 'Historia Refinanciamiento', icon: 'cash-outline', route: '/refi-historial' }
  //     ]
  //   },
  //   {
  //     title: 'Verificación',
  //     icon: 'person-outline',
  //     items: [
  //       { title: 'Por Reservar', icon: 'list', route: '/verificaciones' },
  //       { title: 'Por Verificar', icon: 'time', route: '/verificaciones2' },
  //       { title: 'Verificados', icon: 'checkmark', route: '/verificados' }
  //     ]
  //   }
  // ];
}
