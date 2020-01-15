import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { ReportPage } from '../pages/report/report';
import { PrinterPage } from '../pages/printer/printer';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;
  token: any;
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private storage: Storage,
    private events: Events) {
    // used for an example of ngFor and navigation
    this.initializeApp();

    events.subscribe('user:loggedin',()=>{
      this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Invoice', component: ReportPage },
        { title: 'Setting Printer', component: PrinterPage }
      ];
      this.token = 'logged';
    });

      events.subscribe('user:loggedout',()=>{
      this.pages = [
          {title:'Login', component: LoginPage},
        ];
        this.token = null;
    });
  }

  ionViewDidLoad() {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      this.splashScreen.hide();    
      this.storage.get('token').then((val) => {
        this.token = val;
        if(val) {
          this.pages = [
            { title: 'Home', component: HomePage },
            { title: 'Invoice', component: ReportPage },
            { title: 'Setting Printer', component: PrinterPage }
          ];
          this.rootPage = HomePage;
        } else {
          this.pages = [
            {title:'Login', component: LoginPage},
          ];
          this.rootPage = LoginPage;
        }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logOut() {
    this.pages = [
      { title: 'Login', component: LoginPage },
    ];
    this.token = null;
    this.events.publish('user:loggedout');
    this.nav.setRoot(LoginPage);
    this.storage.clear();
  }
}
