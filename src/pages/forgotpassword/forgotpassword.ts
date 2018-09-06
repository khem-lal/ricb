import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  forgotPasswordForm: FormGroup;
  password: string;
  phoneNo: number;
  cidNumber: number;
  private baseUrl: String;
  public headers: any;
  status: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.forgotPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      phoneNo: ['', Validators.required],
      cidNumber: ['', Validators.required]
    });
  }

  updatePassword(){
    if(this.forgotPasswordForm.valid){
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      this.http.get(this.baseUrl+'/updatePassword?cidNo='+this.cidNumber+'&mobileNo='+this.phoneNo+'&newPassword='+this.password, this.headers).map(res => res.json()).subscribe(
        data => {
          this.status = data[0].status;
          if(this.status==1){
            let alert = this.alertCtrl.create({
              title: 'Password Updated',    
              subTitle: 'Your password is updated.',
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
            let alert = this.alertCtrl.create({
              title: 'Update Failed',    
              subTitle: 'You are not a registered user. Please register and try again. Thank You.',
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
        },
        err => {
          console.log("Error fetching data");
        }
      );
    }else{
      let alert = this.alertCtrl.create({
        subTitle: 'All fields are required.',
        buttons: [
          {
            text: 'OK'
          }
        ]
      }); 
      alert.present();
    }
    
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

}
