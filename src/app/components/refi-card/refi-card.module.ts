import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RefiCardComponent } from './refi-card.component';

@NgModule({
  declarations: [RefiCardComponent],
  imports: [CommonModule, IonicModule],
  exports: [RefiCardComponent],
})
export class RefiCardModule {}
