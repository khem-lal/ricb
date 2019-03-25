import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BanklistPage } from '../banklist/banklist';

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

  finalcs: String;
  checksumComp: string[]=[];
  finalBankList: any[] = [];

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
      this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

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
                      cidNo: this.cidNo, policyNo: this.polNo, amount: this.amountToPay, type: 'credit'});
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

  validateNumber(e: any){
    let input = String.fromCharCode(e.charCode);
    const reg = /^\d*(?:[.,]\d{1,2})?$/;

    if (!reg.test(input)) {
      e.preventDefault();
    }
  }

}
