import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { NgZone } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AppRoutingModule, routingComponents } from '../../app.routing';
import { WindowService } from '../../services/window.service';
import { DomSanitizer, SafeResourceUrl, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';
import { LocalStorageService } from '../../services/local-storage.service';
import { DataObservableService } from '../../services/data-observable.service';
import { Location } from '@angular/common';
import { HostListener } from '@angular/core';

import { ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PagerService } from '../../services/pager-service';
import { UniquePipe } from '../../shared/pipes/array/unique.pipe';

import { CartService } from '../../services/cart-service';
import { SafeHtmlPipe } from '../../shared/pipes/string/safe-html.pipe';
// import { Config } from '../../services/config.static';
import { ConfigService } from '../../services/config.service';

import * as _ from 'underscore';

declare var jQuery: any;
declare var $: any;
declare var carousel: any;
// declare var myCart: any;

@Component({
  moduleId: module.id,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  providers: [WindowService, DataObservableService,
              CartService, PagerService, UniquePipe, SafeHtmlPipe]
})
export class CartComponent implements OnInit {

  imgSrc = '';
  config: any;
  @ViewChild('scrolling') scrolling: ElementRef;

  public cart = [];
  public items = [];
  public myCart: any;

  constructor(private configService: ConfigService,
              private location: Location,
              private zone: NgZone,
              private dataObservableService: DataObservableService,
              private route: ActivatedRoute,
              private cartrouter: Router,
              private windowService: WindowService,
              private LocalStorage: LocalStorageService,
              private domSanitizer: DomSanitizer,
              private http: Http,
              private el: ElementRef,
              private pagerService: PagerService,
              public cartService: CartService) {

    // el.nativeElement.scrolling = true;

    // $(window).on('orientationchange', function(event) {
    //   this.updateVideoLayout();
    // });

    // // subscribe to the window resize event
    // windowService.size$.subscribe((value:any) => {

    // });

  }

  // onMouseOver(): void {
  //   this.imgSrc = this.config.APP_IMAGES + '/order_now_over.png';
  // }

  // onMouseOut(): void {
  //   this.imgSrc = this.config.APP_IMAGES + '/order_now.png';
  // }

  // onMouseDown(): void {
  //   this.imgSrc = this.config.APP_IMAGES + '/order_now_dn.png';
  // }

  ngOnInit() {

    this.config = this.configService.config();
    // this.prods = this.configService.getProducts();

    this.imgSrc = this.config.APP_IMAGES + '/order_now.png';

    window.scrollTo(0, 0);

  }

  callRoute(z) {
    event.preventDefault();
    // $('[data-role=panel]').panel('close');
    // $('.carousel_trim').css('display', 'none');
    // $('#storeslider_wrapper').css('display', 'none');
    // this.LocalStorage.set('config_cart', {
    //   'CAROUSEL_SHOW': false
    // });

    this.cartrouter.navigate(['/blank']);
    setTimeout( () => {
        // this.cartrouter.navigate(['/browser', {name: browserRef, url: pathRef}]);
        this.cartrouter.navigate([z]);
    }, 1);
  }

  // ngAfterViewInit() {

  // }



}
