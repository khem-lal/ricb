import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreditaccountnumberPage } from '../creditaccountnumber/creditaccountnumber';
import { LifedetailsPage } from '../lifedetails/lifedetails';
import { DeferreddetailsPage } from '../deferreddetails/deferreddetails';

/**
 * Generated class for the OthersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-others',
  templateUrl: 'others.html',
})
export class OthersPage {

  type: String;
  creditFlag: boolean = false;
  lifeFlag: boolean = false;
  deferredFlag: boolean = false;
  accountNo: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.type = navParams.get('param');

    if(this.type == "credit"){
      this.creditFlag = true;
    }
    if(this.type == "life"){
      this.lifeFlag = true;
    }
    if(this.type == "deferred"){
      this.deferredFlag = true;
    }
    
  }

  policyDetails(object){
    if(object == "credit"){
      this.navCtrl.push(CreditaccountnumberPage, {param: this.accountNo});
    }
    if(object == "life"){
      this.navCtrl.push(LifedetailsPage, {param: this.accountNo});
    }
    if(object == "deferred"){
      this.navCtrl.push(DeferreddetailsPage, {param: this.accountNo});
    }
  }

  

}
