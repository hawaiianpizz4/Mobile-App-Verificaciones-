import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';

import { FormControl, FormGroup, Validators } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { VerificacionPageRoutingModule } from './verificacion-routing.module';


import { VerificacionPage } from './verificacion.page';
import { BadgeModule } from 'src/app/components/badge/badge.module';
import { ButtonModule } from 'src/app/components/button/button.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BadgeModule,
    ButtonModule,
    VerificacionPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [VerificacionPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerificacionPageModule {}
