import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LifedetailsPage } from '../lifedetails/lifedetails';
import { CreditaccountnumberPage } from '../creditaccountnumber/creditaccountnumber';
import { GeneraldetailsPage } from '../generaldetails/generaldetails';
import { DeferreddetailsPage } from '../deferreddetails/deferreddetails';
import { ImmediatedetailsPage } from '../immediatedetails/immediatedetails';
import { OthersPage } from '../others/others';
declare var pdf: any;
/**
 * Generated class for the PolicynumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-policynumber',
  templateUrl: 'policynumber.html',
})
export class PolicynumberPage {

  private baseUrl: String;
  policyForm: FormGroup;
  public policyNo: any[];
  public policyDtls: any[];
  public headers: any;
  cidNo: String;
  policyType: String;
  lifeFlag: boolean = false;
  creditFlag: boolean = false;
  generalFlag: boolean = false;
  deferredFlag: boolean = false;
  deferredPolFlag: boolean = false;
  immediatePolFlag: boolean = false;
  othersFlag: boolean = false;
  reportFlag: boolean = false;
  ppfReportFlag: boolean = false;
  

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.policyForm = this.formBuilder.group({
    });
    this.cidNo = navParams.get('cid');
    this.policyNo = navParams.get('param');
    this.policyType = navParams.get('type');
    //let cid = this.cidNo;
    //this.presentLoadingDefault();
    //this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    // let headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // this.headers = {headers};

    //let ownurl="";
    if(this.policyType == "life"){
      //ownurl = "/generalinsurance";
      this.lifeFlag = true;
    }
    if(this.policyType == "credit"){
      //ownurl = "/creditinvestment";
      
      this.creditFlag = true;
    }
    if(this.policyType == "general"){
      //ownurl = "/geninsurance";
      this.generalFlag = true;
    }
    if(this.policyType == "defferedannuity"){
      this.deferredFlag = true;
      return;
    }
    if(this.policyType == "defferedpolicyno"){
      this.deferredPolFlag = true;
    }
    if(this.policyType == "immediatepolicyno"){
      this.immediatePolFlag = true;
    }  
    if(this.policyType == "payforothers"){
      this.othersFlag = true;
      return;
    }
    if(this.policyType == "report"){
      this.reportFlag = true;
      return;
    }
    
    
    // this.http.get(this.baseUrl+ownurl+'?cidNo='+cid, this.headers).map(res => res.json()).subscribe(
    //   data => {
    //     this.policyNo = data;
    //     if(data == ""){
    //       return false;
    //     }
    //   },
    //   err => {
    //     console.log("Error fetching data");
    //   }
    // );
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 1000);
  }

  policyDetails(polNo, type){
    if(type == "life"){
      this.navCtrl.push(LifedetailsPage, {param: polNo});
    }
    if(type == "credit"){
      this.navCtrl.push(CreditaccountnumberPage, {param: polNo});
    }
    if(type == "general"){
      this.navCtrl.push(GeneraldetailsPage, {param: polNo});
    }
    if(type== "deferred"){
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};
      this.http.get(this.baseUrl+'/deferredannuity?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
        data => {
          this.policyNo = data;
          if(data == ""){
            let alert = this.alertCtrl.create({
              cssClass:'error',
              subTitle: 'You dont have deferred annuity account with RICB',
              buttons: [
                {
                  text: 'OK'
                }
              ]
            }); 
            alert.present();
          }
          else{
            this.navCtrl.push(PolicynumberPage, {param: this.policyNo, type: "defferedpolicyno"});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
    }
    if(type== "immediate"){
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};
      this.http.get(this.baseUrl+'/immediateannuity?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
        data => {
          this.policyNo = data;
          if(data == ""){
            let alert = this.alertCtrl.create({
              cssClass:'error',
              subTitle: 'You dont have immediate annuity account with RICB',
              buttons: [
                {
                  text: 'OK'
                }
              ]
            }); 
            alert.present();
          }
          else{
            this.navCtrl.push(PolicynumberPage, {param: this.policyNo, type: "immediatepolicyno"});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
    }
    if(type== "deferreddetails"){
      this.navCtrl.push(DeferreddetailsPage, {param: polNo});
    }
    if(type== "immediatedetails"){
      this.navCtrl.push(ImmediatedetailsPage, {param: polNo});
    }
    if(type== "creditOthers"){
      this.navCtrl.push(OthersPage, {param: "credit"});
    }
    if(type== "lifeOthers"){
      this.navCtrl.push(OthersPage, {param: "life"});
    }
    if(type== "deferredOthers"){
      this.navCtrl.push(OthersPage, {param: "deferred"});
    }
    if(type== "ppfReport"){
      document.addEventListener('deviceready', function(){
      let options = {
        documentSize: 'A4',
        type: 'share',
        fileName: 'myFile.pdf'
      }

      pdf.fromData( '<html><h1>Hello World</h1></html>', options)
      .then((stats)=> console.log('status', stats) )   // ok..., ok if it was able to handle the file to the OS.  
      .catch((err)=>console.error(err))
      //this.ppfReportFlag = true;
      })
    }
  }

}
