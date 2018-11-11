import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the CalculatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class CalculatorPage {
  creditCalculator: boolean = false;
  installmentCalculator: boolean = false;
  interestCalculator: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private callNumber: CallNumber) {
  }

  openCalculator(caltype){
    if(caltype == "credit"){
      this.creditCalculator = true;
      this.installmentCalculator = false;
      this.interestCalculator = false;
    }
    if(caltype == "installment"){
      this.installmentCalculator = true;
      this.creditCalculator = false;
      this.interestCalculator = false;
    }
    if(caltype == "interest"){
      this.interestCalculator = true;
      this.creditCalculator = false;
      this.installmentCalculator = false;
    }
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  callPage(){
    this.callNumber.callNumber("1818", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
