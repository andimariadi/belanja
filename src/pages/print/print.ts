import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

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
  
  by_user: any;
  id: any;
  items: any = [];

  date: any = new Date().toLocaleDateString();
  time: any = new Date().toLocaleTimeString();
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage,
    private http: HttpClient,
    private bluetoothSerial: BluetoothSerial,
    private alertCtrl: AlertController
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
    this.items = await this.http.get( 'http://sapa-tech.com/warkop/api/penjualan/' + id).toPromise()
    this.price = this.items['data'].penjualan[0].grandtotal;
    this.selectedItem = this.items['data'].penjualandetails;
    this.printData();
  }

  printData(){  
    var nama = 'Warung Pasta\n';
    var alamat = 'Jl. A. Yani no 054, Bogor, Indonesia, 15141\n';
    var telpon = '+621234567890\n';
    var i=1;
    let nama_b = [];
    for(let bubu of this.items['data'].penjualandetails){
      var nama_barang = [
        i+'  '+bubu.nm_produk.substring(0,27)+'\n'+'     '+bubu.jumlahs
        +'  '+this.Chrupiah(bubu.hargas) +'    '+0+'%'
        +'    '+this.Chrupiah(bubu.totals)+'\n'];
      nama_b.push(nama_barang);
      i++;
    }
    
    var aa = 'No  Nama Barang\n'; 
    var bb = "    Qty  Harga    Disc    Total\n";
    var garis = "================================";
    var strip = "--------------------------------";
    var ntr = "\n";
    this.bluetoothSerial.write(nama + alamat + telpon
    + this.id +'\n'+'        '+new Date().toLocaleString()+'\n'
    + garis +'\n'
    + aa + bb 
    + strip +'\n'
    +nama_b.toString().replace(/,/gi,"")
    +strip
    +'\n Total              '+'Rp. '+this.Chrupiah(this.price)
  //   +'\n Cash               '+$("#cas").val()
    +'\n' + strip
  //   +'\n Kembali            '+'Rp. '+this.kembali
  //   +'\n' +strip
    +'\n\n                     TERIMAKASIH \n\n').then(success=>{
    
    },error=>{
      this.showAlert('Error','Ada Kesalahan Pada Saat Print');
    });
  }

  showAlert(title, msg) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  Chrupiah(ev){
    var aa:any = ev;
    var separator = ".";
        
    var b = aa.replace(/[^\d]/gi,"");
    var c = "";
    var panjang = b.length;
    var j = 0;
    for (var i = panjang; i > 0; i--) {
      j = j + 1;
      if (((j % 3) == 1) && (j != 1)) {
        c = b.substr(i-1,1) + separator + c;
      } else {
        c = b.substr(i-1,1) + c;
      }
    }
    return ev = c;
  }

}
