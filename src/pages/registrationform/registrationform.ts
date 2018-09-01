import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { HomePage } from '../home/home';

/**
 * Generated class for the RegistrationformPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registrationform',
  templateUrl: 'registrationform.html',
})
export class RegistrationformPage {

  registrationForm: FormGroup;
  uname: string;
  password: string;
  phoneNo: number;
  email: string;
  cidNumber: number;
  private baseUrl: String;
  public headers: any;
  status: any;
  otpFlag: boolean = false;
  otp: number;
  regFlag: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.registrationForm = this.formBuilder.group({
      uname: ['', Validators.required],
      password: ['', Validators.required],
      phoneNo: ['', Validators.required],
      email: ['', Validators.required],
      cidNumber: ['', Validators.required]
    });
    this.regFlag = true;
  }

  registerUser(){
    this.presentLoadingDefault();
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    //generate otp
    var otp = Math.floor(100000 + Math.random() * 900000);

    this.http.get(this.baseUrl+'/adduserdetails?userName='+this.uname+'&password='+this.password+'&phoneNo='+this.phoneNo+
    '&email='+this.email+'&cidNumber='+this.cidNumber+'&otp='+otp, this.headers).map(res => res.json()).subscribe(
      data => {
        this.status = data[0].status;
        if(this.status==1){
          let smsContent = "Dear user, your RICB Pay user registration OTP is "+otp+'. Please do not share your OTP.';
          //send to otp page
          this.http.get('http://sms.edruk.com.bt/smsclients/smsclients.php?mobile='+this.phoneNo+'&smsmsg='+smsContent+'&shortcode=RICB', this.headers)
          .map(res => res.json()).subscribe(
            data => {
              //do nothing after sending sms;
            });
            //this.otp = otp;
            this.otpFlag = true;
            this.regFlag = false;
        }
        else if(this.status==2){
          let alert = this.alertCtrl.create({
            title: 'Registration',    
            subTitle: 'You are already a registered user.',
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
            title: 'Registration Failed',    
            subTitle: 'Registration failed. Try again.',
            buttons: [
              {
                text: 'OK'
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

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  verifyOTP(){
    this.presentLoadingDefault();
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/verifyotp?&otp='+this.otp, this.headers).map(res => res.json()).subscribe(
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
          let alert = this.alertCtrl.create({
            title: 'Registration Success',    
            subTitle: 'You have been registered.',
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
      });
  }
 
}
