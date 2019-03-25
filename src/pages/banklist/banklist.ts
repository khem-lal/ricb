import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { RequestOptions, Http } from '@angular/http';
import { LifedetailsPage } from '../lifedetails/lifedetails';
import { CreditaccountnumberPage } from '../creditaccountnumber/creditaccountnumber';
import { DeferreddetailsPage } from '../deferreddetails/deferreddetails';

/**
 * Generated class for the BanklistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-banklist',
  templateUrl: 'banklist.html',
})
export class BanklistPage {
  bankList: any[] = [];
  bankName: any;
  bankAccNo: any;
  transactionId: any;
  baseUrl: String;
  finalcs: String;
  checksumComp: string[]=[];
  drResp:string;
  drRespData:string[]=[];
  bfs_bfsTxnId:any;
  orderNo: any;
  public headers: any;
  cidNumber: any;
  policyNumber: any;
  txnAmount: any;
  policyType: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

    this.bankList = navParams.get('param');
    this.transactionId = navParams.get('txnId');
    this.cidNumber = navParams.get('cidNo');
    this.policyNumber = navParams.get('policyNo');
    this.txnAmount = navParams.get('amount');
    this.policyType = navParams.get('type');
    this.baseUrl = 'http://apps.ricb.bt:8080/ricbapi/api/ricb';
    this.orderNo = navParams.get('orderNo');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BanklistPage');
  }

  submitAccountDetails(){
    console.log(this.cidNumber);
    this.presentLoadingDefault();
    this.sendRequest(this.bankAccNo, this.bankName, this.transactionId).then(data=>
      {
        this.finalcs=data.toString();
        //console.log("Before split "+this.finalcs);
        this.checksumComp=this.finalcs.split("&");
        //console.log(this.checksumComp);
        //let txnId:string[]=this.checksumComp[0].split("=");
        //console.log(txnId);
        let status:string[]=this.checksumComp[0].split("=");
        if(status[1]=="Success"){
          let alert = this.alertCtrl.create({
            title: 'OTP Confirmation',    
            subTitle: 'You will receive code shortly, Please enter below',
            inputs:[
              {
                type:'number',
                name:'otp',
                placeholder:'Enter OTP code here'
              }
            ],
            buttons: [
              {
                text: 'Confirm',
                handler: (data) => {
                  console.log("txnId="+this.transactionId);

                  if(data.otp=="")
                  {
                    //do nothing
                  }
                  else{
                    this.presentLoadingDefault();
                    this.sendDRRequest(this.transactionId, data.otp).then(data=>
                      {
                        console.log(data);
                        this.drResp=data.toString();
                        this.drRespData=this.drResp.split("&");
                        let debitAuthCode:string[]=this.drRespData[9].split("=");
                        let bfs_remitterBankId:string[]=this.drRespData[7].split("=");
                        console.log("bfs_remitterBankId = "+bfs_remitterBankId[1]);
                        let txnTime:string[]=this.drRespData[5].split("=");
                        let date:string=txnTime[1].charAt(0)+txnTime[1].charAt(1)+txnTime[1].charAt(2)+txnTime[1].charAt(3)+"/"+txnTime[1].charAt(4)+txnTime[1].charAt(5)+"/"+txnTime[1].charAt(6)+txnTime[1].charAt(7);
                        let hour:string=txnTime[1].charAt(8)+txnTime[1].charAt(9);
                        let minute:string=txnTime[1].charAt(10)+txnTime[1].charAt(11);
                        let seconds:string=txnTime[1].charAt(12)+txnTime[1].charAt(13)
                        let amorpm:string;
                        if(parseInt(hour)>12)
                        {
                          let h:any=parseInt(hour)-12;
                          hour=h.toString();
                          amorpm="PM";
                        }
                        else if(parseInt(hour)==12)
                        {
                          amorpm="PM";
                        }
                        else
                        {
                          amorpm="AM";
                        }
                        let time:string=hour+":"+minute+":"+seconds+" "+amorpm;
                        //console.log("auth code:"+debitAuthCode[1])
                        let typeOfPolicy = null;
                        if(this.policyType == "credit"){
                          typeOfPolicy = "Loan Account";
                        }
                        else{
                          typeOfPolicy = "Policy";
                        }

                        if(debitAuthCode[1]=="00")
                        {
                          this.alertGeneral("Success","You have successfully paid Nu."+this.txnAmount+" for your "+typeOfPolicy+" "+this.policyNumber+" on "+date+" at "+time+". Your Transaction Id: "+this.transactionId);                  
                        }
                        else if(debitAuthCode[1]=="03"){
                          this.alertGeneral("Error",`Message: Invalid Beneficiary.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="05"){
                          this.alertGeneral("Error",`Message: Beneficiary Account Closed.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="06"){
                          this.alertGeneral("Error",`Message: Insufficient Funds.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="12"){
                          this.alertGeneral("Error",`Message: Invalid Transaction.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="13"){
                          this.alertGeneral("Error",`Message: Invalid Amount.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="14"){
                          this.alertGeneral("Error",`Message: Account number invalid.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="30"){
                          this.alertGeneral("Error",`Message: Format Error.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="45"){
                          this.alertGeneral("Error",`Message: Duplicate Beneficiary Order No.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="47"){
                          this.alertGeneral("Error",`Message: Invalid Currency.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="48"){
                          this.alertGeneral("Error",`Message: Transaction Limit Exceeded.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="51"){
                          this.alertGeneral("Error",`Message: Insufficient Funds.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="53"){
                          this.alertGeneral("Error",`Message: No saving account.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="57"){
                          this.alertGeneral("Error",`Message: Transaction not permitted.<br>Transaction Id: `+this.transactionId);
                        }
                        else if(debitAuthCode[1]=="55")
                        {
                          this.alertGeneral("Error",`Message: Incorrect OTP code. Please try again.<br>Transaction Id: `+this.transactionId);                  
                        }
                        else{
                          this.alertGeneral("Error",`Sorry something went wrong. Please Try Again.<br>Transaction Id:`+this.transactionId);
                        }

                        this.updatePayment(this.transactionId, bfs_remitterBankId[1], this.bankAccNo, debitAuthCode[1]);
                        
                      });

                  }
                  
                }
              }
            ]
          }); 
          alert.present();

          
        }
        else{
          let alert = this.alertCtrl.create({
            title: 'Error',    
            subTitle: 'Something went wrong while trying to send OTP. Please try again.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  if(this.policyType == "life"){
                    this.navCtrl.push(LifedetailsPage, {param: this.policyNumber, remitterCid: this.cidNumber});
                  }
                  if(this.policyType == "credit"){
                    this.navCtrl.push(CreditaccountnumberPage, {param: this.policyNumber, payType: this.policyType, remitterCid: this.cidNumber});
                  }
                  /*if(this.policyType == "general"){
                    this.navCtrl.push(GeneraldetailsPage, {param: polNo});
                  }*/
                  if(this.policyType== "deferred"){
                    this.navCtrl.push(DeferreddetailsPage, {param: this.policyNumber, remitterCid: this.cidNumber});
                  }
                }
              }
            ]
          }); 
          alert.present();
        }
        
       
      });
  }

  sendRequest(bankAccNo, bankName, transactionId){
    let opt: RequestOptions;
    let myHeaders: Headers = new Headers;
    
    myHeaders.set('Accept','application/json; charset-utf-8');
    myHeaders.append('Content-type', 'apaplication/json; charset-utf-8');

    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/accountenq?messagetype=AE&benf_TxnId='+transactionId+
    '&bfs_remitterBankId='+bankName+'&bfs_remitterAccNo='+bankAccNo,opt).map(res => res.text()).subscribe(data =>{ 
    //console.log("data is "+data);
      resolve(data); 
      });
    });
  }

  sendDRRequest(transactionId, otp){
    let opt: RequestOptions;
    let myHeaders: Headers = new Headers;
    
    myHeaders.set('Accept','application/json; charset-utf-8');
    myHeaders.append('Content-type', 'apaplication/json; charset-utf-8');
    

    return new Promise(resolve => {
      this.http.post(this.baseUrl+'/finalPaymentRequest?messagetype=DR&benf_TxnId='+transactionId+
    '&bfs_remitterOtp='+otp,opt).map(res => res.text()).subscribe(data =>{ 
      //console.log("data is "+data);
      resolve(data); 
      });
    });
  }

  alertGeneral(header:string,message:string){
    let alert = this.alertCtrl.create({
      title: header,    
      subTitle: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if(this.policyType == "life"){
              this.navCtrl.push(LifedetailsPage, {param: this.policyNumber, remitterCid: this.cidNumber});
            }
            if(this.policyType == "credit"){
              this.navCtrl.push(CreditaccountnumberPage, {param: this.policyNumber, payType: this.policyType, remitterCid: this.cidNumber});
            }
            /*if(this.policyType == "general"){
              this.navCtrl.push(GeneraldetailsPage, {param: polNo});
            }*/
            if(this.policyType== "deferred"){
              this.navCtrl.push(DeferreddetailsPage, {param: this.policyNumber, remitterCid: this.cidNumber});
            }
            
          }
          
        }
      ]
    }); 
    alert.present();
  }

  updatePayment(transactionId, bfs_remitterBankId, bankAccNo, debitAuthCode){
    console.log('update payment');
    
    this.http.get(this.baseUrl+'/updatePaymentFinal?txnId='+transactionId+'&remitterBank='+bfs_remitterBankId+'&accNo='+bankAccNo+'&authCode='+debitAuthCode+'&orderNo='+this.orderNo).map(res => res.json()).subscribe(
      data => {
        // this.status = data;
        // if(this.status == "1"){
        //   console.log('payment inserted');
        // }
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
    }, 5000);
  }

}
