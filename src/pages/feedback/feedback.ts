import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { EmailComposer } from '@ionic-native/email-composer';
import { Http } from '@angular/http';

/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  subject: string;
  message: string;
  aseUrl: string;
  headers: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public alertCtrl: AlertController) {
  }

  sendEmail(){

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};
      this.http.get('http://apps.ricb.com.bt/san/mail.php', this.headers).map(res => res.json()).subscribe(
        data => {
          
        },
        err => {
          console.log("Error fetching data");
        }
      );
  }

}
