import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {}
  menuOptions: any[] = [
    { title: 'Gestiones Cobranza', icon: 'flask', route:'/listing' },
    { title: 'Historiales ', icon: 'logo-github' , route:'/historial'},
    { title: '----', icon: 'cube', route:'' },
  ];

}
