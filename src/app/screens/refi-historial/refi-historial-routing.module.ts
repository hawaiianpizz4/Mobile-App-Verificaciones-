import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefiHistorialPage } from './refi-historial.page';

const routes: Routes = [
  {
    path: '',
    component: RefiHistorialPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefiHistorialPageRoutingModule {}
