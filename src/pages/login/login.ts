import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  success: Boolean = true;
  username: any = '';
  password: any = '';
  temp: any = [];
  msg: any = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private storage: Storage,
    public events:Events) {
  }

  ionViewDidLoad() {
  }

  async submit() {
    if(this.username == '') 
      return false;
    this.success = true;
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    let postdata = new FormData();
    postdata.append('email', this.username);
    postdata.append('password', this.password);
    this.http.post( 'http://sapa-tech.com/warkop/api/login', postdata).subscribe(async data => {
      this.temp = await data;
      loader.dismiss();
      if(this.temp.success != false) {
        this.storage.set('id', this.temp.data["id_users"]);
        this.storage.set('full_name', this.temp.data["full_name"]);
        this.storage.set('email', this.temp.data["email"]);
        this.storage.set('password', this.temp.data["password"]);
        this.storage.set('images', this.temp.data["images"]);
        this.storage.set('level', this.temp.data["id_user_level"]);
        this.storage.set('token', this.temp.data["id_token"]);
        this.events.publish('user:loggedin');
        this.navCtrl.setRoot(HomePage);
      } else {
        this.success = this.temp.success;
        this.msg    = this.temp.message;
      }
    }, error => {
      loader.dismiss();
      this.success = false;
      this.msg    = "Error! Tidak dapat menghubungkan ke server!";
    });
  }

}
