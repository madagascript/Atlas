import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
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

  get(url: string): Observable<any[]>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: false });
    return this.http.get(url, options)
                    .map( (res: Response) => { return res.json() })
                    .catch( (error: Response) => {return error.json() })      
  }

  

  post(url: string, obj: any): Observable<any[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: false });
    return this.http.post(url, obj , options)
                    .map( (res: Response) => { return res.json() })
                    .catch( (error: Response) => {return error.json() })
    }    

   
}

