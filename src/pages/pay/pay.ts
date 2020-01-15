import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { OrderingPage } from '../ordering/ordering';

/**
 * Generated class for the PayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pay',
  templateUrl: 'pay.html',
})
export class PayPage {

  by_user: any;
  id: any = 0;
  description: any = {};
  amount: any = 0;
  return: any = 0;
  price: any = 0;
  status_bayar: any = 0;
  isDisabled: Boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private http: HttpClient,
    private storage: Storage,
    private toastCtrl: ToastController
  ) {
  }

  async ionViewDidLoad() {
    this.by_user = await this.storage.get('id');
    this.id = await this.navParams.get('id');
    this.getData(this.navParams.get('id'));
  }

  async getData(id) {
    let postdata = new FormData();
    postdata.append('create_id', await this.by_user);
    this.http.get( 'http://sapa-tech.com/warkop/api/penjualan/' + id).subscribe(async data => {
      this.description = data['data'].penjualan[0];
      this.price = data['data'].penjualan[0].grandtotal;
    });
  }

  async clear() {
    if(this.amount <= 0) {
      this.amount = '';
    }
  }

  async pay() {
    this.return = Number(this.amount)-Number(this.price);
    if(this.return >= 0 ) {
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss({id: this.id, status: 1});
  }

  async submit() {
    if(this.return < 0 ) {
      const toast = this.toastCtrl.create({
        message: 'Uang pembayaran kurang!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else if(this.amount <= 0) {
      
      const toast = this.toastCtrl.create({
        message: 'Tidak ada pembayaran!',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      
      let postdata = new FormData();
      postdata.append('create_id', await this.by_user);
      postdata.append('idpenjualan', await this.id);
      postdata.append('pay', await this.amount);
      postdata.append('return', await this.return);
      this.http.post( 'http://sapa-tech.com/warkop/api/bayar', postdata).subscribe(async data => {
        const toast = this.toastCtrl.create({
          message: 'Pembayaran berhasil!',
          duration: 3000,
        });
        toast.present();
        this.viewCtrl.dismiss({id: this.id, status: 2});
      }, err => {
        const toast = this.toastCtrl.create({
          message: 'Tidak dapat menghubungkan keserver!',
          duration: 3000,
        });
        toast.present();
      });
    }
  }

}
