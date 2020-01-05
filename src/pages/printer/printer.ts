import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

/**
 * Generated class for the PrinterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-printer',
  templateUrl: 'printer.html',
})
export class PrinterPage {

  items:any = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private bluetoothSerial: BluetoothSerial,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PrinterPage');
    this.listBluetooth();
  }

  listBluetooth(){
    this.bluetoothSerial.list().then(
      data =>{
       this.items = data;
      },error=>{
       this.showAlert('Error','Silahkan Nyalakan Bluetooth Terlebih dahulu');
      }
    );
  }

  showAlert(title, msg) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  connect(address){
    this.bluetoothSerial.connect(address).subscribe(success=>{
      this.showAlert('Berhasil','Bluetooth Connect dengan ID ' + address);
    },error=>{ 
      this.showAlert('Error','Bluetooth tidak terhubung');
    });
  }

}
