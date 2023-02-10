import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list-users-verifi',
  templateUrl: './list-users-verifi.component.html',
  styleUrls: ['./list-users-verifi.component.scss'],
})
export class ListUsersVerifiComponent  {
  @Input() item;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
}
