import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificacionesPage } from './verificaciones.page';

const routes: Routes = [
  {
    path: '',
    component: VerificacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificacionesPageRoutingModule {}
