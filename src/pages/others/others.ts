import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { CreditaccountnumberPage } from '../creditaccountnumber/creditaccountnumber';
import { LifedetailsPage } from '../lifedetails/lifedetails';
import { DeferreddetailsPage } from '../deferreddetails/deferreddetails';
import { Http } from '@angular/http';

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
  private baseUrl: String;
  public headers: any;
  public policyNo: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
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
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      this.http.get(this.baseUrl+'/creditinvestmentdetails?accountNo='+this.accountNo, this.headers).map(res => res.json()).subscribe(
        data => {
          if(data == ""){
            let toast = this.toastCtrl.create({
              message: 'You dont have account with RICB',
              duration: 3000,
              position: 'middle',
              cssClass: 'errorMsg'
            });
          
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
          
            toast.present();
          }
          else{
            this.navCtrl.push(CreditaccountnumberPage, {param: this.accountNo, payType: "others"});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
      
    }
    if(object == "life"){
      this.navCtrl.push(LifedetailsPage, {param: this.accountNo});
    }
    if(object == "deferred"){
      this.navCtrl.push(DeferreddetailsPage, {param: this.accountNo});
    }
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 2000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
  
    loading.present();
  
    /*setTimeout(() => {
      loading.dismiss();
    }, 5000); */
  }

}
