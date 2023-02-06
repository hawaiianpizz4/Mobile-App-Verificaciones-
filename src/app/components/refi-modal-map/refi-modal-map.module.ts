import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefiModalMapPageRoutingModule } from './refi-modal-map-routing.module';

import { RefiModalMapPage } from './refi-modal-map.page';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefiModalMapPageRoutingModule,
  ],
  declarations: [RefiModalMapPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RefiModalMapPageModule {}
