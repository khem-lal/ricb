import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneraldetailsPage } from './generaldetails';

@NgModule({
  declarations: [
    GeneraldetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(GeneraldetailsPage),
  ],
})
export class GeneraldetailsPageModule {}
