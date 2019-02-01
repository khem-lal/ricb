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
  remitterCid: String;
  lifeTitle: boolean = false;
  creditTitle: boolean = false;
  deferredTitle: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.type = navParams.get('param');
    this.remitterCid = navParams.get('remitterCid');

    if(this.type == "credit"){
      this.creditFlag = true;
      this.creditTitle = true;
    }
    if(this.type == "life"){
      this.lifeFlag = true;
      this.lifeTitle = true;
    }
    if(this.type == "deferred"){
      this.deferredFlag = true;
      this.deferredTitle = true;
    }
    
  }

  policyDetails(object){
    this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    if(object == "credit"){
      this.presentLoadingDefault();
      this.http.get(this.baseUrl+'/creditinvestmentdetails?accountNo='+this.accountNo, this.headers).map(res => res.json()).subscribe(
        data => {
          if(data == ""){
            let toast = this.toastCtrl.create({
              message: 'The loan account does not exist.',
              duration: 3000,
              position: 'middle',
              cssClass: 'errorMsg'
            });
          
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
          
            toast.present();
          }
          else if(data[0].CID_NO == this.remitterCid){
            let toast = this.toastCtrl.create({
              
              message: 'Sorry, cannot process for your own loan account',
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
            this.navCtrl.push(CreditaccountnumberPage, {param: this.accountNo, payType: "others", remitterCid: this.remitterCid});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
      
    }
    if(object == "life"){
      this.presentLoadingDefault();
      this.http.get(this.baseUrl+'/generalinsurancedetails?policyNo='+this.accountNo, this.headers).map(res => res.json()).subscribe(
        data => {
          if(data == ""){
            let toast = this.toastCtrl.create({
              message: 'The policy number does not exist',
              duration: 3000,
              position: 'middle',
              cssClass: 'errorMsg'
            });
          
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
          
            toast.present();
          }
          else if(data[0].CUST_CID == this.remitterCid){
            let toast = this.toastCtrl.create({
              message: 'Sorry, cannot process for your own policy number',
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
           
            this.navCtrl.push(LifedetailsPage, {param: this.accountNo, remitterCid: this.remitterCid});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
     
    }
    if(object == "deferred"){
      this.presentLoadingDefault();
      this.http.get(this.baseUrl+'/deferredannuitydetails?policyNo='+this.accountNo, this.headers).map(res => res.json()).subscribe(
        data => {
          if(data == ""){
            let toast = this.toastCtrl.create({
              message: 'The policy number does not exist.',
              duration: 3000,
              position: 'middle',
              cssClass: 'errorMsg'
            });
          
            toast.onDidDismiss(() => {
              console.log('Dismissed toast');
            });
          
            toast.present();
          }
          else if(data[0].CITYZENSHIPID == this.remitterCid){
            let toast = this.toastCtrl.create({
              message: 'Sorry, cannot process for your own policy number',
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
           
            this.navCtrl.push(DeferreddetailsPage, {param: this.accountNo, remitterCid: this.remitterCid});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
      
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
