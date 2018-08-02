import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { NgZone } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AppRoutingModule, routingComponents } from '../../app.routing';
import { MessageService } from '../../services/message.service';
import { WindowService } from '../../services/window.service';
import { DomSanitizer, SafeResourceUrl, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';
import { LocalStorageService } from '../../services/local-storage.service';
import { DataObservableService } from '../../services/data-observable.service';
import { Location } from '@angular/common';

import { ViewChild, VERSION } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { PagerService } from '../../services/pager-service';
import { CartService } from '../../services/cart-service';
import { SafeHtmlPipe } from '../../shared/pipes/string/safe-html.pipe';
import { ConfigService } from '../../services/config.service';
import { UniquePipe } from '../../shared/pipes/array/unique.pipe';
import { OrderByPipe } from '../../shared/pipes/array/order-by.pipe';

import { SlickSliderComponent } from '../slick-slider/slick-slider.component';

import * as _ from 'underscore';

declare var jQuery: any;
declare var $: any;
declare var carousel: any;
declare var slick: any;
const CART_KEY = 'AngularCart_items';

@Component({
  moduleId: module.id,
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  providers: [WindowService, DataObservableService, CartService,
              PagerService, UniquePipe, OrderByPipe, SafeHtmlPipe]
})

export class StoreComponent implements OnInit, AfterViewInit, OnDestroy {

  public carouselShow = true;
  public sale_image = 'sale.png';
  public zebra: any;
  public config: any;

  @ViewChild('scrolling') scrolling: ElementRef;

  public isActive = false;
  public selected = false;
  public products: any;
  public slides = [];

  // Author: Bill SerGio, AOT Issue
  public sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list' } ];

  page: any;
  elementRef: ElementRef;

  private _video_width: number;
  private _video_height: number;

  public sub: any; // -> Subscriber
  public bLodCarousel = false;

  // array of all items to be paged
  private allItems: any[];

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  public prods: any;
  public params = '';

  public showslider: Boolean = false;

  public cart: any;
  public items = [];
  public myCart: any;
  public searchTerm: any;
  public bSearch: Boolean = false;

  public sub2: any; // -> Subscriber
  private message: any;

  // inject Location into class constructor
  constructor(private configService: ConfigService,
              private location: Location,
              private zone: NgZone,
              private route: ActivatedRoute,
              private router: Router,
              private windowService: WindowService,
              private LocalStorage: LocalStorageService,
              private sanitizer: DomSanitizer,
              private http: Http,
              private el: ElementRef,
              private pagerService: PagerService,
              private messageService: MessageService,
              public cartService: CartService) {

    el.nativeElement.scrolling = true;

    $(window).on('orientationchange', function(event) {
      this.updateVideoLayout();
    });

    // subscribe to the window resize event
    windowService.size$.subscribe((value: any) => {

    });

    // get URL parameters
    // this.sub = this.router
    //   .events
    //   .subscribe(event => {
    //     const [first, second] = event.url.split('=');
    //     if(second !== 'undefined') {
    //       for (let x = 0; x < this.config.DISTRIBUTORS.length; x++) {
    //         if (second === this.config.DISTRIBUTORS[x].did) {
    //           localStorage['did'] = second;
    //         }
    //       }
    //     }

    // });

    this.sub2 = this.messageService.getMessage().subscribe(message => {
      this.message = message;
      if (this.message.text.length > 0 ) {
        if (this.message.text === 'CAROUSEL_SHOW') {
          this.carouselShow = true;
        } else if (this.message.text === 'CAROUSEL_HIDE') {
          this.carouselShow = false;
        }
      }
    });

  }

  getTotalCount2(sku) {
    return this.cartService.getTotalCount(sku);
  }

  getTotalPrice2(sku) {
    return this.cartService.getTotalPrice(sku);
  }

  ngOnInit() {

    // const v = `Angular v${VERSION.full}`;
    // alert(v);
    this.config = this.configService.config();
    this.setSaleImage();
    this.prods = this.configService.getProducts();
    this.prods.forEach((data) => {
      // if (data.carousel) {
          this.slides.push(data);
       // }
    });

    this.zebra = '';

    this.allItems = this.prods.filter(todo => ((todo.categoryname === this.params) || (this.params === '')) );
    // initialize to page 1
    this.setPage(1);
    window.scrollTo(0, 0);

    this.carouselShow = this.config.CAROUSEL_SHOW;
    if (this.carouselShow) {
        $('.carousel_trim').css('display', 'block');
        $('#storeslider_wrapper').css('display', 'block');
        this.LocalStorage.set('config_cart', {
          'CAROUSEL_SHOW': true
        });
    } else {
        $('.carousel_trim').css('display', 'none');
        $('#storeslider_wrapper').css('display', 'none');
        this.LocalStorage.set('config_cart', {
          'CAROUSEL_SHOW': false
        });
    }

  }

  setSaleImage() {
    // let dob = //Here Im getting dob
    const today = new Date();
    const _m = today.getMonth();
    this.sale_image = './assets/ac_img/sale_sm.png';

    if (_m >= 0 && _m < 5) {
      this.sale_image = this.config.SALE_SM;
      // "./assets/ac_img/sale_sm.png";
      // January 19, 1807 Robert E.
      // May 25–31 Memorial Day
    } else if (_m > 4 && _m < 8) {
      this.sale_image = this.config.SALE_SUMMER_SM;
      // this.sale_image = this.config.SALE_XMAS_SM;
      // "./assets/ac_img/sale_summer_sm.png";
      // July 4th Independence Day
    } else if (_m > 7 && _m < 12) {
      this.sale_image = this.config.SALE_XMAS_SM;
      // "./assets/ac_img/sale_xmas_sm.png";
      // September 1–7 Labor Day
      if ((_m  === 8) && (today.getDay() >= 1 && today.getDay() <= 7)) {
        this.sale_image = this.config.SALE_LABOR_DAY_SM;
      }
      // October 8–14 Columbus Day
      // November 11 Veterans Day
      // November 22–28 Thanksgiving Day
      if ((_m  === 10) && (today.getDay() >= 22 && today.getDay() <= 28)) {
        this.sale_image = this.config.SALE_THANKSGIVING_SM;
      }
    }

    // let birthDate = new Date(dob);
    // let age = today.getFullYear() - birthDate.getFullYear();
    // let m = today.getMonth() - birthDate.getMonth();
    // if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    //     age--;
    // }
  }

  goToProductDetails(item) {
    event.preventDefault();
    this.router.navigate(['/product', item ]);
  }

  callRoute(z) {
    event.preventDefault();
    // $('[data-role=panel]').panel('close');
    this.router.navigate(['/blank']);
    setTimeout( () => {
        this.router.navigate([z]);
    }, 1);
  }

  toNumber(value) {
      const num: any = this.stripNonNumeric(value);
      value = num * 1;
      return isNaN(value) ? 0 : value;
  }

  stripNonNumeric(str) {
      str += '';
      const rgx = /^d|.|-$/;
      let out = '';
      for (let i = 0; i < str.length; i++) {
          if (rgx.test(str.charAt(i))) {
              if (!((str.charAt(i) === '.' && out.indexOf('.') !== -1) ||
                  (str.charAt(i) === '-' && out.length !== 0))) {
                  out += str.charAt(i);
              }
          }
      }
      return out;
  }

  setPage(page: number) {
      if (page < 1 || page > this.pager.totalPages) {
          return;
      }

      let _pageSize: number;
      _pageSize = this.config.PAGE_SIZE;

      // get pager object from service
      this.pager = this.pagerService.getPager(this.allItems.length, page, _pageSize);

      // get current page of items
      this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);

      window.scrollTo(0, 0);
  }

  ngAfterViewInit() {

  }

  search(search) {
    this.zebra = search.toString();
    this.searchTerm = search;
    this.getProducts();
  }

  filterCategory(prop: any, value: any) {
    this.zebra = '';
    this.params = value;
    this.getProducts();
  }

  updateDisplay(section) {
      this.selected = section;
      this.isActive = !this.isActive;

      // let's flip our icons.
      // <a href="#" class="cbp-vm-icon cbp-vm-grid cbp-vm-selected" data-view="cbp-vm-view-grid">Grid View</a>
      // <a href="#" class="cbp-vm-icon cbp-vm-list" data-view="cbp-vm-view-list">List View</a>
      if (section.class.toString() === 'cbp-vm-icon cbp-vm-grid') {
          this.sections = [{ name: 'list', class: 'cbp-vm-icon cbp-vm-list' }];
      } else if (section.class.toString() === 'cbp-vm-icon cbp-vm-list') {
          this.sections = [{ name: 'grid', class: 'cbp-vm-icon cbp-vm-grid' }];
      }
  }

  isSelected(section) {
      return this.isSelected === section;
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

  getProducts() {

    this.prods = this.configService.getProducts();
    // this.prods.forEach((data) => {
    //   if (data.carousel) {
    //       this.slides.push(data);
    //    }
    // });
    // if(this.searchTerm.toString().length === 0)
    //   return this.prods;
    // if ((this.searchTerm.toString().length === 0)) {
    if ((this.zebra.toString().length === 0)) {
      this.allItems = this.prods.filter(todo => ((todo.categoryname === this.params) || (this.params === '')) );
    } else {
      this.allItems = this.prods.filter(item => item.productname.indexOf(this.searchTerm) !== -1);
    }

    // initialize to page 1
    this.setPage(1);
    window.scrollTo(0, 0);

    // this.dataObservableService
    //   .getProductsService()
    //   .subscribe(
    //     (res) => {
    //       this.zone.run(() => {
    //         // this.carousel.initCarousel();
    //       });
    //       this.prods = res;
    //       if(this.searchTerm.toString().length === 0) {
    //         this.allItems = this.prods.filter(todo => ((todo.categoryname === this.params) || (this.params === '')) );
    //       } else {
    //         this.allItems = this.prods.filter(item => item.productname.indexOf(this.searchTerm) !== -1);
    //       }
    //       // initialize to page 1
    //       this.setPage(1);
    //       window.scrollTo(0, 0);
    //     },
    //     (err) => {console.log('error!', err)},
    // );
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

  pageCount = function () {
      return Math.ceil(this.products.length / this.pageSize);
  };

  nextPage = function () {
      if (this.currentPage >= Math.ceil(this.products.length / this.pageSize) - 1) {
          return true;
      } else {
          return false;
      }
  };

  searchMatch(haystack, needle) {
      if (!needle) {
          return true;
      }
      return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
  }

  // forceAddItem(sku, productname, unitprice, saleprice, showsale, quantity, sh, faux) {
  forceAddItem(obj) {

      // this.cartService.addItem(obj.sku, obj.productname, obj.unitprice, obj.saleprice, obj.showsale, 1, obj.sh, obj.faux);
      // $scope.$apply(function () {
      //     $scope.cart.sku = DataService.cart.sku;
      //     $scope.cart.productname = DataService.cart.productname;
      //     $scope.cart.unitprice = DataService.cart.unitprice;
      //     $scope.cart.saleprice = DataService.cart.saleprice;
      //     $scope.cart.showsale = DataService.cart.showsale;
      //     $scope.cart.quantity = DataService.cart.quantity;
      //     $scope.cart.sh = DataService.cart.sh;
      //     $scope.cart.faux = DataService.cart.faux;
      // });
      return 'item added';
  }

  displayPlus(z: any) {
    // slide.unitprice === 0
    if ((z.buynow) && (z.unitprice === 0)) {
      return true;
    } else {
      return false;
    }
  }
  ngOnDestroy(): void {
    if (this.sub != null) {
        this.sub.unsubscribe();
    }
    // $('.slick').slick('unslick');
  }

}



