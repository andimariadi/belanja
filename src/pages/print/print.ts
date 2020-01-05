import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the PrintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-print',
  templateUrl: 'print.html',
})
export class PrintPage {

  selectedItem: any = [];
  price: any = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage) {
    this.price = this.navParams.get('price');
  }



  ionViewDidLoad() {
    this.storage.get('order').then((val) => {
      this.selectedItem = val;
    });
  }

}
