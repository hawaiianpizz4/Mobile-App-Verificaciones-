import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VeriDetailPageRoutingModule } from './veri-detail-routing.module';

import { VeriDetailPage } from './veri-detail.page';
import { ButtonModule } from 'src/app/components/button/button.module';

import { HistCardComponentModule } from 'src/app/components/hist-card/hist-card.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VeriDetailPageRoutingModule,
    HistCardComponentModule,
    ButtonModule
    
  ],
  declarations: [VeriDetailPage]
})
export class VeriDetailPageModule {}
