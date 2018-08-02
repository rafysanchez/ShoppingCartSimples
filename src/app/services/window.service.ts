import { HttpModule } from '@angular/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

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

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/distinct';

@Injectable()
export class WindowService {
    // create more Observables as and when needed for various properties
    size$: Observable<Array<any>>;
    orientation$: Observable<any>;

    constructor() {
        // Track widow size changes
        const windowSize$ = new BehaviorSubject(getWindowSize());
        this.size$ = (windowSize$.pluck('size') as Observable<Array<any>>).distinctUntilChanged();
        new Observable<Array<any>>().distinctUntilChanged();
        Observable.fromEvent(window, 'resize')
            .map(getWindowSize)
            .subscribe(windowSize$);
    }
}

function getWindowSize() {
    return {
        size: { width: window.innerWidth,  height: window.innerHeight }
    };
}


