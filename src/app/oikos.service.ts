import { Injectable }     from '@angular/core';
import { Http, Response, Headers, Request, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
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

    httpPostAsync(url, obj, callback){
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                callback( JSON.parse(xmlHttp.responseText) );
            }        
        xmlHttp.open("POST", url, true); // true for asynchronous 
        xmlHttp.setRequestHeader("Content-type", "application/json");        
        xmlHttp.send();
    }


  fileToJson(e: any, cb: any){         
    var reader = new FileReader();        
    reader.onload = () => cb(JSON.parse(reader.result));
    reader.readAsText(e.srcElement.files[0]);
    }

  post(url: string, obj: any): Observable<any[]> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: false });
    return this.http.post(url, obj , options)
                    .map( (res: Response) => {return res.json()})
                    .catch(this.handleError)
    }    

  private handleError (error: Response | any) {    
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else { errMsg = error.message ? error.message : error.toString(); }
    return Observable.throw(errMsg);
    }      
}

