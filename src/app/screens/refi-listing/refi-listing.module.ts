import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RefiListingPageRoutingModule } from './refi-listing-routing.module';

import { RefiListingPage } from './refi-listing.page';
import { SearchbarModule } from 'src/app/components/searchbar/searchbar.module';
import { RefiCardModule } from 'src/app/components/Refi-card/Refi-card.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RefiListingPageRoutingModule,
    SearchbarModule,
    RefiCardModule,
  ],
  declarations: [RefiListingPage],
})
export class RefiListingPageModule {}
