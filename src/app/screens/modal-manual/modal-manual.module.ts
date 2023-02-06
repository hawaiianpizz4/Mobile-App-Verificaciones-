import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalManualPageRoutingModule } from './modal-manual-routing.module';

import { ModalManualPage } from './modal-manual.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalManualPageRoutingModule
  ],
  declarations: [ModalManualPage]
})
export class ModalManualPageModule {}
