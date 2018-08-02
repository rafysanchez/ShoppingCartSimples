import { Injectable } from '@angular/core';
import { Http, Jsonp, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';


@Injectable()
export class GetPageService {

    private retryCount = 3;

    constructor(private _http: Http) {
    }

    getPage(url: any) {
      return this._http.get(url)
        .map((res) => {
            return res.url;
        })
        .catch((err) => {
        const errMsg = (err.error) ? err.errmsg : err;
            console.error(errMsg);
            return Observable.throw(errMsg);
        });
    }
}
