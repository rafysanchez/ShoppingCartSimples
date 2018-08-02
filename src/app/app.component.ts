import { Component, ElementRef, Inject, OnInit } from '@angular/core';
// import { AppRoutingModule, routingComponents } from './app.routing';
// import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';

import { AppRoutingModule, routingComponents } from './app.routing';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';

import 'rxjs/add/operator/pairwise';
import { LocalStorageService } from './services/local-storage.service';
// import { Config } from './services/config.static';
import { PagerService } from './services/pager-service';
import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser'
import { NgZone, Renderer } from '@angular/core';
import { WindowService } from './services/window.service';
import { DomSanitizer, SafeResourceUrl, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';
import { DataObservableService } from './services/data-observable.service';
import { ConfigService } from './services/config.service';
import { ViewChild } from '@angular/core';

declare var _stylepath: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WindowService, DataObservableService, PagerService]
})

export class AppComponent implements OnInit {
  routerEventSubscription: any;
  public params = '';

  public sub: any; // -> Subscriber

  private foo: string;
  private fruit: string;

  private queryParamaterValue: string;
  private matrixParamterValue: string;

  private querySub: any;
  private matrixSub: any;

  @ViewChild('navbar') dropdowns: ElementRef;

  public config: any;
  public products: any;

  elementRef: ElementRef;
  slideValue: number;
  curPage = 'swipeclouds';
  title = 'Eureka!';

  _bgImage = './assets/ac_img/bg6.jpg';

  clicked(event, pageRef: string) {
    event.preventDefault();
  }

  constructor(private configService: ConfigService,
              private zone: NgZone,
              private appObservableService: DataObservableService,

              private route: ActivatedRoute,
              private router: Router,
              // @Inject(ElementRef) elementRef: ElementRef,
              elementRef: ElementRef,
              private windowService: WindowService,
              private pagerService: PagerService,
              private appWindowService: WindowService,
              private LocalStorage: LocalStorageService) {


    // subscribe to the window resize event
    windowService.size$.subscribe((value: any) => {
      // alert('APP - windowService:\r\n' + 'width: ' + window.innerWidth + 'height: ' + window.innerHeight);
      // this.updateAppLayout();
    });

    $(window).on('orientationchange', function(event) {
      // alert('APP - orientationchange:\r\n' + 'width: ' + window.innerWidth + 'height: ' + window.innerHeight);
      // this.updateAppLayout();
    });

    // The angular 2 router events has different classes,
    // and what gets passed to the subscription from the
    // router.events observable can either be NavigationEnd,
    // NavigationCancel, NavigationError, or NavigationStart.
    // The one that will actually trigger a routing update will
    // be NavigationEnd. I would stay away from using instanceof
    // or event.constructor.name because after minification class
    // names will get mangled it will not work correctly.
    // You can use the router's isActive function instead, here:
    // https://angular.io/docs/ts/latest/api/router/index/Router-class.html
    this.routerEventSubscription = this.router.events.subscribe((event: any) => {

      if (this.router.isActive('/admin', false)) {
        $('body').css('background-image', '');
        $('body').css('background', '#ffffff url(\'./assets/ac_img/bg0.jpg\') no-repeat center center fixed');
      } else {
        this._bgImage = './assets/ac_img/bg6.jpg';
        if (localStorage['bg_cart']) {
            this._bgImage = localStorage['bg_cart'];
        } else {
            this._bgImage = './assets/ac_img/bg6.jpg';
            localStorage['bg_cart'] = this._bgImage;
        }
        $('body').css('background', '#ffffff url(' + this._bgImage + ') no-repeat center center fixed');
      }
      // if (this.router.isActive(event.url, false)) {
      //   // true if the url route is active
      //   // const [first, second] = event.url.split('=');
      //   // if(second !== 'undefined') {
      //   //   for (let x = 0; x < this.config.DISTRIBUTORS.length; x++) {
      //   //     if (second === this.config.DISTRIBUTORS[x].did) {
      //   //       localStorage['did'] = second;
      //   //     }
      //   //   }
      //   // }
      // }
    });

  }

  // ngOnInit is called directly after constructor and before ngOnChange
  // is triggered for the first time. Perfect place for initialisation.
  ngOnInit() {

    // this.route.params.subscribe(params => { this.foo = params.companyId });
    // alert('foo :'+this.foo);

    // this.route.snapshot.params["matrixParameterName"];
    // this.route.params.subscribe(matrixParams =>
    //   this.matrixParamterValue = matrixParams["matrixParameterName"]);

    this.config = this.configService.config();
    // alert(this.config.DISTRIBUTOR_ID);

    // alert('Configurations: '+ JSON.stringify(this.config));

    this.products = this.configService.getProducts();
    // alert('Configurations: '+ JSON.stringify(this.products));

    // let prod: any = this.configService.productsKey('DronesTVApp');
    // alert(prod.sku);

  }

  // myMethodToGetHost() {
  //     // will print 'localhost'
  //     let host:string = this.configService.getConfig('host');
  // }

  // myMethodToGetCurrentEnv() {
  //     // will print 'development'
  //     let env: string = this.config.getEnv('env');
  // }



  // updateAppLayout() {
  //   // if (window.innerHeight > window.innerWidth) {
  //   //     $('header').removeClass('ui-header-landscape').addClass('ui-header-portrait');
  //   //     $('footer').removeClass('hideit').addClass('showit');
  //   // }
  //   // if (window.innerHeight < window.innerWidth) {
  //   //     // We will REMOVE the header & Footer if the page is in laandscape position
  //   //     $('header').removeClass('ui-header-portrait').addClass('ui-header-landscape');
  //   //     $('footer').removeClass('showit').addClass('hideit');
  //   // }
  // }

  nextBackground(event) {
    event.preventDefault();

  }

  // (click)="changeTheme($event, 'ios7light')"
  changeTheme(event, themeRef: string) {
    event.preventDefault();

  }

  changeDrag(event, dragRef: string) {
    event.preventDefault();
    $('[data-role=panel]').panel('close');
    // 'app_name': 'swipeclouds',
    // 'themeid': 'ios7light',
    // 'bgimage': 0,
    // 'cloudid': 0,   // this._cloudid
    // 'shape': 'sphere',  // this._shape
    // 'zoom': 1.0,   // this._zoom zoomMin: 0.3, zoomMax: 3, zoomStep: 0.05
    // 'maxSpeed': .04,  // this._maxSpeed minSpeed	0.0 maxSpeed	0.05
    // 'drag': 'on'  // this._drag
    // let s = this.LocalStorage.get('settings_swipeclouds');
    // if (s) {
    //     s.drag = dragRef;
    //     this.LocalStorage.set('settings_swipeclouds', s);
    // }
    // this.approuter.navigate(['/blank']);
    // setTimeout( () => {
    //     this.approuter.navigate(['/swipeclouds', {action: 'drag', actionid: dragRef }]);
    // }, 1);

  }

  loadBrowser(event, browserRef: string) {
    event.preventDefault();
    // $('[data-role=panel]').panel('close');
    // // this.approuter.navigate(['/blank']);
    // // setTimeout( () => {
    //     this.approuter.navigate(['/browser', {name: 'legal', url: './assets/data/lic.html'}]);
    // // }, 1);
  }

  closePanel(event, closeRef: string) {
    event.preventDefault();
    $('[data-role=panel]').panel('close');
  }

  changeShape(event, shapeRef: string) {
    event.preventDefault();

    $('[data-role=panel]').panel('close');

  }

  zoomChange(event, valueRef: any) {
    event.preventDefault();
    // $("[data-role=panel]").panel("close");

    alert(valueRef);
  }

  onSpeedChange(event, valueRef: number) {
    event.preventDefault();
    // $("[data-role=panel]").panel("close");

    alert(valueRef);
  }


}


