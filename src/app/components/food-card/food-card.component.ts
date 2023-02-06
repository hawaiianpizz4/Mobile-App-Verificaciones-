import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss'],
})
export class FoodCardComponent {
  @Input() item;
  @Output() clicked: EventEmitter<any> = new EventEmitter();
}
