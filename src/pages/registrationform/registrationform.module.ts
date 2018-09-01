import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistrationformPage } from './registrationform';

@NgModule({
  declarations: [
    RegistrationformPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistrationformPage),
  ],
})
export class RegistrationformPageModule {}
