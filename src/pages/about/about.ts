import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Database} from '@ionic/cloud-angular';
import { OikosService } from '../../app/oikos.service';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [ OikosService ],
})
export class AboutPage implements OnInit {
	lessons: any;    
  newlesson: any;
  constructor(public navCtrl: NavController, public db: Database, public oS: OikosService) {
    this.db.connect();
    this.db.collection('lessons').watch().subscribe( 
      (data) => { this.lessons = data }, 
      (error) => { console.error(error) });
  }
  ngOnInit(){  }    
  uploadDb(e){
    this.oS.fileToJson(e, data => this.newlesson = data)
  }
}


