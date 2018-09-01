import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-creditaccountnumber',
  templateUrl: 'creditaccountnumber.html',
})
export class CreditaccountnumberPage {

  private baseUrl: String;
  polNo: any;
  policyDtls: any;
  amountToPay: any;
  paymentUrl: any;

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

      this.http.get(this.baseUrl+'/creditinvestmentdetails?accountNo='+this.polNo).map(res => res.json()).subscribe(
        data => {
          this.policyDtls = data;

          this.cidNo = data[0].CID_NO;
          this.custName = data[0].ACCOUNT_HOLDER;
          console.log(this.custName);
          this.deptCode = "CI";
          this.policyNo = data[0].ACCOUNT_NO;
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
