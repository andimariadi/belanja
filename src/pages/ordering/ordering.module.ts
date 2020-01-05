import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderingPage } from './ordering';

@NgModule({
  declarations: [
    OrderingPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderingPage),
  ],
})
export class OrderingPageModule {}
