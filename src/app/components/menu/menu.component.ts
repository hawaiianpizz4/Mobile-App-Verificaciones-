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
    { title: 'Principal', icon: 'ribbon-outline' , route:'/'},
    { title: 'Historiales ', icon: 'calendar-outline' , route:'/historial'},
  ];

}
