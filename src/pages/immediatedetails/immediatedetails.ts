import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

/**
 * Generated class for the ImmediatedetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-immediatedetails',
  templateUrl: 'immediatedetails.html',
})
export class ImmediatedetailsPage {

  private baseUrl: String;
  polNo: any;
  policyDtls: any;
  amountToPay: any;
  paymentUrl: any;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController, public navParams: NavParams, 
    public http: Http, public loadingCtrl: LoadingController) {
      this.polNo = navParams.get('param');
     
      this.presentLoadingDefault();
      this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

      this.http.get(this.baseUrl+'/immediateannuitydetails?policyNo='+this.polNo).map(res => res.json()).subscribe(
        data => {
          this.policyDtls = data;
        },
        err => {
          console.log("Error fetching data");
        }
      );
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 500);
  }

}
