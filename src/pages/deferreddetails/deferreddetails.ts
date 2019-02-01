import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http } from '@angular/http';
import { PaymentPage } from '../payment/payment';

@IonicPage()
@Component({
  selector: 'page-deferreddetails',
  templateUrl: 'deferreddetails.html',
})
export class DeferreddetailsPage {

  private baseUrl: String;
  polNo: any;
  policyDtls: any;
  amountToPay: any = 0;
  paymentUrl: any;
  premiumAmount: any;
  premiumType: String;
  monthlyFlag: boolean = false;
  yearlyFlag: boolean = false;

  cidNo: String;
  custName: String;
  deptCode: String;
  policyNo: String;
  status: any;
  remitterCid: String;
  installment: any;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, 
    public http: Http, public loadingCtrl: LoadingController, public inAppBrowser: InAppBrowser) {
      this.polNo = navParams.get('param');
      this.remitterCid = navParams.get('remitterCid');
     
      this.presentLoadingDefault();
      this.baseUrl = 'https://apps.ricb.bt:8443/ricbapi/api/ricb';

      this.http.get(this.baseUrl+'/deferredannuitydetails?policyNo='+this.polNo).map(res => res.json()).subscribe(
        data => {
          this.policyDtls = data;
          this.premiumAmount = data[0].PREMIUMAMOUNT;
          this.premiumType = data[0].PREMIUMTYPE;

          this.cidNo = data[0].CITYZENSHIPID;
          this.custName = data[0].CUSTNAME;
          this.deptCode = "3";
          this.policyNo = data[0].PLOICY_NO;

          if(this.premiumType == "SSS"){
            this.monthlyFlag = true;
          }else{
            this.yearlyFlag = true;
          }
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
    // console.log(value);
    // if(value != 's'){
    //   if(value == 0){
    //     value = 1;
    //   }
      
    // }   
    this.premiumAmount = this.premiumAmount.replace(',', '');
    //decimal pipe
    //this.decimalPipe.transform(this.premiumAmount, '1.0-0');
    //replace all special characters
    //this.premiumAmount = this.premiumAmount.replace(/[^a-zA-Z0-9]/g, ""); 
    //console.log(this.premiumAmount);
    this.amountToPay = this.premiumAmount * this.installment;
  }

  confirmpayment(){
    if(this.amountToPay == 0 || this.amountToPay == 'undefined'){
      let alert = this.alertCtrl.create({
        title: 'Message',    
        subTitle: 'Amount cannot be 0. Please select installment',
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
        subTitle: 'Total Amount Payable is Nu. '+this.amountToPay+' for Policy No: '+this.polNo,
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

}
