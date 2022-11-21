import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item;
  @Output() increase :EventEmitter<any> = new EventEmitter();
  @Output() decrease :EventEmitter<any> = new EventEmitter();

  constructor(){
  }
}
