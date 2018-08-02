import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { NgZone } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AppRoutingModule, routingComponents } from '../../app.routing';
import { WindowService } from '../../services/window.service';
import { DomSanitizer, SafeResourceUrl, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';
import { LocalStorageService } from '../../services/local-storage.service';
import { DataObservableService } from '../../services/data-observable.service';
import { Location } from '@angular/common';

import { ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PagerService } from '../../services/pager-service';
import { UniquePipe } from '../../shared/pipes/array/unique.pipe';
import { OrderByPipe } from '../../shared/pipes/array/order-by.pipe';
import { CartService } from '../../services/cart-service';
import { SafeHtmlPipe } from '../../shared/pipes/string/safe-html.pipe';
// import { Config } from '../../services/config.static';
import { ConfigService } from '../../services/config.service';

import * as _ from 'underscore';

declare var jQuery: any;
declare var $: any;
// declare var carousel: any;
// declare var myCart: any;

@Component({
  moduleId: module.id,
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [WindowService, DataObservableService, CartService,
              PagerService, UniquePipe, OrderByPipe, SafeHtmlPipe]
})
// ProductDetailComponentParam
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy {

  public config: any;
  // public product: any;
  public products: any;
  public prods: any;

  @ViewChild('scrolling') scrolling: ElementRef;

  public congig_loaded = false;
  public isActive = false;
  public selected = false;


  page: any;
  elementRef: ElementRef;

  private _video_width: number;
  private _video_height: number;

  // public setClickedRow: any = 0;
  // public doc: Array<any>;
  // public id: any;
  // public url: any;

  // public selectedIdx: any = 0;
  // public selectedLink: any = 'about:blank';
  public sub: any; // -> Subscriber

  public bLodCarousel = false;


  // array of all items to be paged
  private allItems2: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  public params = '';

  public showslider: Boolean = false;

  public cart = [];
  public items = [];
  public myCart: any;


  // inject Location into class constructor
  constructor(private configService: ConfigService,
              private location: Location,
              private zone: NgZone,
              private dataObservableService: DataObservableService,
              private route: ActivatedRoute,
              private router: Router,
              private windowService: WindowService,
              private LocalStorage: LocalStorageService,
              private sanitizer: DomSanitizer,
              private http: Http,
              private el: ElementRef,
              private pagerService: PagerService,
              public cartService: CartService) {

    router.events.subscribe(event => {
    });

    el.nativeElement.scrolling = true;

    $(window).on('orientationchange', function(event) {
      this.updateVideoLayout();
    });

    // subscribe to the window resize event
    windowService.size$.subscribe((value: any) => {

    });


    // Use routerLink on your a tag for passing it by url.
    // [routerLink]="['yourRouteHere', {'paramKey': paramValue}]
    // To get it you need to use ActivatedRoute service.
    // Inject it into your component and use it's subscribe method.
    // Here my route is the injected service
    // this.route.params.subscribe(params => {
    //   const id = Number.parseInt(params['paramKey']);
    // }
    // If you want to get parameters from the route segment
    // use .params, else if you want from query string, use .queryParams


    // get URL parameters via route
    this.sub = this.route
      .params
      .subscribe(params => {
        this.params = params['id'];
        this.getProducts();
    });

  }

  ngOnInit() {

    // let DISTRIBUTOR_ID: any = this.configService.configKey('DISTRIBUTOR_ID');
    // alert(DISTRIBUTOR_ID);

    this.config = this.configService.config();
    // this.products = this.configService.getProducts();
    // this.product = this.configService.productsKey('');


    // this.getProducts();

    window.scrollTo(0, 0);
  }

  getProducts() {
    this.prods = (this.configService.getProducts()).filter(prods => ((prods.sku === this.params) || (this.params === '')) );
    window.scrollTo(0, 0);
    // this.dataObservableService
    //   .getProductsService()
    //   .subscribe(
    //     (res) => {
    //       this.zone.run(() => {
    //       });
    //       let z: any;
    //       z = res;
    //       this.prods = z.filter(prods => ((prods.sku === this.params) || (this.params === '')) );
    //       window.scrollTo(0, 0);
    //     },
    //     (err) => {console.log('error!', err)},
    // );
  }


  ngAfterViewInit() {

  }

  callRoute(z) {
    event.preventDefault();

    this.router.navigate(['/blank']);
    setTimeout( () => {
        // this.navbarrouter.navigate(['/browser', {name: browserRef, url: pathRef}]);
        this.router.navigate([z]);
    }, 1);
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }

  getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  cleanHTMLEntities(str) {
    // block creating object more than once
    const rssItem = document.createElement('div');
    if (str && typeof str === 'string') {
        // remove script/html tags
        str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
        str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
        rssItem.innerHTML = str;
        // 'textContent' isn't avaiable in IE8
        if (rssItem.textContent === undefined) {
          str = rssItem.innerText;
          rssItem.innerText = '';
        } else {
          str = rssItem.textContent;
          rssItem.textContent = '';
        }
    }
    return str;
  }

  getDate = function (date, objDate) {
    // Create object whoose properties are feed values
    const day = date.getUTCDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    objDate.year = (year.toString().length === 1 ? '0' : '') + year;
    objDate.month = (month.toString().length === 1 ? '0' : '') + month;
    objDate.day = (day.toString().length === 1 ? '0' : '') + day;
    objDate.hours = (hours.toString().length === 1 ? '0' : '') + hours;
    objDate.minutes = (minutes.toString().length === 1 ? '0' : '') + minutes;
    objDate.seconds = (seconds.toString().length === 1 ? '0' : '') + seconds;
  };

  getVideoEmbed(tube, videoidVal) {
    // <!--template: '<div class='video'><iframe src='{{url}}' frameborder='0'
    // webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div>',-->
    let embedUrl = '';
    if ((tube === 'category') || (tube === 'music') || (tube === 'web')) {
      embedUrl = videoidVal;
    } else if ((tube === 'yt_channel') || (tube === 'channel_youtube')) {
      embedUrl = 'http://www.youtube.com/embed?listType=search&amp;list=' + videoidVal + '&format=5';
    } else if ((tube === 'youtube') || (tube === 'embed_youtube')) {
      embedUrl = 'http://www.youtube.com/embed/' + videoidVal;
    } else if ((tube === 'youku') || (tube === 'embed_youku')) {
      embedUrl = 'http://player.youku.com/embed/' + videoidVal;
    } else if ((tube === 'vimeo') || (tube === 'embed_vimeo')) {
      embedUrl = 'http://player.vimeo.com/video/' + videoidVal;
    } else if ((tube === 'ustreamtv') || (tube === 'embed_ustreamtv')) {
      embedUrl = 'http://www.ustream.tv/embed/' + videoidVal;
    } else if ((tube === 'animalplanet') || (tube === 'embed_animalplanet')) {
      embedUrl = 'http://www.animalplanet.com/embed?page=' + videoidVal;
    } else if ((tube === 'dailymotion') || (tube === 'embed_dailymotion')) {
      embedUrl = 'http://www.dailymotion.com/embed/video/' + videoidVal;
    } else if ((tube === '5min') || (tube === 'embed_5min')) {
      embedUrl = 'http://embed.5min.com/' + videoidVal;
    } else if ((tube === 'cc') || (tube === 'embed_cc')) {
      embedUrl = 'http://media.mtvnservices.com/embed/' + videoidVal;
    } else if ((tube === 'meta_ua') || (tube === 'embed_meta_ua')) {
      embedUrl = 'http://video.meta.ua/iframe/' + videoidVal;
    } else if ((tube === 'tune_pk') || (tube === 'embed_tune_pk')) {
      embedUrl = 'http://tune.pk/player/embed_player.php?vid=' + videoidVal + '&autoplay=no';
    } else if ((tube === 'metacafe') || (tube === 'embed_metacafe')) {
      embedUrl = 'http://www.metacafe.com/embed/' + videoidVal;
    } else if ((tube === 'liveleak') || (tube === 'embed_liveleak')) {
      embedUrl = 'http://www.liveleak.com/ll_embed?f=' + videoidVal;
    } else if ((tube === 'ebaumsworld') || (tube === 'embed_ebaumsworld')) {
      embedUrl = 'http://www.ebaumsworld.com/media/embed/' + videoidVal;
    } else if ((tube === 'bliptv') || (tube === 'embed_blip')) {
      embedUrl = 'http://blip.tv/play/' + videoidVal;
    } else if ((tube === 'funnyordie') || (tube === 'embed_funnyordie')) {
      embedUrl = 'http://www.funnyordie.com/embed/' + videoidVal;
    } else if ((tube === 'stupidvideos') || (tube === 'embed_stupidvideos')) {
      embedUrl = 'http://www.stupidvideos.com/embed/?video=' + videoidVal;
    }
    return embedUrl;
  }

  // pageCount = function () {
  //     return Math.ceil(this.products.length / this.pageSize);
  // };

  // nextPage = function () {
  //     if (this.currentPage >= Math.ceil(this.products.length / this.pageSize) - 1) {
  //         return true;
  //     }
  //     else {
  //         return false;
  //     }
  // };

  // searchMatch(haystack, needle) {
  //     if (!needle) {
  //         return true;
  //     }
  //     return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
  // };

  // forceAddItem(sku, productname, unitprice, saleprice, showsale, quantity, sh, faux) {
  forceAddItem(obj) {
      this.cartService.addItem(obj.sku, obj.productname, obj.unitprice, obj.saleprice, obj.showsale, 1, obj.sh, obj.faux);
      return 'item added';
  }

  ngOnDestroy(): void {
    if (this.sub != null) {
        this.sub.unsubscribe();
    }

  }

}



