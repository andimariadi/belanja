import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { OrderingPage } from '../ordering/ordering';

/**
 * Generated class for the ReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  by_user: any;
  total: any = 0;
  total_price: any = 0;
  items: any = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private http: HttpClient) {
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
    this.http.post( 'http://sapa-tech.com/warkop/api/penjualan/', postdata).subscribe(async data => {
      this.items = data;          
    });
  }

  async itemSelected(id, status) {
    this.navCtrl.push(OrderingPage, {id: id, status: status}).then(() => {
      this.navCtrl.getActive().onDidDismiss(data => {
        this.ionViewDidLoad();
      });
    });
  }

}
