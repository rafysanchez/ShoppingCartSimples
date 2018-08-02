import { Component, ElementRef, Inject, OnInit, AfterViewInit, OnDestroy, Input, ViewChild, Injectable } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AppRoutingModule, routingComponents } from '../../app.routing';
import { MessageService } from '../../services/message.service';
import 'rxjs/add/operator/pairwise';
import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser'
import { NgZone, Renderer } from '@angular/core';
import { WindowService } from '../../services/window.service';
import { DomSanitizer, SafeResourceUrl, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';
import { DataObservableService } from '../../services/data-observable.service';
import { Location } from '@angular/common';
import { GetPageService } from '../../services/get-page.service';
import { LocalStorageService } from '../../services/local-storage.service';
// import { Config } from '../../services/config.static';
import { ConfigService } from '../../services/config.service';
import { CartService } from '../../services/cart-service';
import { Directive, HostListener, HostBinding } from '@angular/core';

declare var TagCanvas: any;
declare var jQuery: any;
declare var $: any;
// @HostBinding('style.backgroundColor') c_colorrr = "red";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  // host: {
  //   '(document:click)': 'offNavClick($event)',
  // },
  providers: [WindowService, DataObservableService, LocalStorageService, CartService]
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {

  // initiate an array to hold all active tabs
  activeTabs = [];

  public _did = '';
  public _dname = '';
  public _durl = '';

  config: any;
  public products: any;
  active = true;

  public isOpenNavbarTheme = false;
  public isOpenNavbarAnimation = false;
  public isOpenNavbarVideoSites = false;

  public showTransitions = false;
  public showBackgroundTransitions = false;
  public showBorderTransitions = false;
  public showShadowGlowTransitions = false;
  public showCurls = false;

  public headerdisplay: any;
  elementRef: ElementRef;
  _category = 'movies';
  _mcat = '';
  _start = 0;
  _max = 250;
  _pc = '';
  _rad = '';

  public _rss_width: number;
  public _rss_height: number;

  public setClickedRow: any;
  public doc: Array<any>;
  public id: any;
  public url: any;

  public selectedIdx: any = 0;
  public selectedLink: any = 'about:blank';
  public sub: any; // -> Subscriber

  page: any;

  private height: String = '0';
  // @ViewChild('li') bodyEl: ElementRef;

  public showslider: Boolean = false;
  public _bgImage: any;

  // create a radioButtonGroup for our apply effects options
  // public optActions = [
  //   { id: 'apply', name: 'apply effect', disabled: false, showinfo: '' },
  //   { id: 'remove', name: 'remove effect', disabled: false, showinfo: '' }
  // ];

  public myModel = 'store_img';
  public idProperty = 'id';
  public nameProperty = 'name';
  public bootstrapSuffix = 'x-success';
  public disabledProperty = false;
  public showinfoProperty = '';

    // create a radioButtonGroup for our apply effects options
    // { id: 'carousel_img_video', name: 'carousel img', disabled: false,
    // showinfo: 'You need to download and install the AngularJS Slick Carousel to apply effects to the Carousel!' },
    // { id: 'carousel_pill', name: 'carousel pill', disabled: false,
    // showinfo: 'You need to download and install the AngularJS Slick Carousel to apply effects to the Carousel!' }

  public myOptions = [
      { id: 'store_img_video', name: 'store img', disabled: false, showinfo: '' },
      { id: 'store_pill', name: 'store pill', disabled: false, showinfo: '' },
      { id: 'carousel_img_video', name: 'carousel img', disabled: false, showinfo: '' },
      { id: 'carousel_pill', name: 'carousel pill', disabled: false, showinfo: '' }
  ];

  // inject Location into class constructor
  constructor(private configService: ConfigService,
              private zone: NgZone,
              private dataObservableService: DataObservableService,
              private route: ActivatedRoute,
              private router: Router,
              private windowService: WindowService,
              private LocalStorage: LocalStorageService,
              private renderer: Renderer,
              private loc: Location,
              private messageService: MessageService,
              private sanitizer: DomSanitizer,
              public cartService: CartService,
              private _eref: ElementRef) {

    this._did = '';
    this._dname = '';
    this._durl = '';

    // get URL parameters
    this.sub = this.router
      .events
      .subscribe(event => {
        this.config = this.configService.config();
        this.products = this.configService.getProducts();

        // const [first, second] = event.url.split('=');
        if (localStorage['did'] !== 'undefined') {
          for (let x = 0; x < this.config.DISTRIBUTORS.length; x++) {
            if (localStorage['did'] === this.config.DISTRIBUTORS[x].did) {
              // localStorage['did'] = second;
              this._did = this.config.DISTRIBUTORS[x].did;
              this._dname = this.config.DISTRIBUTORS[x].dname;
              this._durl = this.config.DISTRIBUTORS[x].durl;
            }
          }
        }
    });


  }

  offNavClick(event) {
    // Off menu code to close dropdowns
    if (!this._eref.nativeElement.contains(event.target)) {
      this.isOpenNavbarTheme = false;
      this.isOpenNavbarAnimation = false;
      this.isOpenNavbarVideoSites = false;
    }
  }

  ngOnInit() {

    // let DISTRIBUTOR_ID: any = this.configService.configKey('DISTRIBUTOR_ID');
    // alert(DISTRIBUTOR_ID);

    this.config = this.configService.config();



    // alert('Configurations: '+ JSON.stringify(this.config));

    this.products = this.configService.getProducts();
    // alert('Configurations: '+ JSON.stringify(this.products));

    const prod: any = this.configService.productsKey('DronesTVApp');
    // alert(prod.sku);

    const css_name = 'navbar_gray_gradient';
    const _path = './assets/ac_css/navbar_gray_gradient.css';
    $('#link_index').attr('href', _path);

    const _carousel_animation = 'hvr-pulse';

    const _navbar_theme = 'navbar_gray_gradient';
    const arBGs = [
    'ac_img/bg0.jpg',
    'ac_img/bg1.jpg',
    'ac_img/bg2.jpg',
    'ac_img/bg3.jpg',
    'ac_img/bg4.jpg',
    'ac_img/bg5.jpg',
    'ac_img/bg6.jpg',
    'ac_img/bg7.jpg',
    'ac_img/bg8.jpg'];

    this._bgImage = './assets/ac_img/bg6.jpg';
    if (localStorage['bg_cart']) {
        this._bgImage = localStorage['bg_cart'];
    } else {
        this._bgImage = './assets/ac_img/bg6.jpg';
        localStorage['bg_cart'] = this._bgImage;
    }
    $('body').css('background', '#ffffff url(' + this._bgImage + ') no-repeat center center fixed');

    // $('.navbar').blur(function(){ alert('focus') });
    // $('.navbar').focusout(function(){ alert('focusout') });

  } // end ngOnInit

  ngAfterViewInit() {
    // navbar_logo

  }

  callRoute(z) {
    event.preventDefault();

    this.router.navigate(['/blank']);
    setTimeout( () => {
        // this.router.navigate(['/browser', {name: browserRef, url: pathRef}]);
        this.router.navigate([z]);
    }, 1);
  }

  generateArray(obj) {
    return Object.keys(obj).map((key) => {
      return obj[key];
    });
  }

  changeBackgroundImage(event) {
      // event.stopPropagation();
      event.preventDefault();
      let x = 0;

      // WE can use config.static directly as "Config.CONFIG"
      // instead of using this.config and CartService.
      // for (x = 0; x < Config.CONFIG.STORE_BG_IMAGES.length; x++) {
      //     if (this._bgImage === Config.CONFIG.STORE_BG_IMAGES[x]) { break; }
      // }
      // if (x + 1 < Config.CONFIG.STORE_BG_IMAGES.length) {
      //     this._bgImage = Config.CONFIG.STORE_BG_IMAGES[x + 1];
      // }
      // else {
      //     x = 0;
      //     this._bgImage = Config.CONFIG.STORE_BG_IMAGES[x];
      // }
      //////////////////// this.config and CartService /////////////////////
      for (x = 0; x < this.config.STORE_BG_IMAGES.length; x++) {
          if (this._bgImage === this.config.STORE_BG_IMAGES[x]) { break; }
      }
      if (x + 1 < this.config.STORE_BG_IMAGES.length) {
          this._bgImage = this.config.STORE_BG_IMAGES[x + 1];
      } else {
          x = 0;
          this._bgImage = this.config.STORE_BG_IMAGES[x];
      }
      ////////////////////////////////////////////////////////////////////
      $('body').css('background-image', '');

      if (this._bgImage === './assets/ac_img/bg0.jpg') {
          $('body').css('background-color', '#ffffff');
      } else {
          $('body').css('background', '#ffffff url(' + this._bgImage + ') no-repeat center center fixed');
      }
      localStorage['bg_cart'] = this._bgImage;
  }

  changeNavBar(css_name) {
    // event.stopPropagation();
    event.preventDefault();
    // this.isOpenNavbarTheme = false;
    // this.isOpenNavbarAnimation = false;
    this.isOpenNavbarTheme = !this.isOpenNavbarTheme;

    const s = this.LocalStorage.get('config_cart');
    if (s) {
      s.NAVBAR_THEME = css_name;
      this.LocalStorage.set('config_cart', {'NAVBAR_THEME': css_name} );
    }
    const _path = './assets/ac_css/' + css_name + '.css';
    $('#link_index').attr('href', _path);
    return false;
  }

  changeAnimation(effect_name) {
    event.preventDefault();
    // this.isOpenNavbarTheme = false;
    // this.isOpenNavbarAnimation = false;
    this.isOpenNavbarAnimation = !this.isOpenNavbarAnimation;

    let e = '';
    if (this.myModel === 'carousel_img_video') {
        e = '.carousel_img_video';
    } else if (this.myModel === 'carousel_pill') {
        e = '.carousel_pill';
    } else if (this.myModel === 'store_img_video') {
        e = '.store_img_video';
    } else if (this.myModel === 'store_pill') {
        // e = '.nav-pills li';
        e = '.store_pill';
    }

    if (e.length > 0) {
        $(e).removeClass(function (index, css) {
            return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
        });
        $(e).addClass(effect_name);
    }

    if (effect_name.length > 0) {
        $(e).removeClass(function (index, css) {
            return (css.match(/(^|\s)hvr-\S+/g) || []).join(' ');
        });
        $(e).addClass(effect_name);
    }
    // "AN_CAROUSEL_IMG_VIDEO": "",
    // "AN_CAROUSEL_PILL": "",
    // "AN_STORE_IMG_VIDEO": "hvr-pulse-grow",
    // "AN_STORE_PILL": "",
  }

  showHideCarousel(event) {
    // event.stopPropagation();
    event.preventDefault();

    this.config.CAROUSEL_SHOW = !this.config.CAROUSEL_SHOW;
    const s = this.LocalStorage.get('config_cart');
    if (s) {
      s.CAROUSEL_SHOW = !s.CAROUSEL_SHOW;
      if (s.CAROUSEL_SHOW) {
          $('.carousel_trim').css('display', 'block');
          $('#storeslider_wrapper').css('display', 'block');
          $('#storeslider').slick('slickPrev');
          $('#storeslider').slick('slickNext');
          this.LocalStorage.set('config_cart', {
            'CAROUSEL_SHOW': true
          });
          this.messageService.sendMessage('CAROUSEL_SHOW');
      } else {
          $('.carousel_trim').css('display', 'none');
          $('#storeslider_wrapper').css('display', 'none');
          this.LocalStorage.set('config_cart', {
            'CAROUSEL_SHOW': false
          });
          this.messageService.sendMessage('CAROUSEL_HIDE');
      }

    }

    // if ($('#storeslider_wrapper').css('display') === 'block') {
    //     $('.carousel_trim').css('display', 'none');
    //     $('#storeslider_wrapper').css('display', 'none');
    //     this.LocalStorage.set('config_cart', {
    //       'CAROUSEL_SHOW': false
    //     });
    // }
    // else {
    //     $('.carousel_trim').css('display', 'block');
    //     $('#storeslider_wrapper').css('display', 'block');
    //     $("#storeslider").slick('slickPrev');
    //     $("#storeslider").slick('slickNext');
    //     this.LocalStorage.set('config_cart', {
    //       'CAROUSEL_SHOW': true
    //     });
    // }
  }

  onClick(event, btnid) {
    // event.stopPropagation();
    event.preventDefault();

    // var target = event.target || event.srcElement || event.currentTarget;
    // var idAttr = target.attributes.id;
    // var value = idAttr.nodeValue;

    if (btnid === 'themes') {
      this.isOpenNavbarAnimation = false;
      this.isOpenNavbarVideoSites = false;
      this.isOpenNavbarTheme = !this.isOpenNavbarTheme;
    } else if (btnid === 'effects') {
      this.isOpenNavbarTheme = false;
      this.isOpenNavbarVideoSites = false;
      this.isOpenNavbarAnimation = !this.isOpenNavbarAnimation;
    } else if (btnid === 'video') {
      this.isOpenNavbarTheme = false;
      this.isOpenNavbarAnimation = false;
      this.isOpenNavbarVideoSites = !this.isOpenNavbarVideoSites;
    }
    return false;
  }


  // Author: Bill SerGio - An elegant way to set the active tab is to use ng-controller
  // to run a single controller outside of the ng-view as shown below.
  isActive(viewLocation) {
      let _loc = '';
      let _loc2 = '';

      if (viewLocation.indexOf('store') > -1) {
        _loc = 'store';
      } else if (viewLocation.indexOf('cart') > -1) {
        _loc = 'cart';
      } else if (viewLocation.indexOf('product') > -1) {
        _loc = 'product';
      } else if (viewLocation.indexOf('blank') > -1) {
        _loc = 'blank';
      } else if (viewLocation === '') {
        _loc = 'store';
      }

      if (this.loc.path().indexOf('store') > -1) {
        _loc2 = 'store';
      } else if (this.loc.path().indexOf('cart') > -1) {
        _loc2 = 'cart';
      } else if (this.loc.path().indexOf('product') > -1) {
        _loc2 = 'product';
      } else if (this.loc.path().indexOf('blank') > -1) {
        _loc2 = 'blank';
      } else if (this.loc.path() === '') {
        _loc2 = 'store';
      }
      return _loc === _loc2;
  }

  // // initiate an array to hold all active tabs
  // activeTabs = [];

  // check if the tab is active
  isOpenTab(tab) {
    // event.stopPropagation();
    event.preventDefault();

    if (tab === 'tab one') {
      return this.showTransitions;
    } else if (tab === 'tab two') {
      return this.showBackgroundTransitions;
    } else if (tab === 'tab three') {
      return this.showBorderTransitions;
    } else if (tab === 'tab four') {
      return this.showShadowGlowTransitions;
    } else if (tab === 'tab five') {
      return this.showCurls;
    }
    // check if this tab is already in the activeTabs array
    // if (this.activeTabs.indexOf(tab) > -1) {
    //     //if so, return true
    //     return true;
    // } else {
    //     //if not, return false
    //     return false;
    // }
  }

  // function to 'open' a tab
  openTab(tab) {
    // event.stopPropagation();
    event.preventDefault();

    if (tab === 'tab one') {
      this.showTransitions = !this.showTransitions;
      // this.showTransitions = false;
      this.showBackgroundTransitions = false;
      this.showBorderTransitions = false;
      this.showShadowGlowTransitions = false;
      this.showCurls = false;
    } else if (tab === 'tab two') {
      this.showBackgroundTransitions = !this.showBackgroundTransitions;
      this.showTransitions = false;
      // this.showBackgroundTransitions = false;
      this.showBorderTransitions = false;
      this.showShadowGlowTransitions = false;
      this.showCurls = false;
    } else if (tab === 'tab three') {
      this.showBorderTransitions = !this.showBorderTransitions;
      this.showTransitions = false;
      this.showBackgroundTransitions = false;
      // this.showBorderTransitions = false;
      this.showShadowGlowTransitions = false;
      this.showCurls = false;
    } else if (tab === 'tab four') {
      this.showShadowGlowTransitions = !this.showShadowGlowTransitions;
      this.showTransitions = false;
      this.showBackgroundTransitions = false;
      this.showBorderTransitions = false;
      // this.showShadowGlowTransitions = false;
      this.showCurls = false;
    } else if (tab === 'tab five') {
      this.showCurls = !this.showCurls;
      this.showTransitions = false;
      this.showBackgroundTransitions = false;
      this.showBorderTransitions = false;
      this.showShadowGlowTransitions = false;
      // this.showCurls = false;
    }

    // check if tab is already open
    // if (this.isOpenTab(tab)) {
    //     //if it is, remove it from the activeTabs array
    //     this.activeTabs.splice(this.activeTabs.indexOf(tab), 1);
    // } else {
    //     this.activeTabs = [];
    //     //if it's not, add it!
    //     this.activeTabs.push(tab);
    // }
    return false;
  }

  activate(option, even) {
    // event.stopPropagation();
    event.preventDefault();

    this.myModel = option;

    $('#store_img_video').removeClass('active');
    $('#store_pill').removeClass('active');
    $('#carousel_img_video').removeClass('active');
    $('#carousel_pill').removeClass('active');

    if (option === 'store_img_video') {
      $('#store_img_video').addClass('active');
    } else if (option === 'store_pill') {
      $('#store_pill').addClass('active');
    } else if (option === 'carousel_img_video') {
      $('#carousel_img_video').addClass('active');
    } else if (option === 'carousel_pill') {
      $('#carousel_pill').addClass('active');
    }

    return false;

  }


  ngOnDestroy(): void {
    // if (this.sub != null) {
    //     this.sub.unsubscribe();
    // }
  }

}


