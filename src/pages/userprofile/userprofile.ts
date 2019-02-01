import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';

/**
 * Generated class for the UserprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html',
})
export class UserprofilePage {
  cidNo: String;
  baseUrl: any;
  headers: any;
  userData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController) {
    
    this.cidNo = navParams.get('cid');
  }

  ionViewDidLoad() {
    this.presentLoadingDefault();
    this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/userprofile?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
      data => {
        this.userData = data;
      });
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

}
