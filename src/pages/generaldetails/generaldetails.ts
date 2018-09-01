import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-generaldetails',
  templateUrl: 'generaldetails.html',
})
export class GeneraldetailsPage {
  private baseUrl: String;
  polNo: any;
  policyDtls: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public http: Http, public loadingCtrl: LoadingController) {

      this.polNo = navParams.get('param');
     
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      this.http.get(this.baseUrl+'/geninsurancedetails?policyNo='+this.polNo).map(res => res.json()).subscribe(
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
