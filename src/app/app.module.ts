import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { CalculatorPage } from '../pages/calculator/calculator';
import { BusinessPage } from '../pages/business/business';
import { ContactusPage } from '../pages/contactus/contactus';
import { FeedbackPage } from '../pages/feedback/feedback';
import { RegistrationPage } from '../pages/registration/registration';
import { RegistrationformPage } from '../pages/registrationform/registrationform';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { PolicynumberPage } from '../pages/policynumber/policynumber';
import { LifedetailsPage } from '../pages/lifedetails/lifedetails';
import { ConfirmpaymentPage } from '../pages/confirmpayment/confirmpayment';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CreditaccountnumberPage } from '../pages/creditaccountnumber/creditaccountnumber';
import { GeneraldetailsPage } from '../pages/generaldetails/generaldetails';
import { DeferreddetailsPage } from '../pages/deferreddetails/deferreddetails';
import { ImmediatedetailsPage } from '../pages/immediatedetails/immediatedetails';
import { OthersPage } from '../pages/others/others';
import { EmailComposer } from '@ionic-native/email-composer';
import { CallNumber } from '@ionic-native/call-number';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { UserprofilePage } from '../pages/userprofile/userprofile';
import { Network } from '@ionic-native/network';
import { PaymentPage } from '../pages/payment/payment';
import { DatePipe } from '@angular/common';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { IonicStorageModule } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    AboutusPage,
    CalculatorPage,
    BusinessPage,
    ContactusPage,
    FeedbackPage,
    RegistrationPage,
    RegistrationformPage,
    DashboardPage,
    PolicynumberPage,
    LifedetailsPage,
    ConfirmpaymentPage,
    CreditaccountnumberPage,
    GeneraldetailsPage,
    DeferreddetailsPage,
    ImmediatedetailsPage,
    OthersPage,
    ForgotpasswordPage,
    UserprofilePage,
    PaymentPage,
    PdfViewerComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    AboutusPage,
    CalculatorPage,
    BusinessPage,
    ContactusPage,
    FeedbackPage,
    RegistrationPage,
    RegistrationformPage,
    DashboardPage,
    PolicynumberPage,
    LifedetailsPage,
    ConfirmpaymentPage,
    CreditaccountnumberPage,
    GeneraldetailsPage,
    DeferreddetailsPage,
    ImmediatedetailsPage,
    OthersPage,
    ForgotpasswordPage,
    UserprofilePage,
    PaymentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EmailComposer,
    CallNumber,
    SqliteProvider,
    Network,
    DatePipe,
    File,
    DocumentViewer,
    FileTransfer,
    FilePath,
    AndroidPermissions
    
  ]
})
export class AppModule {}
