import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform, Nav } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { PolicynumberPage } from '../policynumber/policynumber';
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import { UserprofilePage } from '../userprofile/userprofile';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  cidNo: String;
  private baseUrl: String;
  public headers: any;
  public policyNo: any[];
  data: any[];

  constructor(platform: Platform, public navCtrl: NavController, public nav: Nav, public navParams: NavParams, public http: Http, 
    public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.cidNo = navParams.get('param');
    platform.registerBackButtonAction((event) =>{
      let view = this.nav.getActive();
      if (view.component.name == "Dashboard") {
        this.navCtrl.push(HomePage);
      }
      else{
        //platform.exitApp();
      }
    })
  }

  lifepage() {
    this.presentLoadingDefault();
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/generalinsurance?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
      data => {
        this.policyNo = data;
        if(data == ""){
          let alert = this.alertCtrl.create({
            cssClass:'error',
            subTitle: 'You dont have general account with RICB',
            buttons: [
              {
                text: 'OK'
              }
            ]
          }); 
          alert.present();
        }
        else{
          this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "life"});
        }
      },
      err => {
        console.log("Error fetching data");
      }
    );
  }

  creditpage(){
    this.presentLoadingDefault();
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/creditinvestment?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
      data => {
        this.policyNo = data;
        if(data == ""){
          let alert = this.alertCtrl.create({
            cssClass:'error',
            subTitle: 'You dont have a credit account with RICB',
            buttons: [
              {
                text: 'OK'
              }
            ]
          }); 
          alert.present();
        }
        else{
          this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "credit"});
        }
      },
      err => {
        console.log("Error fetching data");
      }
    );
    
  }

  generalpage(){
    this.presentLoadingDefault();
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/geninsurance?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
      data => {
        this.policyNo = data;
        if(data == ""){
          let alert = this.alertCtrl.create({
            cssClass:'error',
            subTitle: 'You dont have general account with RICB',
            buttons: [
              {
                text: 'OK'
              }
            ]
          }); 
          alert.present();
        }
        else{
          this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "general"});
        }
      },
      err => {
        console.log("Error fetching data");
      }
    );
  }

  annuitypage(){
    this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "defferedannuity"});
  }

  payotherspage(){
    this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "payforothers"});
  }

  report(){
    this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "report"});
  }

  logoutPage(){
    this.navCtrl.push(HomePage);
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 5000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
  
    loading.present();
  
    /*setTimeout(() => {
      loading.dismiss();
    }, 5000); */
  }

  goToProfilePage(){
    this.navCtrl.push(UserprofilePage, {cid: this.cidNo});
  }
  

}
