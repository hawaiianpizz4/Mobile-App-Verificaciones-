import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Verificaciones2Page } from './verificaciones2.page';

const routes: Routes = [
  {
    path: '',
    component: Verificaciones2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Verificaciones2PageRoutingModule {}
