import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VeriDetailPageRoutingModule } from './veri-detail-routing.module';

import { VeriDetailPage } from './veri-detail.page';
import { BadgeModule } from 'src/app/components/badge/badge.module';
import { ButtonModule } from 'src/app/components/button/button.module';

import { HistCardComponentModule } from 'src/app/components/hist-card/hist-card.module';


import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VeriDetailPageRoutingModule,
    HistCardComponentModule,
    ButtonModule,
    ReactiveFormsModule

  ],
  declarations: [VeriDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VeriDetailPageModule {}
