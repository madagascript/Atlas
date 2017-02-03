import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OikosService } from '../../app/oikos.service';


const localServer = 'http://192.168.1.128:5984/ifcd0112/'
const remoteServer = 'https://couchdb-52d18a.smileupps.com/ifcd0112/'
const devlocal = false;
const dataserver = devlocal ? localServer : remoteServer
const viewPostsFecha = '_design/app/_view/posts-fecha?include_docs=true&descending=true'

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [ OikosService ],
})
export class AboutPage implements OnInit {	
  msg: any;
  post: any = { };
  posts: any = [];

  constructor(public navCtrl: NavController, public oS: OikosService) { }
  ngOnInit(){ this.getPosts()}    

  getPosts(){
    let url = dataserver + viewPostsFecha
    this.oS.get(url).subscribe( data => this.posts = data )
  }

  getPost(id){
    let url = dataserver + id
    this.oS.get(url).subscribe( data => this.post = data )
  }
  publicar(obj){
    obj.class = 'post'
    this.oS.post(dataserver, obj).subscribe(
      (data) => { 
        console.log(data)       
        this.msg = data 
        this.getPosts()
      });
    
  }
  
}


