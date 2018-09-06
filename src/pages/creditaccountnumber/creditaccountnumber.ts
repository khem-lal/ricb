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
  paymentType: String;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, 
    public http: Http, public loadingCtrl: LoadingController, public inAppBrowser: InAppBrowser) {
      this.polNo = navParams.get('param');
      this.paymentType = navParams.get('payType');
     
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

      this.http.get(this.baseUrl+'/creditinvestmentdetails?accountNo='+this.polNo).map(res => res.json()).subscribe(
        data => {
          this.policyDtls = data;

          this.cidNo = data[0].CID_NO;
          this.custName = data[0].ACCOUNT_HOLDER;
          if(this.paymentType == "credit"){
            this.deptCode = "CI";
          }
          else{
            this.deptCode = "O";
          }
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
    var orderNo = Math.floor(1000000000 + Math.random() * 9000000000);
    this.insertPayment(orderNo);
    let alert = this.alertCtrl.create({
      title: 'Confirm Your Payment',    
      subTitle: 'Total Amount Payable is Nu. '+this.amountToPay+'<p> for Policy No: '+this.polNo+'</p>',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.amountToPay="1";
            this.paymentUrl = "https://apps.ricb.com.bt:8443/paymentgateway/ARapps.jsp?amtToPay="+this.amountToPay+
            "&id=C&policy_no="+this.polNo+"&order_No="+orderNo;
            let target = "_self";
            this.inAppBrowser.create(this.paymentUrl, target);
          }
        }
      ]
    }); 
    alert.present();
  }

  insertPayment(orderNo){
    console.log('insertpayment');
    this.baseUrl = 'https://apps.ricb.com.bt:8443/ricbapi/api/ricb';

    this.http.get(this.baseUrl+'/insertLifePayment?cidNo='+this.cidNo+'&custName='+this.custName+'&deptCode='+this.deptCode+'&policyNo='+this.policyNo+'&amount='+this.amountToPay+'&orderNo='+orderNo).map(res => res.json()).subscribe(
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
