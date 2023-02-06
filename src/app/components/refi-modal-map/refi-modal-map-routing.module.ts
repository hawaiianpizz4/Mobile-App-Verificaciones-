import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RefiModalMapPage } from './refi-modal-map.page';

const routes: Routes = [
  {
    path: '',
    component: RefiModalMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RefiModalMapPageRoutingModule {}
