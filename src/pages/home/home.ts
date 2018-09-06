import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationPage } from '../registration/registration';
import { DashboardPage } from '../dashboard/dashboard';
import { Http } from '@angular/http';
import { CallNumber } from '@ionic-native/call-number';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { SqliteProvider } from '../../providers/sqlite/sqlite';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  registrationForm: FormGroup;
  cidNo: string;
  password: string;
  baseUrl: string;
  headers: any;
  status: any;
  adImage: any;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public http: Http, public platform: Platform,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, private callNumber: CallNumber, public sqliteprovider: SqliteProvider, public toastCtrl: ToastController) {
    this.registrationForm = this.formBuilder.group({
      cidNo: ['',  Validators.compose([Validators.required])],
      password: ['', Validators.required]
    });
    //get advertisement image
    this.getAdImage();
    
    //get cid if the user is registered
    // this.platform.ready().then(() => {
    //   //get cid
    //   this.sqliteprovider.getRegisteredCID().then(res => {
    //     console.log(res)
    //     if(res){
    //       //this.cidNo = res.;
    //     } 
    //   });
    // });
  }

  getAdImage(){
    this.presentLoadingDefault();
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.headers = {headers};

    this.http.get(this.baseUrl+'/advertisement', this.headers).map(res => res.json()).subscribe(
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
          this.adImage = data;
        }
      },
      err => {
        console.log("Error fetching data");
      }
    );

    
  }

  goToRegistrationPage(){
    this.navCtrl.push(RegistrationPage);
  }

  loginValidate(){
    //this.navCtrl.push(DashboardPage, {param: this.cidNo});
    
    if(this.registrationForm.valid){
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      
      this.http.get(this.baseUrl+'/validatePassword?cidNumber='+this.cidNo+'&password='+this.password, this.headers).map(res => res.json()).subscribe(
        data => {
          this.status = data[0].status;
          if(this.status==1){
            this.navCtrl.push(DashboardPage, {param: this.cidNo});
          }
          else {
            let alert = this.alertCtrl.create({
              title: 'Login Failed',    
              subTitle: 'Incorrect Username and Password.',
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
    }else{
      let toast = this.toastCtrl.create({
        message: 'All fields are required',
        duration: 4000,
        position: 'middle',
        cssClass: 'errorMsg'
      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast.present();
    }
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 500);
  }

  callPage(){
    this.callNumber.callNumber("1811", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  //forgot password method
  forgotPassword(){
    this.navCtrl.push(ForgotpasswordPage);
  }

}
