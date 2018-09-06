import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
    this.cidNo = navParams.get('cid');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserprofilePage');
  }

}
