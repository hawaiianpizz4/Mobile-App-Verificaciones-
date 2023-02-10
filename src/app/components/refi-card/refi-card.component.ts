import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'refi-card',
  templateUrl: './refi-card.component.html',
  styleUrls: ['./refi-card.component.scss'],
})
export class RefiCardComponent {
  @Input() cliente;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
}
