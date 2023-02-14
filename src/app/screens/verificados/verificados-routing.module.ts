import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificadosPage } from './verificados.page';

const routes: Routes = [
  {
    path: '',
    component: VerificadosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificadosPageRoutingModule {}
