import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificacionesPageRoutingModule } from './verificaciones-routing.module';
import { SearchbarModule } from 'src/app/components/searchbar/searchbar.module';

import { VerificacionesPage } from './verificaciones.page';
import { ListUsersVerifiComponentModule } from 'src/app/components/list-users-verifi/list-users-verifi.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificacionesPageRoutingModule,
    SearchbarModule,
    ListUsersVerifiComponentModule
  ],
  declarations: [VerificacionesPage]
})
export class VerificacionesPageModule {}
