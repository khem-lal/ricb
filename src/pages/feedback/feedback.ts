import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';
import { CallNumber } from '@ionic-native/call-number';

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
  baseUrl: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private callNumber: CallNumber) {
  }

  sendEmail(){

      this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      this.presentLoadingDefault();
      this.http.get(this.baseUrl+'/sendmail?to=feedback@ricb.bt&from=ricbfeedback@gmail.com&subject='+this.subject+'&message='+this.message, this.headers).map(res => res.json()).subscribe(
        data => {
          let toast = this.toastCtrl.create({
            message: 'Email sent successfully.',
            duration: 4000,
            position: 'middle',
            cssClass: 'errorMsg'
          });
        
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });

          this.subject = "";
          this.message = "";
        
          toast.present();
        },
        err => {
          console.log("Error fetching data");
        }
      );
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

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  callPage(){
    this.callNumber.callNumber("1811", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
