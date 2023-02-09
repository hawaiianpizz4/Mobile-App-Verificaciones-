import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialPageRoutingModule } from './historial-routing.module';

import { HistorialPage } from './historial.page';
import { ButtonModule } from 'src/app/components/button/button.module';

import { HistCardComponentModule } from 'src/app/components/hist-card/hist-card.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialPageRoutingModule,
    HistCardComponentModule,
    ButtonModule
  ],
  declarations: [HistorialPage]
})
export class HistorialPageModule {}
