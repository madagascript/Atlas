import { Injectable }     from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class OikosService {
	constructor (private http: Http) {}	
	httpGetAsync(url, callback){
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback( JSON.parse(xmlHttp.responseText) );
        }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
    }

  fileToJson(e: any, cb: any){         
    var reader = new FileReader();        
    reader.onload = () => cb(JSON.parse(reader.result));
    reader.readAsText(e.srcElement.files[0]);
    }
}

