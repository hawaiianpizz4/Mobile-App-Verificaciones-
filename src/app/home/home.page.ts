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
    { title: 'Option 1', icon: 'flask' },
    { title: 'Option 2', icon: 'logo-github' },
    { title: 'Option 3', icon: 'cube' },
  ];
 

}
