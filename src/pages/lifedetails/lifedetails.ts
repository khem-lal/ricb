import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
export class LifedetailsPage {

  private baseUrl: String;
  polNo: any;
  policyDtls: any;
  amountToPay: any = 0;
  premiumAmount: any;
  paymentUrl: any;
  paymentMode: String;
  monthlyFlag: boolean = false;
  quarterlyFlag: boolean = false;

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

    this.http.get(this.baseUrl+'/generalinsurancedetails?policyNo='+this.polNo).map(res => res.json()).subscribe(
      data => {
        this.policyDtls = data;
        this.premiumAmount = data[0].PREMIUM;
        this.paymentMode = data[0].P_MODE;

        this.cidNo = data[0].CUST_CID;
        this.custName = data[0].POLICY_HOLDER;
        this.deptCode = "Life";
        this.policyNo = data[0].POLICY_NO;

        if(this.paymentMode == 'MONTHLY'){
          this.monthlyFlag = true;
          this.quarterlyFlag = false;
        }
        if(this.paymentMode == 'QUARTERLY'){
          this.monthlyFlag = false;
          this.quarterlyFlag = true;
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
            this.amountToPay="1";
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

    this.http.get(this.baseUrl+'/insertLifePayment?cidNo='+this.cidNo+'&custName='+this.custName+'&deptCode='+this.deptCode+'&policyNo='+this.policyNo+'&amount='+this.premiumAmount).map(res => res.json()).subscribe(
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
