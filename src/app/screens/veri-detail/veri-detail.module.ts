import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VeriDetailPageRoutingModule } from './veri-detail-routing.module';

import { VeriDetailPage } from './veri-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VeriDetailPageRoutingModule,
    
  ],
  declarations: [VeriDetailPage]
})
export class VeriDetailPageModule {}
