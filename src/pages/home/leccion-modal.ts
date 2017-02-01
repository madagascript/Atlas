import { Component, OnInit } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'leccion',
  templateUrl: 'leccion.html'  
})
export class LeccionModal implements OnInit {	
	leccion: any = {};
	constructor(public navCtrl: NavController, public params: NavParams, public viewCtrl: ViewController){}
  ngOnInit(){ this.leccion = this.params.data}   
}