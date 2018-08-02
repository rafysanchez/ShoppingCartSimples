import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Photo } from './photo';

@Injectable()
export class PhotosService {
    // url = "api/books";
    url = 'http://localhost:16395/CartImagesHandler.ashx?dir='; // + this.imgDir;
    constructor(private http: Http) { }
    getPhotosWithObservable(): Observable<Photo[]> {
        return this.http.get(this.url)
        .map(this.extractData)
        .catch(this.handleErrorObservable);
    }
    addPhotoWithObservable(photo: Photo): Observable<Photo> {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ headers: headers });
      return this.http.post(this.url, photo, options)
                  .map(this.extractData)
                  .catch(this.handleErrorObservable);
    }
    getPhotosWithPromise(): Promise<Photo[]> {
      return this.http.get(this.url).toPromise()
                  .then(this.extractData)
                  .catch(this.handleErrorPromise);
    }
    addPhotoWithPromise(photo: Photo): Promise<Photo> {
      const headers = new Headers({ 'Content-Type': 'application/json' });
      const options = new RequestOptions({ headers: headers });
      return this.http.post(this.url, photo, options).toPromise()
                 .then(this.extractData)
                 .catch(this.handleErrorPromise);
    }
    private extractData(res: Response) {
      const body = res.json();
      return body.data || {};
    }
    private handleErrorObservable (error: Response | any) {
      console.error(error.message || error);
      return Observable.throw(error.message || error);
    }
    private handleErrorPromise (error: Response | any) {
      console.error(error.message || error);
      return Promise.reject(error.message || error);
    }
}

