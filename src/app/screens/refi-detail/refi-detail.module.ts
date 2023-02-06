import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefiDetailPageRoutingModule } from './refi-detail-routing.module';

import { RefiDetailPage } from './refi-detail.page';
import { BadgeModule } from 'src/app/components/badge/badge.module';
import { ButtonModule } from 'src/app/components/button/button.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefiDetailPageRoutingModule,
    BadgeModule,
    ButtonModule,
  ],
  declarations: [RefiDetailPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RefiDetailPageModule {}
