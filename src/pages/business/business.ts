import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';
import { CallNumber } from '@ionic-native/call-number';

/**
 * Generated class for the BusinessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-business',
  templateUrl: 'business.html',
})
export class BusinessPage {

  private baseUrl: String;
  public headers: any;
  businessData: any;
  detailsFlag: boolean = false;
  businessFlag: boolean = false;
  businessDtls: String[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, 
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private callNumber: CallNumber) {
    this.presentLoadingDefault();
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/lineofbusiness', this.headers).map(res => res.json()).subscribe(
      data => {
        
        if(data == ''){
          let alert = this.alertCtrl.create({
            cssClass:'error',
            subTitle: 'No data available.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.push(HomePage);
                }
              }
            ]
          }); 
          alert.present();
        }
        else{
          this.businessData = data;
          this.businessFlag = true;
          this.detailsFlag = false;
        }
        
      },
      err => {
        console.log("Error fetching data");
      }
    );
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 1000
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });
  
    loading.present();
  }

  businessDetails(id){
    // id = id-1;
    // this.businessDtls = this.businessData[id].contents;
    this.presentLoadingDefault();
    //this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/lineofbusinessdetails?id='+id, this.headers).map(res => res.json()).subscribe(
      data => {
        
        if(data == ''){
          let alert = this.alertCtrl.create({
            cssClass:'error',
            subTitle: 'No data available.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.push(HomePage);
                }
              }
            ]
          }); 
          alert.present();
        }
        else{
          this.businessData = data;
          this.detailsFlag = true;
          this.businessFlag = false;
        }
        
      },
      err => {
        console.log("Error fetching data");
      }
    );
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
