import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-users-verifi-check',
  templateUrl: './list-users-verifi-check.component.html',
  styleUrls: ['./list-users-verifi-check.component.scss'],
})
export class ListUsersVerifiCheckComponent {

  @Input() item;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router) {}


   // goToVerificacion(id: string, operacion: string) {
    goToVerificacion() {
      this.router.navigate(['verificacion',this.item ]);
    }
  
}
