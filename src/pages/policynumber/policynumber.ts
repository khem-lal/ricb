import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LifedetailsPage } from '../lifedetails/lifedetails';
import { CreditaccountnumberPage } from '../creditaccountnumber/creditaccountnumber';
import { GeneraldetailsPage } from '../generaldetails/generaldetails';
import { DeferreddetailsPage } from '../deferreddetails/deferreddetails';
import { ImmediatedetailsPage } from '../immediatedetails/immediatedetails';
import { OthersPage } from '../others/others';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { InAppBrowser } from '@ionic-native/in-app-browser';
//declare var pdf: any;
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
  loanReportFlag: boolean = false;
  gisReportFlag: boolean = false;
  

  constructor(public navCtrl: NavController, public inAppBrowser: InAppBrowser, public formBuilder: FormBuilder, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private toastCtrl: ToastController) {
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';
    this.policyForm = this.formBuilder.group({
    });
    this.cidNo = navParams.get('cid');
    this.policyNo = navParams.get('param');
    this.policyType = navParams.get('type');
    
    if(this.policyType == "life"){
      this.lifeFlag = true;
    }
    if(this.policyType == "credit"){      
      this.creditFlag = true;
    }
    if(this.policyType == "general"){
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
    if(this.policyType == "loanReport"){
      this.loanReportFlag = true;
    }
    if(this.policyType == "gisReport"){
      this.gisReportFlag = true;
    }
    if(this.policyType == "ppfReport"){
      this.ppfReportFlag = true;
    }
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
      this.navCtrl.push(CreditaccountnumberPage, {param: polNo, payType: type});
    }
    if(type == "general"){
      this.navCtrl.push(GeneraldetailsPage, {param: polNo});
    }
    if(type== "deferred"){
      this.presentLoadingDefault();
      //this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

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
      //this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

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
    if(type == "lifeOthers"){
      this.navCtrl.push(OthersPage, {param: "life"});
    }
    if(type == "deferredOthers"){
      this.navCtrl.push(OthersPage, {param: "deferred"});
    }
    if(type == "ppfReport"){
      this.presentLoadingDefault();

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      this.http.get(this.baseUrl+'/ppfmemo?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
        data => {
          this.policyNo = data;
          if(data == ""){
            this.presentToast("You dont have a PPF account with RICB");
          }
          else{
            this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "ppfReport"});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );

      // pdfmake.vfs = pdfFonts.pdfMake.vfs;
      // var docDefinition = {
      // content: [
      // {
      //   columns: [
      //   {
      //   image: 'data:image/jpeg;base64,your_image_here',
      //   fit: [100, 100]
      //   },
      //   [
      //     { text: 'BITCOIN', style: 'header' },
      //     { text: 'Cryptocurrency Payment System', style: 'sub_header' },
      //   { text: 'WEBSITE: https://bitcoin.org/', style: 'url' },
      //   ]
      //   ]
      // }
      // ],
      // styles: {
      // header: {
      // bold: true,
      // fontSize: 20,
      // alignment: 'right'
      // },
      // sub_header: {
      // fontSize: 18,
      // alignment: 'right'
      // },
      // url: {
      // fontSize: 16,
      // alignment: 'right'
      // }
      // },
      // pageSize: 'A4',
      // pageOrientation: 'portrait'
      // };
      // pdfmake.createPdf(docDefinition).open();
      
    }
    if(type == "loanReport"){
      this.presentLoadingDefault();
      //this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      this.http.get(this.baseUrl+'/creditinvestment?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
        data => {
          this.policyNo = data;
          if(data == ""){
            this.presentToast("You dont have a credit account with RICB");
          }
          else{
            this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "loanReport"});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
    }
    if(type == "gisReport"){
      this.presentLoadingDefault();

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      this.http.get(this.baseUrl+'/gis?cidNo='+this.cidNo, this.headers).map(res => res.json()).subscribe(
        data => {
          this.policyNo = data;
          if(data == ""){
            this.presentToast("You dont have a GIS account with RICB");
          }
          else{
            this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "gisReport"});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
    }
    
    if(type == "loanReportPdf"){
      this.presentLoadingDefault();
      //this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.headers = {headers};

      // this.http.get('http://apps.ricb.com.bt/san/report/loan-memo.php?CREDIT_ID='+polNo, this.headers).map(res => res.json()).subscribe(
      //   data => {
      //     //this.policyNo = data;
      //     if(data == ""){
      //       this.presentToast("You dont have a credit account with RICB");
      //     }
      //     else{
      //       this.navCtrl.push(PolicynumberPage, {param: this.policyNo, cid: this.cidNo, type: "loanReport"});
      //     }
      //   },
      //   err => {
      //     console.log("Error fetching data");
      //   }
      // );

        let pdfurl = 'http://apps.ricb.com.bt/san/report/loan-memo.php?CREDIT_ID='+polNo;
        let target = "_self";
        this.inAppBrowser.create(pdfurl, target);
    }
    if(type == "gisReportPdf"){
      this.presentLoadingDefault();
      let pdfurl = 'http://apps.ricb.com.bt/san/report/gis-memo.php?cid='+this.cidNo;
      let target = "_self";
      this.inAppBrowser.create(pdfurl, target);
    }
    if(type == "ppfReportPdf"){
      this.presentLoadingDefault();
      let pdfurl = 'http://apps.ricb.com.bt/san/report/ppf-memo.php?cid='+this.cidNo;
      let target = "_self";
      this.inAppBrowser.create(pdfurl, target);
    }

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
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
