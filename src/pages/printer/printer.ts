import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Storage } from '@ionic/storage';

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
    private alertCtrl: AlertController,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    this.listBluetooth();
  }
  
  checkBluetooth(){
    this.bluetoothSerial.isEnabled().then(success=>{
      this.listBluetooth();
    },error=>{
      this.showAlert('Error','Silahkan Nyalakan Bluetooth Terlebih dahulu');
    });
  }

  listBluetooth(){
    this.bluetoothSerial.list().then(
      data =>{
        console.log(data);
        this.items = data;
      },error=>{
        console.log(error);
        this.showAlert('Error','Tidak mendapatkan list bluetooth');
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

  async connect(address){
    this.bluetoothSerial.connect(address).subscribe(async success=>{
      this.showAlert('Berhasil','Bluetooth Connect dengan ID ' + address);
      await this.storage.set('printer_id', address);
    },error=>{
      this.showAlert('Error','Tidak dapat menghubungkan.');
    });
  }

}
