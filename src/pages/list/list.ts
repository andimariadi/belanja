import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { OrderingPage } from '../ordering/ordering';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  total: any = [];
  total_price: any = 0;
  by_user:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController) {
  }

  

  async ionViewDidLoad() {
    this.by_user = await this.storage.get('id');
    this.getData();
  }

  async getData() {
    this.total = [];
    this.total_price = 0;
    let postdata = new FormData();
    postdata.append('create_id', await this.by_user);
    this.http.post( 'http://sapa-tech.com/warkop/api/keranjang_belanja', postdata).subscribe(async data => {
      this.selectedItem = data['data'];
      for (let index = 0; index < data['data'].length; index++) {
        this.total.push(data['data'][index].harga*data['data'][index].jumlah);
      }
      this.total_price = this.array_sum(this.total);
          
    });
  }

  async delete(position, id) {
    this.http.get( 'http://sapa-tech.com/warkop/api/transaksi_delete/'+ id).subscribe(async data => {
      await this.selectedItem.splice(position, 1);
      const toast = this.toastCtrl.create({
        message: data["data"],
        duration: 3000
      });
      toast.present();
      this.getData();
    }, err => {
      this.getData();
    });
  }

  array_sum (array) {
		var key
		var sum = 0
			if (typeof array !== 'object') {
				return null
			}
			for (key in array) {
				if (!isNaN(parseFloat(array[key]))) {
					sum += parseFloat(array[key])
				}
			}
		return sum
  }
  
  async submit() {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    let postdata = new FormData();
    for (let index = 0; index < this.selectedItem.length; index++) {
      let jum: any = this.selectedItem[index].jumlah*this.selectedItem[index].harga;
      postdata.append('id_produk['+index+']', await this.selectedItem[index].id_produk);
      postdata.append('id_transaksi['+index+']', await this.selectedItem[index].idtransaksi);
      postdata.append('jumlah['+index+']', await this.selectedItem[index].jumlah);
      postdata.append('harga['+index+']', await this.selectedItem[index].harga);
      postdata.append('total['+index+']', jum);
    }
    postdata.append('grand', await this.total_price);
    postdata.append('create_id', await this.by_user);
    postdata.append('update_id', await this.by_user);
    this.http.post( 'http://sapa-tech.com/warkop/api/save_det_produk', postdata).subscribe(async data => {
      this.getData();
      this.total_price = 0;
      const toast = this.toastCtrl.create({
        message: 'Berhasil dikonfirmasi, silahkan bayar!',
        duration: 3000
      });
      toast.present();
      loader.dismiss();
      this.navCtrl.push(OrderingPage, {id: data['send'], status: 1}).then(() => {
        this.navCtrl.getActive().onDidDismiss(data => {
          this.ionViewDidLoad();
        });
      });
    }, err => {
      loader.dismiss();
    });
    // this.navCtrl.push(OrderingPage, {price: this.total_price});
  }
}
