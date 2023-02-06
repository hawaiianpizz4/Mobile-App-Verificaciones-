import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListingPage } from 'src/app/screens/listing/listing.page';

import { ModalInfoPage } from './modal-info.page';

const routes: Routes = [
  {
    path: '',
    component: ModalInfoPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalInfoPageRoutingModule {}
