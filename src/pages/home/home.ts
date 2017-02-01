import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OikosService } from '../../app/oikos.service';
import { ModalController } from 'ionic-angular';
import { LeccionModal } from './leccion-modal';

// habilitar para bases de datos en Ionic.io
// import {Database} from '@ionic/cloud-angular';

const devlocal = true;
const dataserver = 
  devlocal ? 
  'http://192.168.1.128:5984/ifcd0112/' : 
  'https://couchdb-52d18a.smileupps.com/ifcd0112/';
const ejercicios = dataserver + '_design/app/_view/ejercicios'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [OikosService]
})
export class HomePage implements OnInit {	
	lecciones: any;	
	ventanaModal: any;
  output: any;  

  constructor(public navCtrl: NavController, public oS: OikosService, public modalCtrl: ModalController) {  	
		
    // habilitar para bases de datos en Ionic.io
    /* 
    this.db.connect();
    this.db.collection('lecciones').watch().subscribe( 
      (data) => { this.lecciones = data }, 
      (error) => { this.lecciones = error });  	
    */
  }
  ngOnInit(){ 
    this.getLecciones()
    // habilitar para bases de datos en Ionic.io
    /*
    const dblecciones = this.db.collection('lecciones');
    dblecciones.order("titulo").watch().subscribe(
      data => this.lecciones = data,   
      error => this.lecciones = error   
      );
    */
  } 
  
  getLecciones(){    
    this.oS.httpGetAsync(ejercicios, data  =>  this.lecciones = data.rows  ) 
  }
  presentModal(leccion) {
   this.ventanaModal = this.modalCtrl.create(LeccionModal,leccion);
   this.ventanaModal.present();
 } 
 
}


