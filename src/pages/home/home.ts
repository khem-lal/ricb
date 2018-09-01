import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationPage } from '../registration/registration';
import { DashboardPage } from '../dashboard/dashboard';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  registrationForm: FormGroup;
  cidNo: number;
  password: string;
  baseUrl: string;
  headers: any;
  status: any;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    //get cid if the user is registered

    this.registrationForm = this.formBuilder.group({
      cidNo: ['', Validators.required],
      password: ['', Validators.required]
    });
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

}
