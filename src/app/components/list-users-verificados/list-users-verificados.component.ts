import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-users-verificados',
  templateUrl: './list-users-verificados.component.html',
  styleUrls: ['./list-users-verificados.component.scss'],
})
export class ListUsersVerificadosComponent {
  @Input() item;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router) {}

  // goToVerDeatail(id: string, operacion: string) {
  goToVeriDetail() {
    // console.log(this.item.id);
    localStorage.setItem('detalleVeri', JSON.stringify(this.item));

    this.router.navigate(['veri-detail', this.item.id]);
  }
}
