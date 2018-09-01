import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-deferreddetails',
  templateUrl: 'deferreddetails.html',
})
export class DeferreddetailsPage {

  private baseUrl: String;
  polNo: any;
  policyDtls: any;
  amountToPay: any;
  paymentUrl: any;
  premiumAmount: any;

  cidNo: String;
  custName: String;
  deptCode: String;
  policyNo: String;
  status: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, 
    public http: Http, public loadingCtrl: LoadingController, public inAppBrowser: InAppBrowser) {
      this.polNo = navParams.get('param');
     
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      this.http.get(this.baseUrl+'/deferredannuitydetails?policyNo='+this.polNo).map(res => res.json()).subscribe(
        data => {
          this.policyDtls = data;
          this.premiumAmount = data[0].PREMIUMAMOUNT;

          this.cidNo = data[0].CITYZENSHIPID;
          this.custName = data[0].CUSTNAME;
          this.deptCode = "DA";
          this.policyNo = data[0].PLOICY_NO;
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
    }, 500);
  }

  calculateInstallment(value){
    console.log(value);
    if(value != 's'){
      if(value == 0){
        value = 1;
      }
      this.amountToPay = this.premiumAmount * value;
    }    
  }

  confirmpayment(){
    this.insertPayment();
    let alert = this.alertCtrl.create({
      title: 'Confirm Your Payment',    
      subTitle: 'Total Amount Payable is Nu. '+this.amountToPay+'<p> for Policy No: '+this.polNo+'</p>',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            
            this.paymentUrl = "https://apps.ricb.com.bt:8443/paymentgateway/ARapps.jsp?amtToPay="+this.amountToPay+
            "&id=C&policy_no="+this.polNo;
            let target = "_self";
            this.inAppBrowser.create(this.paymentUrl, target);
          }
        }
      ]
    }); 
    alert.present();
  }

  insertPayment(){
    console.log('insertpayment');
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    this.http.get(this.baseUrl+'/insertLifePayment?cidNo='+this.cidNo+'&custName='+this.custName+'&deptCode='+this.deptCode+'&policyNo='+this.policyNo+'&amount='+this.amountToPay).map(res => res.json()).subscribe(
      data => {
        this.status = data;
        if(this.status == "1"){
          console.log('payment inserted');
        }
      },
      err => {
        console.log("Error fetching data");
      }
    );
  }

}
