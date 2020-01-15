import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { PrintPage } from '../print/print';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Printer } from '@ionic-native/printer';
import { PrinterPage } from '../printer/printer';
import { PayPage } from '../pay/pay';

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
    private printer: Printer,
    private modalCtrl: ModalController) {
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
  }

  async submit() {
    let payPage = this.modalCtrl.create(PayPage, {id: this.id});
    payPage.onDidDismiss(data => {
      this.status_bayar = data.status;
    });
    payPage.present();
  }

  async print() {    
    let printer = await this.storage.get('printer_id');
    if(printer) {      
      this.navCtrl.push(PrintPage, {id: this.id});
    } else {
      this.navCtrl.push(PrinterPage);
    }
  }

}
