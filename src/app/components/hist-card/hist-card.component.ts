import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hist-card',
  templateUrl: './hist-card.component.html',
  styleUrls: ['./hist-card.component.scss'],
})
export class HistCardComponent{
  @Input() item;
  constructor() { }
}
