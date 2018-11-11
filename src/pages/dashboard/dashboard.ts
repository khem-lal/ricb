import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Platform, Nav, Navbar, Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { PolicynumberPage } from '../policynumber/policynumber';
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import { UserprofilePage } from '../userprofile/userprofile';
import { SqliteProvider } from '../../providers/sqlite/sqlite';

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
  sqliteData: any;
  data: any[];
  @ViewChild(Navbar) navBar: Navbar;

  constructor(public platform: Platform, public navCtrl: NavController, public nav: Nav, public navParams: NavParams, public http: Http, 
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public events: Events,  public sqliteprovider: SqliteProvider) {
    

    // if(this.events.publish('userloggedin')){
    //   events.subscribe('userloggedin', (data) => {
    //     console.log("data is "+ data);
    //     this.cidNo = data;
    //   });
    // }
    // else{
      this.cidNo = navParams.get('param');
      this.events.publish('userloggedin', this.cidNo);
   // }
    
   

    platform.registerBackButtonAction((event) =>{
      let view = this.nav.getActive();
      console.log(view.component.name);
      if (view.component.name == "Dashboard") {
        this.navCtrl.setRoot(HomePage);
      }
      else if (view.component.name == "HomePage") {
        platform.exitApp();
      }
      else{
        nav.pop();
      }
    })
  }

  ionViewDidLoad() {
    
    this.platform.ready().then(() => {
      //get cid
      this.sqliteprovider.getRegisteredCID().then(res => {
        if(res){
          this.sqliteData = res;
          this.cidNo = this.sqliteData;
        } 
      });
      
    });
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
            subTitle: 'You dont have life insurance account with RICB',
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
    let alert = this.alertCtrl.create({
      title: 'Close Session',    
      subTitle: 'Thank you for using MyRICB. You have logged out successfully.',
      buttons: [
        {
          text: 'Close',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    }); 
    alert.present();
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 4000
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
