import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, Platform, ToastController, Nav, Events } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegistrationPage } from '../registration/registration';
import { DashboardPage } from '../dashboard/dashboard';
import { Http, RequestOptions } from '@angular/http';
import { CallNumber } from '@ionic-native/call-number';
import { ForgotpasswordPage } from '../forgotpassword/forgotpassword';
import { SqliteProvider } from '../../providers/sqlite/sqlite';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version/ngx';

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
  alertPresented: any;
  sqliteData: any;
  hasCid: boolean = false;
  inAppVersion: any;
  

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public http: Http, public platform: Platform,
    public loadingCtrl: LoadingController, private network: Network, public alertCtrl: AlertController, 
    private callNumber: CallNumber, public sqliteprovider: SqliteProvider, public toastCtrl: ToastController, 
    private nav: Nav, public events: Events, public appVersion: AppVersion) {
    this.events.publish('userloggedout');
      
    this.registrationForm = this.formBuilder.group({
      cidNo: ['', Validators.required],
      password: ['', Validators.required]
    });
    //this.noCid = true;
    //get cid if the user is registered
    this.platform.ready().then(() => {
      //check for app version for updating
      //this.inAppVersion = this.appVersion.getVersionNumber();
      
      /*if (this.platform.is('cordova')) {
        this.appVersion.getVersionNumber().then(
           (v) => { this.inAppVersion = v;
            console.log("App Version check is "+this.inAppVersion);
          }
        );
      }*/
      /*let opt: RequestOptions;
      let myHeaders: Headers = new Headers;
    
      myHeaders.set('Accept','application/json; charset-utf-8');
      myHeaders.append('Content-type', 'apaplication/json; charset-utf-8');
        this.http.get('config.xml',opt).subscribe(
        data => {
          console.log("data is ============>" +data);
        });*/
        
      /* this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      this.http.get(this.baseUrl+'/appversion', this.headers).map(res => res.json()).subscribe(
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
            //update app
          }
        },
        err => {
          console.log("Error fetching data");
        }
      ); */
      //get cid
      this.sqliteprovider.getRegisteredCID().then(res => {
        if(res){
          this.sqliteData = res;
          this.cidNo = this.sqliteData;
          console.log('has cid');
          this.hasCid = true;
        }
        else{
          console.log('no cid');
          this.hasCid = false;
        } 
      });
      
    });

    this.alertPresented = false;
    
    //get advertisement image
    this.getAdImage();
    
    

    platform.registerBackButtonAction((event) =>{
      let view = this.nav.getActive();
      if (view.component.name == "HomePage") {
        //platform.exitApp();
        navigator['app'].exitApp();   
      }
      else{
        nav.pop();
      }
    })
  }

  ionViewDidLoad(){
    // watch network for a disconnect

    /*this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected!');
      this.status = "disconnected";
      let vm = this;
      if(!vm.alertPresented){
        
      }
      vm.alertCtrl.create({
          title: 'Connectivity',
          subTitle: 'Your internet connectivity is not available. Please enable it and try again',
          buttons: ['Ok']
        }).present();
    });*/

    // watch network for a connection
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.status = "connected";
      //this.presentLoadingCustom();
    }); 
  }

  getAdImage(){
    
    this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

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
      this.ionViewDidLoad();
      this.presentLoadingDefault();
      this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      //headers.append('Authorization', 'Basic' + ('udorji:admin'));
      this.headers = {headers};

      //this.http.post('http://103.80.110.239:8080/dms/mobileLogin', this.headers).map(res => res.json()).subscribe(
      this.http.get(this.baseUrl+'/validatePassword?cidNumber='+this.cidNo+'&password='+this.password, this.headers).map(res => res.json()).subscribe(
        data => {
          //console.log(data);
          this.status = data[0].status;
          if(this.status==1){
            //check if user exists in sqlite
            this.sqliteprovider.getRegisteredCID().then(res => {
              if(res){
                //do nothing
              }
              else{
                this.sqliteprovider.registerUser('', '', '', '', this.cidNo);
              }
            });
            this.navCtrl.setRoot(DashboardPage, {param: this.cidNo});
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
          let toast = this.toastCtrl.create({
            message: 'There is some connection problem. Please try after sometime.',
            duration: 4000,
            position: 'middle',
            cssClass: 'errorMsg'
          });
        
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
        
          toast.present();
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
    this.callNumber.callNumber("1818", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

  //forgot password method
  forgotPassword(){
    this.navCtrl.push(ForgotpasswordPage);
  }

}
