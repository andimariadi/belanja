import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { PrintPage } from '../print/print';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Printer } from '@ionic-native/printer';
import { PrinterPage } from '../printer/printer';

/**
 * Generated class for the OrderingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ordering',
  templateUrl: 'ordering.html',
})
export class OrderingPage {
  id: any = 0;
  price: any = 0;
  amount: any = 0;
  return: any = 0;
  by_user: any;
  items: any = [];
  description: any = {};
  status_bayar: any = 0;
  isDisabled: Boolean = false;

  //FOR PRINTER
  
  selectedPrinter:any=[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private toastCtrl: ToastController,
    private storage: Storage,
    private http: HttpClient,
    private printer: Printer) {
  }

  async ionViewDidLoad() {
    this.by_user = await this.storage.get('id');
    this.id = await this.navParams.get('id');
    this.status_bayar = await this.navParams.get('status');
    this.getData(this.navParams.get('id'));
  }

  async getData(id) {
    let postdata = new FormData();
    postdata.append('create_id', await this.by_user);
    this.http.get( 'http://sapa-tech.com/warkop/api/penjualan/' + id).subscribe(async data => {
      this.items = data["data"];
      this.description = data['data'].penjualan[0];
      this.price = data['data'].penjualan[0].grandtotal;
    });
  }

  async pay() {
    this.return = Number(this.amount)-Number(this.price);
    if(this.return >= 0 ) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
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
        this.status_bayar = 2;
      }, err => {
        const toast = this.toastCtrl.create({
          message: 'Tidak dapat menghubungkan keserver!',
          duration: 3000,
        });
        toast.present();
      });
    }
  }

  async print() {
    this.navCtrl.push(PrinterPage);
  }

}
