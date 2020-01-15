import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ListPage } from '../list/list';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  by_user: any;
  category: any = 'all';
  categorys: any = [];
  items: any = [];
  count: any = [];
  bucket: any = [];
  count_bucket: any = 0;
  default: any = 0;

  token: any;
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private toastCtrl: ToastController,
    private http: HttpClient
  ) {
  }

  async ionViewDidLoad() {
    this.by_user = await this.storage.get('id');
    this.getBucket();
    this.getCategory();
    this.getData();
  }

  async getBucket() {
    let postdata = new FormData();
    postdata.append('create_id', await this.by_user);
    this.http.post( 'http://sapa-tech.com/warkop/api/keranjang_belanja', postdata).subscribe(async data => {
      this.count_bucket = data['data'].length;
    });
  }

  getCategory() {   

    this.http.get( 'http://sapa-tech.com/warkop/api/data_kategori').subscribe(async data => {
      this.categorys = await data;
    }, error => {
      console.log("Error!");
    });
  }

  async getData() {
    this.count = [];
    this.http.get( 'http://sapa-tech.com/warkop/api/produks').subscribe(async data => {
      this.items = await data;
    }, error => {
      console.log("Error!");
    });

  }

  async filter_category(val) {
    this.category = val;
    this.count = [];
    if(val) {
      this.http.get( 'http://sapa-tech.com/warkop/api/produks/' + val).subscribe(async data => {
        this.items = await data;
      }, error => {
        console.log("Error!");
      });
    }

  }

  async order(i) {
    if((this.count[i] <= this.items[i].stok_produk && this.items[i].status_stok == 1) || (this.items[i].status_stok == 0)) {
      let postdata = new FormData();
      postdata.append('create_id', this.by_user);
      postdata.append('id_produk', this.items[i].idproduk);
      postdata.append('kd_produk', this.items[i].kd_produk);
      postdata.append('nm_produk', this.items[i].nm_produk);
      postdata.append('jumlah', this.count[i]);
      postdata.append('harga_produk', this.items[i].harga_produk);
      postdata.append('disc', "");
      this.http.post( 'http://sapa-tech.com/warkop/api/save_produk', postdata).subscribe(async data => {
        const toast = this.toastCtrl.create({
          message: 'Berhasil ditambahkan!',
          duration: 3000
        });
        toast.present();
        this.getBucket();
      });
    } else {        
      const toast = this.toastCtrl.create({
        message: 'Jumlah tidak valid!',
        duration: 3000
      });
      toast.present();
    }
  }

  presentOrder() {
    this.navCtrl.push(ListPage).then(() => {
      this.navCtrl.getActive().onDidDismiss(data => {
        this.ionViewDidLoad();
      });
    });
  }

  async incrementQty(i) {
    if(!this.count[i])
      this.count[i] = 0;
    var stock = this.count[i];
    if(this.items[i].stok_produk != 0) {
      if(stock < this.items[i].stok_produk)
        this.count[i]++;
    } else {
      this.count[i]++;
    }
  }

  async decrementQty(i) {
    if(!this.count[i])
      this.count[i] = 0;
    if(this.count[i] <= 1) {
      this.count[i] = 1;
    } else {
      this.count[i]--;
    }
  }

}
