import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OikosService } from '../../app/oikos.service';


const devlocal = true;
const dataserver = 
  devlocal ? 
  'http://192.168.1.128:5984/ifcd0112/' : 
  'https://couchdb-52d18a.smileupps.com/ifcd0112/';
const ejercicios = dataserver + '_design/app/_view/blog-date'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [ OikosService ],
})
export class AboutPage implements OnInit {
	lessons: any;    
  newlesson: any;
  msg: any;
  post: any = {
    fecha: '2017-02-03',
    titulo: 'prueba grabando post',
    texto: 'en un lugar de la mancha',
    bibliografia: []
  }

  constructor(public navCtrl: NavController, public oS: OikosService) { }
  ngOnInit(){ }    

  publicar(){
    this.oS.post(dataserver, this.post).subscribe(
      (data) => console.log(data),
      (err) => console.log(err),
      );
    
  }

  uploadDb(e){
    this.oS.fileToJson(e, data => this.newlesson = data)
  }
}


