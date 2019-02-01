import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PaymentPage } from '../payment/payment';

@IonicPage()
@Component({
  selector: 'page-creditaccountnumber',
  templateUrl: 'creditaccountnumber.html',
})
export class CreditaccountnumberPage {

  private baseUrl: String;
  polNo: any;
  policyDtls: any;
  amountToPay:  any;
  paymentUrl: any;

  cidNo: String;
  custName: String;
  deptCode: String;
  policyNo: String;
  status: any;
  paymentType: String;
  payButton: boolean = false;
  statusMessage: boolean = false;
  policyStatus: String;
  remitterCid: String;
  paymentOption: boolean = false;
  amtToPay: boolean = false;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, 
    public http: Http, public loadingCtrl: LoadingController, public inAppBrowser: InAppBrowser) {
      //this.amountToPay = 0;
      this.polNo = navParams.get('param');
      this.paymentType = navParams.get('payType');
      this.remitterCid = navParams.get('remitterCid');
      //this.decimalPipe.transform(this.amountToPay, '1.2-2');
     
      this.paymentOption = true;
      this.amtToPay = true;
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

      this.http.get(this.baseUrl+'/creditinvestmentdetails?accountNo='+this.polNo).map(res => res.json()).subscribe(
        data => {
          this.policyDtls = data;
          this.cidNo = data[0].CID_NO;
          this.custName = data[0].ACCOUNT_HOLDER;
          this.policyStatus = data[0].STATUS;
          if(this.policyStatus == 'Active Credit'){
            this.payButton = true;
            this.statusMessage = false;
          }
          else{
            this.payButton = false;
            this.statusMessage = true;
          }

          if(this.paymentType == "credit"){
            this.deptCode = "1";
          }
          else{
            this.deptCode = "5";
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
    if(this.amountToPay == 0 || this.amountToPay == undefined || this.amountToPay == ''){
      let alert = this.alertCtrl.create({
        title: 'Message',    
        subTitle: 'Amount cannot be empty.',
        buttons: [
          {
            text: 'OK'
          }
        ]
      }); 
      alert.present();
      return;
    }
    else{
      var orderNo = Math.floor(1000000000 + Math.random() * 9000000000);
      this.insertPayment(orderNo);
      let alert = this.alertCtrl.create({
        title: 'Confirm Your Payment',    
        subTitle: 'Total Amount Payable is Nu. '+this.amountToPay+' for Loan account number: '+this.polNo,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              //this.amountToPay="1";
              this.paymentUrl = "https://apps.ricb.bt:8443/paymentgateway/ARapps.jsp?amtToPay="+this.amountToPay+
              "&id=C&policy_no="+this.polNo+"&order_No="+orderNo;
              // let target = "_self";
              // this.inAppBrowser.create(this.paymentUrl, target);
              this.navCtrl.push(PaymentPage, {param: this.paymentUrl, type: "payment"});
            }
          }
        ]
      }); 
      alert.present();
    }
    
  }

  insertPayment(orderNo){
    console.log('insertpayment');
    this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

    this.http.get(this.baseUrl+'/insertLifePayment?cidNo='+this.cidNo+'&custName='+this.custName+'&deptCode='+this.deptCode+'&policyNo='+this.policyNo+'&amount='+this.amountToPay+'&orderNo='+orderNo+'&remitterCid='+this.remitterCid).map(res => res.json()).subscribe(
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

  validateNumber(e: any){
    let input = String.fromCharCode(e.charCode);
    const reg = /^\d*(?:[.,]\d{1,2})?$/;

    if (!reg.test(input)) {
      e.preventDefault();
    }
  }

}
