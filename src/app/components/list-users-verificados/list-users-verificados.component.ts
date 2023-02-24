import { Component, EventEmitter, Input, Output} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-users-verificados',
  templateUrl: './list-users-verificados.component.html',
  styleUrls: ['./list-users-verificados.component.scss'],
})
export class ListUsersVerificadosComponent {

  @Input() item;

  getdata;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
  constructor(private router: Router) {

  }


     // goToVerDeatail(id: string, operacion: string) {
      goToVeriDetail() {
        this.getdata=this.item;
        this.router.navigate(['veri-detail',this.getdata]);
      }

      ngOnInit(){

      }

}
