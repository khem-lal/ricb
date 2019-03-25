import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http, RequestOptions } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BanklistPage } from '../banklist/banklist';


/**
 * Generated class for the LifedetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lifedetails',
  templateUrl: 'lifedetails.html',
})
export class LifedetailsPage implements OnInit {

  private baseUrl: String;
  polNo: any;
  policyDtls: any;
  amountToPay: any = 0;
  premiumAmount: any;
  paymentUrl: any;
  paymentMode: String;
  monthlyFlag: boolean = false;
  quarterlyFlag: boolean = false;
  halfyearlyFlag: boolean = false;
  yearlyFlag: boolean = false;
  payButton: boolean = false;
  dateExceedMessage: boolean = false;
  lapsedMessage: boolean = false;
  paymentOption: boolean = false;

  cidNo: String;
  custName: String;
  deptCode: String;
  policyNo: String;
  status: any;
  datetime: any;
  nextRepayDate: any; 
  remitterCid: String; 
  payupButton: boolean = false;
  installment: any;
  public headers: any;
  finalcs: String;
  checksumComp: string[]=[];
  finalBankList: any[] = [];

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, 
    public http: Http, public loadingCtrl: LoadingController, public inAppBrowser: InAppBrowser) {
    this.datetime = new Date();
    this.polNo = navParams.get('param');
    this.remitterCid = navParams.get('remitterCid');
     
    this.presentLoadingDefault();
    this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';

    this.http.get(this.baseUrl+'/generalinsurancedetails?policyNo='+this.polNo).map(res => res.json()).subscribe(
      data => {
        this.policyDtls = data;
        this.premiumAmount = data[0].PREMIUM;
        this.paymentMode = data[0].P_MODE;
        this.nextRepayDate = data[0].NEXT_REPAY;

        this.cidNo = data[0].CUST_CID;
        this.custName = data[0].POLICY_HOLDER;
        this.deptCode = "2";
        this.policyNo = data[0].POLICY_NO;

        let curDate = new Date();
        console.log('current date is '+curDate);

        if(this.paymentMode == 'MONTHLY'){
          this.monthlyFlag = true;
          this.quarterlyFlag = false;
          this.halfyearlyFlag = false;
          this.yearlyFlag = false;
          this.paymentOption = true;
        }
        if(this.paymentMode == 'QUARTERLY'){
          this.monthlyFlag = false;
          this.halfyearlyFlag = false;
          this.yearlyFlag = false;
          this.quarterlyFlag = true;
          this.paymentOption = true;
        }
        if(this.paymentMode == 'HALF YEARLY'){
          this.halfyearlyFlag = true;
          this.monthlyFlag = false;
          this.quarterlyFlag = false;
          this.yearlyFlag = false;
          this.paymentOption = true;
        }
        if(this.paymentMode == 'YEARLY'){
          this.yearlyFlag = true;
          this.halfyearlyFlag = false;
          this.monthlyFlag = false;
          this.quarterlyFlag = false;
          this.paymentOption = true;
        }
        
        /* if(Date.parse(this.nextRepayDate) > Date.parse(curDate)){
          this.payButton = false;
          this.dateExceedMessage = true;
        }
        else{
          this.payButton = true;
          this.dateExceedMessage = false;
        } */
        if(data[0].POLSTATUS == 'ACTIVE'){
          this.payButton = true;
          this.dateExceedMessage = false;
        }
        else if(data[0].POLSTATUS == 'LAPSED'){
          this.payButton = false;
          this.lapsedMessage = true;
        }
        else{
          this.payButton = false;
          this.lapsedMessage = false;
          this.payupButton = true;
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
    
    // if(value != 's'){
       //console.log(this.installment);
      //  if(value == 0){
      //    value = 2;
      //  }
       
    // }
    if(this.installment == undefined){
      this.installment = 1;
    }
    this.premiumAmount = this.premiumAmount.replace(',', '');
    this.amountToPay = this.premiumAmount * this.installment;    
  }

  confirmpayment(){
    if(this.amountToPay == 0){
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

    }
    else{
      var orderNo = Math.floor(1000000000 + Math.random() * 9000000000);
      //this.amountToPay=1;
      this.insertPayment(orderNo);
      let alert = this.alertCtrl.create({
        title: 'Confirm Your Payment',    
        subTitle: 'Total Amount Payable is Nu. '+this.amountToPay+' for Policy No: '+this.polNo,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              ////this.paymentUrl = "https://apps.ricb.com.bt:8443/paymentgateway/ARapps.jsp?amtToPay="+this.amountToPay+
              ////"&id=C&policy_no="+this.polNo+"&order_No="+orderNo;
              //let target = "_self";
              //this.inAppBrowser.create(this.paymentUrl, target, 'location=false');
              
              ////////this.navCtrl.push(PaymentPage, {param: this.paymentUrl, type: "payment"});

              
              this.sendRequest(this.amountToPay).then(data=>
                {
                  this.finalcs=data.toString();
                  //console.log("Before split "+this.finalcs);
                  this.checksumComp=this.finalcs.split("&");
                  //console.log(this.checksumComp);
                  let txnId:string[]=this.checksumComp[0].split("=");
                  console.log(txnId);
                  let status:string[]=this.checksumComp[1].split("=");
                  if(status[1]=="Success"){
                    let bankList:string[]=this.checksumComp[2].split("=");
                    //console.log(bankList);
                    let bankList1:string[]=bankList[1].split("~");
                    //console.log(bankList1);
                    let bankList2:string[]=bankList[1].split("#");
                    //console.log(bankList2);
                    for(let i =0; i<bankList2.length; i++){
                       
                      this.finalBankList.push({value: bankList2[i].split("~")[0], text: bankList2[(i)].split("~")[1]});
                      //console.log(this.finalBankList); 
                    }

                    this.navCtrl.push(BanklistPage, {param: this.finalBankList, txnId: txnId[1], orderNo: orderNo, 
                      cidNo: this.cidNo, policyNo: this.polNo, amount: this.amountToPay, type: 'life'});
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

    this.http.get(this.baseUrl+'/insertLifePayment?cidNo='+this.cidNo+'&custName='+this.custName+'&deptCode='+this.deptCode+'&policyNo='+this.policyNo+'&amount='+this.premiumAmount+'&orderNo='+orderNo+'&remitterCid='+this.remitterCid).map(res => res.json()).subscribe(
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

  ngOnInit(){
    /*setTimeout(() => {
        // this.navCtrl.popToRoot();
        // might try this instead
        
        let alert = this.alertCtrl.create({
          title: 'Session Timeout',    
          subTitle: 'Your session is inactive. Please login again.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.navCtrl.setRoot(HomePage);
              }
            }
          ]
        }); 
        alert.present();
    }, 50000);*/
}

}
