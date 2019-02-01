import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * Generated class for the PaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  paymentUrl: SafeResourceUrl;
  //paymentUrl: string;
  reportFlag: boolean = false;
  paymentTitle: boolean = false;
  reportTitle: boolean = false;
  paramType: String;
  // innerHTML: string;
  // returnType: any;
  // pdfUrl: string;

  // public headers: any;
  // cordova: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public sanitizer: DomSanitizer) {
      this.paymentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.navParams.get('param')); 
      //this.paymentUrl = this.navParams.get('rpturl'); 
      //this.pdfUrl = this.navParams.get('param'); 
      //this.innerHTML = '<iframe [src]="paymentUrl" scrolling="yes" width="100%" height="100%"></iframe>';
      //  console.log("payment url "+this.paymentUrl);
      this.paramType = navParams.get('type');

    if(this.paramType == "report"){
      this.reportFlag = true;
      this.reportTitle = true;
    }else{
      this.paymentTitle = true;
    }    
  }

}
