import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Verificaciones2PageRoutingModule } from './verificaciones2-routing.module';

import { Verificaciones2Page } from './verificaciones2.page';
import { ListUsersVerifiCheckComponentModule } from 'src/app/components/list-users-verifi-check/list-users-verifi-check.module'; 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Verificaciones2PageRoutingModule,
    ListUsersVerifiCheckComponentModule
  ],
  declarations: [Verificaciones2Page]
})
export class Verificaciones2PageModule {}
