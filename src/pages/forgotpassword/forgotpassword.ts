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
  otpFlag: boolean = false;
  regFlag: boolean = false;
  otp: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.forgotPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      phoneNo: ['', Validators.required],
      cidNumber: ['', Validators.required]
    });
    this.regFlag = true;
  }

  updatePassword(){
    
      this.presentLoadingDefault();
      this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};
      console.log(this.cidNumber);

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
    
    
  }

  generateOtp(){
    if(this.forgotPasswordForm.valid){
      console.log(this.cidNumber);
      
    
      var otp = Math.floor(100000 + Math.random() * 900000);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};
      this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

      this.http.get(this.baseUrl+'/forgotpasswordotp?cidNumber='+this.cidNumber+'&otp='+otp, this.headers).map(res => res.json()).subscribe(
          data => {
            this.status = data[0].status;
            if(this.status==1){
              let smsContent = "Dear user, your MyRICB OTP is "+otp+'. Please do not share your OTP.';
              //send to otp page
              this.http.get('http://202.144.136.77/api/gateway.aspx?action=send&username=ricb&passphrase=12345678&message='+smsContent+'&phone='+this.phoneNo, this.headers)
              .map(res => res.json()).subscribe(
                data => {
                  //do nothing after sending sms;
                });
                //this.otp = otp;
                this.otpFlag = true;
                this.regFlag = false;
              }
          });
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

  verifyOTP(){
    this.presentLoadingDefault();
    this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/verifyotp?otp='+this.otp+'&cid='+this.cidNumber, this.headers).map(res => res.json()).subscribe(
      data => {
        this.status = data[0].status;
        if(this.status == 0){
          let alert = this.alertCtrl.create({
            subTitle: 'Invalid OTP. Please register again.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.otpFlag = false;
                  this.regFlag = true;
                }
              }
            ]
          }); 
          alert.present();
        }
        else{
          this.updatePassword();
        }
      });
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
