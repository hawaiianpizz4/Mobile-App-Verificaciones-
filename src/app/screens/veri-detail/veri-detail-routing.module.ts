import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VeriDetailPage } from './veri-detail.page';

const routes: Routes = [
  {
    path: '',
    component: VeriDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VeriDetailPageRoutingModule {}
