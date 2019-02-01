import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController, Events } from 'ionic-angular';
import { Http } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LifedetailsPage } from '../lifedetails/lifedetails';
import { CreditaccountnumberPage } from '../creditaccountnumber/creditaccountnumber';
import { GeneraldetailsPage } from '../generaldetails/generaldetails';
import { DeferreddetailsPage } from '../deferreddetails/deferreddetails';
import { ImmediatedetailsPage } from '../immediatedetails/immediatedetails';
import { OthersPage } from '../others/others';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PaymentPage } from '../payment/payment';
import { EmailComposer } from '@ionic-native/email-composer';
//declare var pdf: any;
//declare let cordova: any;
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
  creditTitle: boolean = false;
  policyTitle: boolean = false;
  payothersTitle: boolean = false;
  reportTitle: boolean = false;
  loanDateFlag: boolean = false;
  fromDate: string;
  toDate: string;
  

  constructor(public navCtrl: NavController, public inAppBrowser: InAppBrowser, public formBuilder: FormBuilder, 
    public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController,  private email: EmailComposer,
    public alertCtrl: AlertController, private toastCtrl: ToastController, public events: Events) {
    
    this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';
    this.policyForm = this.formBuilder.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
    //this.fromDate = new Date().toISOString();
    this.cidNo = navParams.get('cid');
    this.events.publish('userloggedin', this.cidNo);

    this.policyNo = navParams.get('param');
    this.policyType = navParams.get('type');
    
    if(this.policyType == "life"){
      this.lifeFlag = true;
      this.policyTitle = true;
    }
    if(this.policyType == "credit"){      
      this.creditFlag = true;
      this.creditTitle = true;
    }
    if(this.policyType == "general"){
      this.generalFlag = true;
      this.policyTitle = true;
    }
    if(this.policyType == "defferedannuity"){
      this.deferredFlag = true;
      this.policyTitle = true;
      return;
    }
    if(this.policyType == "defferedpolicyno"){
      this.deferredPolFlag = true;
      this.policyTitle = true;
    }
    if(this.policyType == "immediatepolicyno"){
      this.immediatePolFlag = true;
      this.policyTitle = true;
    }  
    if(this.policyType == "payforothers"){
      this.othersFlag = true;
      this.payothersTitle = true;
      return;
    }
    if(this.policyType == "report"){
      this.reportFlag = true;
      this.reportTitle = true;
      return;
    }
    if(this.policyType == "loanReport"){
      this.loanReportFlag = true;
      this.creditTitle = true;
    }
    if(this.policyType == "gisReport"){
      this.gisReportFlag = true;
      this.policyTitle = true;
    }
    if(this.policyType == "ppfReport"){
      this.ppfReportFlag = true;
      this.policyTitle = true;
    }
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }

  policyDetails(polNo, type){
    if(type == "life"){
      this.navCtrl.push(LifedetailsPage, {param: polNo, remitterCid: this.cidNo});
    }
    if(type == "credit"){
      this.navCtrl.push(CreditaccountnumberPage, {param: polNo, payType: type, remitterCid: this.cidNo});
    }
    if(type == "general"){
      this.navCtrl.push(GeneraldetailsPage, {param: polNo});
    }
    if(type== "deferred"){
      this.presentLoadingDefault();
      //this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

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
            this.navCtrl.push(PolicynumberPage, {param: this.policyNo, type: "defferedpolicyno", remitterCid: this.cidNo});
          }
        },
        err => {
          console.log("Error fetching data");
        }
      );
    }
    if(type== "immediate"){
      this.presentLoadingDefault();
      //this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

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
      this.navCtrl.push(OthersPage, {param: "credit", remitterCid: this.cidNo});
    }
    if(type == "lifeOthers"){
      this.navCtrl.push(OthersPage, {param: "life", remitterCid: this.cidNo});
    }
    if(type == "deferredOthers"){
      this.navCtrl.push(OthersPage, {param: "deferred", remitterCid: this.cidNo});
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
    }
    if(type == "loanReport"){
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

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
      this.loanDateFlag = true;
    }
    if(type == "loanReportSubmit"){
      console.log(this.fromDate);
      this.presentLoadingDefault();
      //this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';      
      let pdfurl = 'http://apps.ricb.bt/san/report/loan-memo.php?CREDIT_ID='+polNo+'&FROM_DATE='+this.fromDate+'&TO_DATE='+this.toDate;
      //let target = "_self";
      //this.inAppBrowser.create(pdfurl, target);
      this.navCtrl.push(PaymentPage, {param: pdfurl, type: "report"}, this.headers);

        //store in local storage
        /*this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(status => {
          if (status.hasPermission) {
            let path = null;
 
            if (this.platform.is('ios')) {
              path = this.file.documentsDirectory;
            } else if (this.platform.is('android')) {
              path = cordova.file.externalDataDirectory;
              console.log("path is "+path);
            }
        
            const transfer = this.transfer.create();
            //this.cordova.file.externalApplicationStorageDirectory
            //this.filePath.resolveNativePath(path).then(filePath => console.log(filePath));
    
    
            transfer.download(pdfurl.toString(), path + 'RICB Statements.pdf').then(entry => {
              let url = entry.toURL();
              this.document.viewDocument(url, 'application/pdf', {});
              //this.storage.set('Statement', url);
            });
          } else {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status =>{
              let path = null;
 
        if (this.platform.is('ios')) {
          path = this.file.documentsDirectory;
        } else if (this.platform.is('android')) {
          path = cordova.file.externalDataDirectory;
          console.log("path is "+path);
        }
    
        const transfer = this.transfer.create();
        //this.cordova.file.externalApplicationStorageDirectory
        //this.filePath.resolveNativePath(path).then(filePath => console.log(filePath));


        transfer.download(pdfurl.toString(), path + 'Statements.pdf').then(entry => {
          let url = entry.toURL();
          this.document.viewDocument(url, 'application/pdf', {});
          //this.storage.set('Statement', url);
        });
            });
          }
        });*/
    }
    if(type == "gisReportPdf"){
      this.presentLoadingDefault();
      let pdfurl = 'http://apps.ricb.bt/san/report/gis-memo.php?cid='+this.cidNo;
      this.navCtrl.push(PaymentPage, {param: pdfurl, type: "report"});
    }
    if(type == "ppfReportPdf"){
      this.presentLoadingDefault();
      let pdfurl = 'https://apps.ricb.bt/san/report/ppf-memo.php?cid='+this.cidNo;
      this.navCtrl.push(PaymentPage, {param: pdfurl, type: "report"}, this.headers);

      //this.sendMail(pdfurl);


      /*let path = null;
 
      if (this.platform.is('ios')) {
        path = this.file.documentsDirectory;
      } else if (this.platform.is('android')) {
        path = this.file.dataDirectory;
      }
  
      const transfer = this.transfer.create();
      transfer.download(pdfurl.toString(), path + 'Statements.pdf').then(entry => {
        let url = entry.toURL();
        this.document.viewDocument(url, 'application/pdf', {});
      });*/
    }

  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle',
      cssClass: 'errorMsg'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  sendMail(pdfurl){
    let email = {
      to: 'khemlallica@gmail.com',
      cc: '',
      attachments: [
        pdfurl
      ],
      subject: 'My Cool Image',
      body: 'Hey Simon, what do you thing about this image?',
      isHtml: true
    };
    this.email.open(email);
  }

}
