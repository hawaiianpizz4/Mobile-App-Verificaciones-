import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefiDetailPageRoutingModule } from './refi-detail-routing.module';

import { RefiDetailPage } from './refi-detail.page';
import { BadgeModule } from 'src/app/components/badge/badge.module';
import { ButtonModule } from 'src/app/components/button/button.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefiDetailPageRoutingModule,
    BadgeModule,
    ButtonModule,
    ReactiveFormsModule,
  ],
  declarations: [RefiDetailPage],
})
export class RefiDetailPageModule {}
