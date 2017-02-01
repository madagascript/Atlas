import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Database} from '@ionic/cloud-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
	public chats: Array<string>;
  mensaje: any;
  outb64: any;
  debug: false;
  constructor(public navCtrl: NavController, public db: Database) {
  	this.db.connect();
    this.db.collection('chats').watch().subscribe( (chats) => {
      this.chats = chats;
    	}, 
    	(error) => {
      	console.error(error);
    	});
  }

  sendMessage(message: string) {
    this.db.collection('chats').store({text: message, time: Date.now()});
  	}

  txtToB64(){ this.outb64 = btoa(this.mensaje) }

  b64ToTxt(){ this.mensaje = atob(this.outb64) }
}
