import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AboutusPage } from '../pages/aboutus/aboutus';
import { CalculatorPage } from '../pages/calculator/calculator';
import { BusinessPage } from '../pages/business/business';
import { ContactusPage } from '../pages/contactus/contactus';
import { FeedbackPage } from '../pages/feedback/feedback';
import { SqliteProvider } from '../providers/sqlite/sqlite';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public sqlite: SqliteProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'About us', component: AboutusPage},
      { title: 'Calculator', component: CalculatorPage},
      { title: 'Business', component: BusinessPage},
      { title: 'Contact us', component: ContactusPage},
      { title: 'Feedback', component: FeedbackPage}
      
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //this.sqlite.openDb();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
