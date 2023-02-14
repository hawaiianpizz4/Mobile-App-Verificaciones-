import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-list-users-verificados',
  templateUrl: './list-users-verificados.component.html',
  styleUrls: ['./list-users-verificados.component.scss'],
})
export class ListUsersVerificadosComponent {
  @Input() item;
  @Output() clicked: EventEmitter<any> = new EventEmitter();

}
