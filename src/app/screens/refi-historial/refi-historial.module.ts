import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefiHistorialPageRoutingModule } from './refi-historial-routing.module';

import { RefiHistorialPage } from './refi-historial.page';
import { ButtonModule } from 'src/app/components/button/button.module';

import { HistCardComponentModule } from 'src/app/components/hist-card/hist-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefiHistorialPageRoutingModule,
    HistCardComponentModule,
    ButtonModule,
  ],
  declarations: [RefiHistorialPage],
})
export class RefiHistorialPageModule {}
