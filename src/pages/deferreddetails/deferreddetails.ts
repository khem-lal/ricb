import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Http, RequestOptions } from '@angular/http';
import { BanklistPage } from '../banklist/banklist';

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
  quarterlyFlag: boolean = false;
  halfyearlyFlag: boolean = false;

  cidNo: String;
  custName: String;
  deptCode: String;
  policyNo: String;
  status: any;
  remitterCid: String;
  installment: any;

  finalcs: String;
  checksumComp: string[]=[];
  finalBankList: any[] = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, 
    public http: Http, public loadingCtrl: LoadingController, public inAppBrowser: InAppBrowser) {
      this.polNo = navParams.get('param');
      this.remitterCid = navParams.get('remitterCid');
     
      this.presentLoadingDefault();
      this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

      this.http.get(this.baseUrl+'/deferredannuitydetails?policyNo='+this.polNo).map(res => res.json()).subscribe(
        data => {
          this.policyDtls = data;
          this.premiumAmount = data[0].PREMIUMAMOUNT;
          this.premiumType = data[0].PREMIUMTYPE;

          this.cidNo = data[0].CITYZENSHIPID;
          this.custName = data[0].CUSTNAME;
          this.deptCode = "3";
          this.policyNo = data[0].PLOICY_NO;

          if(this.premiumType == "SSS" || this.premiumType == "Monthly"){
            this.monthlyFlag = true;
            this.quarterlyFlag = false;
            this.halfyearlyFlag = false;
            this.yearlyFlag = false;
          }
          else if(this.premiumType == 'Quaterly'){
            this.monthlyFlag = false;
            this.quarterlyFlag = true;
            this.yearlyFlag = false;
            this.halfyearlyFlag = false;
          }
          else if(this.premiumType == 'Half Yearly'){
            this.monthlyFlag = false;
            this.halfyearlyFlag = true;
            this.yearlyFlag = false;
            this.quarterlyFlag = false;
          }
          else{
            this.yearlyFlag = true;
            this.monthlyFlag = false;
            this.quarterlyFlag = false;
            this.halfyearlyFlag = false;
          }
          this.calculateInstallment();
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

  calculateInstallment(){
    // console.log(value);
    // if(value != 's'){
    //   if(value == 0){
    //     value = 1;
    //   }
      
    // }   
    if(this.installment == undefined){
      this.installment = 1;
    }

    this.premiumAmount = this.premiumAmount.replace(',', '');
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
              /*this.paymentUrl = "https://apps.ricb.com.bt:8443/paymentgateway/ARapps.jsp?amtToPay="+this.amountToPay+
              "&id=C&policy_no="+this.polNo+"&order_No="+orderNo;
              this.navCtrl.push(PaymentPage, {param: this.paymentUrl, type: "payment"});*/

              this.sendRequest(this.amountToPay).then(data=>
                {
                  this.finalcs=data.toString();
                  this.checksumComp=this.finalcs.split("&");
                  let txnId:string[]=this.checksumComp[0].split("=");
                  let status:string[]=this.checksumComp[1].split("=");
                  if(status[1]=="Success"){
                    let bankList:string[]=this.checksumComp[2].split("=");
                    let bankList1:string[]=bankList[1].split("~");
                    let bankList2:string[]=bankList[1].split("#");
                    for(let i =0; i<bankList2.length; i++){
                       
                      this.finalBankList.push({value: bankList2[i].split("~")[0], text: bankList2[(i)].split("~")[1]});
                    }

                    this.navCtrl.push(BanklistPage, {param: this.finalBankList, txnId: txnId[1], orderNo: orderNo, 
                      cidNo: this.cidNo, policyNo: this.polNo, amount: this.amountToPay, type: 'deferred'});
                    this.presentLoadingDefault();
                  }
                  
                 
                });
            }
          }
        ]
      }); 
      alert.present();
    }
  }

  sendRequest(amtToPay){
    let opt: RequestOptions;
    let myHeaders: Headers = new Headers;
    
    myHeaders.set('Accept','application/json; charset-utf-8');
    myHeaders.append('Content-type', 'apaplication/json; charset-utf-8');
    

    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/paymentrequest?messagetype=AR&amount='+amtToPay+
    '&email=feedback@ricb.bt',opt).map(res => res.text()).subscribe(data =>{ 
    //console.log("data is "+data);
      resolve(data); 
      });
    });
  }

  insertPayment(orderNo){
    console.log('insertpayment');
    this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

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
