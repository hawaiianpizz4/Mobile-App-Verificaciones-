import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificadosPageRoutingModule } from './verificados-routing.module';

import { VerificadosPage } from './verificados.page';
import { ListUsersVerificadosComponentModule } from 'src/app/components/list-users-verificados/list-users-verificados.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificadosPageRoutingModule,
    ListUsersVerificadosComponentModule

  ],
  declarations: [VerificadosPage]
})
export class VerificadosPageModule {}
