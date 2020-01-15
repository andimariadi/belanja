import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { IonicStorageModule } from "@ionic/storage";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { OrderingPage } from '../pages/ordering/ordering';
import { ListPage } from '../pages/list/list';
import { PrintPage } from '../pages/print/print';
import { HttpClientModule } from '@angular/common/http';
import { ReportPage } from '../pages/report/report';

import { Printer } from '@ionic-native/printer';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { PrinterPage } from '../pages/printer/printer';
import { PayPage } from '../pages/pay/pay';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: '__belanja_andimariadi',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    OrderingPage,
    PrintPage,
    ReportPage,
    PrinterPage,
    PayPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Printer,
    BluetoothSerial,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
