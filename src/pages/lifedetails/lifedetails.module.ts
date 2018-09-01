import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LifedetailsPage } from './lifedetails';

@NgModule({
  declarations: [
    LifedetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LifedetailsPage),
  ],
})
export class LifedetailsPageModule {}
