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
  constructor(public navCtrl: NavController, public oS: OikosService) { }
  ngOnInit(){ }    

  uploadDb(e){
    this.oS.fileToJson(e, data => this.newlesson = data)
  }
}


