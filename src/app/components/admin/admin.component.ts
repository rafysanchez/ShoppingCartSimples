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
import { CartService } from '../../services/cart-service';
import { SafeHtmlPipe } from '../../shared/pipes/string/safe-html.pipe';
import { ConfigService } from '../../services/config.service';
import { UniquePipe } from '../../shared/pipes/array/unique.pipe';
import { OrderByPipe } from '../../shared/pipes/array/order-by.pipe';
import { TruncatePipe } from '../../shared/pipes/string/truncate.pipe';
import { Html2TextPipe } from '../../shared/pipes/string/html2-text.pipe';
import { FilterByPipe } from '../../shared/pipes/array/filter-by.pipe';
import { SlickSliderComponent } from '../slick-slider/slick-slider.component';



// import { PhotosService } from '../../services/photos.service';
// import { Photo } from '../../services/photo';

import * as _ from 'underscore';

declare var jQuery: any;
declare var $: any;
const CART_KEY = 'AngularCart_items';

@Component({
  moduleId: module.id,
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [WindowService, DataObservableService, CartService,
            PagerService, UniquePipe, OrderByPipe, SafeHtmlPipe]
})

export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {

  data = {
    repeatSelect: null,
    availableOptions: [
      { 'name': 'YouTube', 'id': 'youtube' },
      { 'name': 'YouKu', 'id': 'youku' },
      { 'name': 'Vimeo', 'id': 'vimeo' },
      { 'name': 'DailyMotion', 'id': 'dailymotion' },
      { 'name': '5min', 'id': '5min' },
      { 'name': 'mtvnservices', 'id': 'cc' },
      { 'name': 'MetaCafe', 'id': 'metacafe' },
      { 'name': 'liveleak', 'id': 'liveleak' },
      { 'name': 'ebaumsworld', 'id': 'ebaumsworld' },
      { 'name': 'bliptv', 'id': 'bliptv' },
      { 'name': 'funnyordie', 'id': 'funnyordie' },
      { 'name': 'stupidvideos', 'id': 'stupidvideos' }
    ],
    selectedOption: { 'id': 'youtube', 'name': 'YouTube' }
  };

  // public uploader: FileUploader = new FileUploader({});
  // photos: Photo[];

  file: File;
  upload: () => void;
  uploadCallback: (data) => void;

  public files: FileList;
  // public file: any;
  public selectedSku: any;
  public carouselFlag = true;

  public videoFlag = false;

  public showvideoFilterClass = 'blktext';
  public carouselFilterClass = 'redtext';
  public myFilter = { };

  public zebra: any;
  public config: any;

  @ViewChild('scrolling') scrolling: ElementRef;

  public isActive = false;
  public selected = false;
  // public products = [];

  /////////////////////
  // array of all items to be paged
  public allItems: any[];
  public prods: any[];
  public shitte: any[];
  //////////////////////

  public slides = [];

  elementRef: ElementRef;

  private _video_width: number;
  private _video_height: number;
  page: any;
  public selectedLink: any = 'about:blank';

  public sub: any; // -> Subscriber
  public bLodCarousel = false;

  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  public params = '';

  public showslider: Boolean = false;

  public cart: any;
  public items = [];
  public myCart: any;
  public searchTerm: any;
  public bSearch: Boolean = false;

  public _sku = '';

  public _imageDir = '';

  private isUploadBtn = true;
  constructor(private configService: ConfigService,
              private location: Location,
              private zone: NgZone,
              private route: ActivatedRoute,
              private storerouter: Router,
              private windowService: WindowService,
              private LocalStorage: LocalStorageService,
              private sanitizer: DomSanitizer,
              private http: Http,
              private el: ElementRef,
              private pagerService: PagerService,
              public cartService: CartService) {

    this.page = this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    this.page = this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedLink);

    storerouter.events.subscribe(event => {
    });

    el.nativeElement.scrolling = true;

    $(window).on('orientationchange', function(event) {
      this.updateVideoLayout();
    });

    // subscribe to the window resize event
    windowService.size$.subscribe((value: any) => {

    });

    // get URL parameters
    this.sub = this.route
      .params
      .subscribe(params => {
        // let z = params['showslider'];
    });

  }

  getTotalCount2(sku) {
    return this.cartService.getTotalCount(sku);
  }

  getTotalPrice2(sku) {
    return this.cartService.getTotalPrice(sku);
  }

  ngOnInit() {

    this.config = this.configService.config();
    this.prods = this.configService.getProducts();
    this.prods.forEach((data) => {
      // if (data.carousel) {
          this.slides.push(data);
       // }
    });

    this.zebra = '';

    this.allItems = this.prods.filter(todo => ((todo.categoryname === this.params) || (this.params === '')) );
    // initialize to page 1
    // this.setPage(1);
    window.scrollTo(0, 0);

  }

  goToProductDetails(item) {
    event.preventDefault();
    this.storerouter.navigate(['/product', item ]);
  }

  callRoute(z) {
    event.preventDefault();
    // $('[data-role=panel]').panel('close');
    this.storerouter.navigate(['/blank']);
    setTimeout( () => {
        this.storerouter.navigate([z]);
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


    if (this.zebra.length === 0) {
      this.allItems = this.prods.filter(todo => ((todo.categoryname === this.params) || (this.params === '')) );
    } else if (this.zebra === 'all') {
      this.allItems = this.prods;
    } else {
      this.allItems = this.prods.filter(item => item.categoryname.indexOf(this.zebra) !== -1);
    }

    // initialize to page 1
    this.setPage(1);
    window.scrollTo(0, 0);
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
      embedUrl = 'https://www.youtube.com/embed?listType=search&amp;list=' + videoidVal + '&format=5';
    } else if ((tube === 'youtube') || (tube === 'embed_youtube')) {
      embedUrl = 'https://www.youtube.com/embed/' + videoidVal;
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
      // this.$apply(function () {
      //     this.cart.sku = DataService.cart.sku;
      //     this.cart.productname = DataService.cart.productname;
      //     this.cart.unitprice = DataService.cart.unitprice;
      //     this.cart.saleprice = DataService.cart.saleprice;
      //     this.cart.showsale = DataService.cart.showsale;
      //     this.cart.quantity = DataService.cart.quantity;
      //     this.cart.sh = DataService.cart.sh;
      //     this.cart.faux = DataService.cart.faux;
      // });
      return 'item added';
  }

  carouselFilter () {
    this.carouselFlag = !this.carouselFlag;
    this.prods = this.configService.getProducts();

    // carousel
    if (this.carouselFlag) {
      this.allItems = this.prods.filter(todo => (todo.carousel === true));
    } else {
      this.allItems = this.prods;
    }

    // initialize to page 1
    // this.setPage(1);
    window.scrollTo(0, 0);
  }

  showvideoFilter () {
    this.videoFlag = !this.videoFlag;
    this.prods = this.configService.getProducts();

    // carousel
    if (this.videoFlag) {
      this.allItems = this.prods.filter(todo => (todo.showvideo === true));
    } else {
      this.allItems = this.prods;
    }

    // initialize to page 1
    // this.setPage(1);
    window.scrollTo(0, 0);
  }

  loadProduct(_prod) {
    // this._sku = _prod.sku;
    this.items = this.configService.getProducts();
    this.items = this.items.filter(todo => (todo.sku === _prod.sku) );
    window.scrollTo(0, 0);
  }

  getVideoPage(_page) {
    this.page = this.sanitizer.bypassSecurityTrustResourceUrl(_page);
    $('#yt_player').attr('src', this.page);
  }

  setFilter(value) {
    this.zebra = value;
    this.getProducts();
  }

  fileChange(event) {
    // let fileList: FileList = event.target.files;
    const eventObj: MSInputMethodContext = <MSInputMethodContext> event;
    const target: HTMLInputElement = <HTMLInputElement> eventObj.target;
    // let files: FileList = target.files;
    this.files = target.files;
    this.file = this.files[0];
    // alert(this.files[0].name);
  }

  onChange(event: any, input: any) {
    // (change)="onChange($event, showFileNames)"
    const zfiles = [].slice.call(event.target.files);
    input.value = zfiles.map(f => f.name).join(', ');
    alert(zfiles[0].name);
  }

  uploadFile(event) {

    // $('#txtImageDir').val($('#txtImageDir').val().replace(/\/$/, ""));
    // let imgDir = localStorage["img_dir"];
    // let uploadUrl = "http://localhost:16395/CartImagesHandler.ashx?dir="; // + this.imgDir;

    const formData: FormData = new FormData();
    // formData.append('uploadedFile', this.files[0], this.files[0].name);
    for (const i in this.files) {
      if (this.files.hasOwnProperty(i)) {
        formData.append('uploadedFile', this.files[i]);
      }
    }

    const headers = new Headers();
    // headers.append('Content-Type', 'text');
    headers.append('Accept', 'application/json');
    const options = new RequestOptions({ headers: headers });
    // let uploadUrl = "/api/UploadFileApi";
    const uploadUrl = 'http://www.sergioapps.com/CartImagesHandler.ashx?dir=';
    this.http.post(uploadUrl, formData, options)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => alert('success'),
          error => alert(error)
        );

    // window.location.reload();

  }

  uploadComplete(evt) {
    let newimage = this.files[0].name;
    let zpath = '';
    const imgDir = localStorage['img_dir'];
    if (imgDir.length > 0) {
        zpath = imgDir + '/' + this.files[0].name;
    } else {
        zpath = this.files[0].name;
    }
    newimage = zpath;

    // for (var i = 0; i < this.products.length; i++) {
    //     if (this.products[i].productid == this.product.productid) {
    //         this.products[i].imagename = zpath;
    //         this.product.imagename = zpath;
    //         //alert(this.products[i].imagename);
    //         break;
    //     }
    // }

    const jsonData: any = '';

    // let jsonData = angular.toJson(this.products);
    // // AUTHOR: Bill SerGio - To strip out Angular's unwanted "$$hashKey"
    // // I like a json file that is human readable!
    // jsonData = JSON.stringify(JSON.parse(jsonData), null, 4);
    // this.progressVisible = false;
    // this.files.length = 0;

    // var dataUrl = "/crud.ashx?ac=save2file&cn=products";
    // $.ajax({
    //     type: "POST"
    //     ,cache: false
    //     ,url: dataUrl
    //     ,data: jsonData
    //     ,contentType: "application/json"
    //     ,success: function (result) {
    //         // Location.reload();
    //     }
    //     ,error: function (xhr, ajaxOptions, thrownError) {
    //     }
    // });
  }

  setFiles(element) {
    // this.files = [];
    // for (var i = 0; i < element.files.length; i++) {
    //     this.files.push(element.files[i])
    // }
    // this.progressVisible = false
  }

  setImageDirectory = function (e) {
      // event.stopPropagation();
      // event.preventDefault();
      // e.preventDefault();
      // localStorage["img_dir"] = JSON.stringify($('#txtImageDir').val().replace(/\/$/, ""));
      const z = $('#txtImageDir').val().replace(/\/$/, '');
      localStorage['img_dir'] = z;
      $('#txtImageDir').val(z);
      // e.preventDefault();
      this.imageDir = z;
      alert('Image Directort is set to: ' + z);
      $('#txtImageDir').val(this.imageDir);
      return false;
  };

  uploadFile22(event) {

    // $('#txtImageDir').val($('#txtImageDir').val().replace(/\/$/, ""));
    // let imgDir = localStorage["img_dir"];
    const uploadUrl = 'http://localhost:16395/CartImagesHandler.ashx?dir='; // + this.imgDir;

    // build form
    const form = $('<form/></form>');
    form.attr('action', uploadUrl);
    form.attr('method', 'POST');

    for (const i in this.files) {
        if (this.files.hasOwnProperty(i)) {
          form.attr('uploadedFile', this.files[i]);
        }
    }

    const options = [];
    form.attr('style', 'display:none;');
    // this.addFormFields(form, data);
    // this.addFormFields(form, options);
    $('body').append(form);

    // submit form
    form.submit();
    form.remove();
  }

  addFormFields(form, data) {
      if (data != null) {
          $.each(data, function (name, value) {
              if (value != null) {
                  const input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(value);
                  form.append(input);
              }
          });
      }
  }

  update(product) {

    // this.master = angular.copy(product);
    let bFound = false;

    for (let i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].productid === product.productid) {
            bFound = true;
            this.allItems[i].storeid = '7cc6cb94-0938-4675-b84e-6b97ada53978';
            this.allItems[i].sku = product.sku;
            this.allItems[i].categoryname = product.categoryname;
            this.allItems[i].carousel = product.carousel;
            //////////////////////////////////////////////////////////////////////////
            // Bill SerGio - In order to maintain a uniform look in our shopping cart we MUST elminate all paragraph tags.
            this.allItems[i].carousel_caption = product.carousel_caption.replace(/<p\b[^>]*>/ig, '').replace(/<\/p\b[^>]*>/ig, '');

            // alert(this.products[i].carousel_caption);

            this.allItems[i].productname = product.productname.replace(/<p\b[^>]*>/ig, '').replace(/<\/p\b[^>]*>/ig, '');
            this.allItems[i].header = product.header.replace(/<p\b[^>]*>/ig, '').replace(/<\/p\b[^>]*>/ig, '');
            this.allItems[i].shortdesc = product.shortdesc.replace(/<p\b[^>]*>/ig, '').replace(/<\/p\b[^>]*>/ig, '');
            this.allItems[i].description = product.description.replace(/<p\b[^>]*>/ig, '').replace(/<\/p\b[^>]*>/ig, '');
            // alert(this.products[i].description);
            //////////////////////////////////////////////////////////////////////////
            this.allItems[i].link = product.link;
            this.allItems[i].linktext = product.linktext;
            this.allItems[i].imageurl = product.imageurl;
            this.allItems[i].imagename = product.imagename;
            this.allItems[i].tube = product.tube;
            this.allItems[i].videoid = product.videoid;
            this.allItems[i].showvideo = product.showvideo;
            this.allItems[i].unitprice = product.unitprice;
            this.allItems[i].saleprice = product.saleprice;
            this.allItems[i].showsale = product.showsale;
            this.allItems[i].sh = product.sh;
            this.allItems[i].unitsinstock = product.unitsinstock;
            this.allItems[i].unitsonorder = product.unitsonorder;
            this.allItems[i].reorderlevel = product.reorderlevel;
            this.allItems[i].expecteddate = product.expecteddate;
            this.allItems[i].discontinued = product.discontinued;
            this.allItems[i].notes = product.notes;
            this.allItems[i].faux = product.faux;
            this.allItems[i].sortorder = product.sortorder;
            break;
        }
    }

    if (!bFound) {
        const currentList = this.allItems;
        const newList = currentList.concat(product);
        this.allItems = newList;
    }

    // var iselected = $("select[name='dataSourceSelect'] option:selected").index();
    let dataIndex = localStorage['data_src_index'];

    if (dataIndex == null || dataIndex === 'undefined') {
        dataIndex = 0;
        localStorage['data_src_index'] = 0;
    }

    let jsonData;
    let dataUrl;
    if (dataIndex === 0) {
        // jsonData = angular.toJson(this.allItems);
        jsonData = JSON.stringify(JSON.parse(jsonData), null, 4);
        localStorage['grid_data'] = jsonData;
        dataUrl = '/crud.ashx?ac=save2file&cn=products';
    } else if (dataIndex === 1) {
        // jsonData = angular.toJson(this.product);
        dataUrl = '/crud.ashx?ac=update&cn=local';
    } else if (dataIndex === 2) {
        // jsonData = angular.toJson(this.product);
        dataUrl = '/crud.ashx?ac=update&cn=remote';
    } else {
        return;
    }

    // AUTHOR: Bill SerGio - To strip out Angular's unwanted "$$hashKey"
    // I like a json file that is human readable!
    jsonData = JSON.stringify(JSON.parse(jsonData), null, 4);

    $.ajax({
        type: 'POST'
        , cache: false
        , url: dataUrl
        , data: jsonData
        , contentType: 'application/json'
        , success: function (result) {
            // alert('changes saved!');
            location.reload();
        }
        , error: function (xhr, ajaxOptions, thrownError) {
            // $("#output").html(xhr.responseText);
            // alert(xhr.responseText);
        }
    });

  }

  new(product) {
    // alert("new!");
    // product = angular.copy(this.master);
    // if we were using integers
    //  options.data.productid = localData[localData.length - 1].productid + 1;
    product.productid = (this.S4() + this.S4() + '-' + this.S4() + '-4' +
      this.S4().substr(0, 3) + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4()).toLowerCase();
    product.storeid = '7cc6cb94-0938-4675-b84e-6b97ada53978'; // ptions.data.storeid;
    product.sku = '';
    product.categoryname = '';
    product.productname = '';
    product.header = '';
    product.shortdesc = '';
    product.description = '';
    product.link = '';
    product.linktext =  '';
    product.imageurl =  '';
    product.imagename =  '';
    product.tube = 'youtube';
    product.videoid =  '';
    product.carousel = true;
    product.carousel_caption =  '';
    product.showvideo = false;
    product.unitprice = '0.00';
    product.saleprice = '0.00';
    product.showsale = false;
    product.sh = '0.00';
    product.unitsinstock = 1;
    product.unitsonorder = 1;
    product.reorderlevel = 1;
    product.expecteddate = '2016-01-01T05:00:00.000Z';
    product.discontinued = false;
    product.notes =  '';
    product.faux = false;
    product.sortorder = 100;

  }
  reset = function () {
    // alert("reset!");
    // this.product = angular.copy(this.master);
  };
  delete(product) {
    if (!confirm('Are you sure you want to delete : ' + product.productid)) {
        return;
    }

    let bFound = false;
    let zid =  '';
    for (let i = 0; i < this.allItems.length; i++) {
        if (this.allItems[i].productid === product.productid) {
            zid = product.productid;
            this.allItems.splice(i, 1);
            bFound = true;
            break;
        }
    }

    if (!bFound) {
        return;
    }

    // let iselected = $("select[name='dataSourceSelect'] option:selected").index();
    let dataIndex = localStorage['data_src_index'];
    if (dataIndex == null || dataIndex === 'undefined') {
        dataIndex = 0;
        localStorage['data_src_index'] = 0;
    }

    let jsonData;
    let dataUrl;
    if (dataIndex === 0) {
        // jsonData = angular.toJson(this.allItems);
        jsonData = JSON.stringify(JSON.parse(jsonData), null, 4);
        localStorage['grid_data'] = jsonData;
        dataUrl = dataUrl = '/crud.ashx?ac=save2file&cn=products';
    } else if (dataIndex === 1) {
        // jsonData = angular.toJson(this.product);
        dataUrl = '/crud.ashx?ac=delete&cn=local';
    } else if (dataIndex === 2) {
        // jsonData = angular.toJson(this.product);
        dataUrl = '/crud.ashx?ac=delete&cn=remote';
    } else {
      return;
    }

    // AUTHOR: Bill SerGio - To strip out Angular's unwanted "$$hashKey"
    // I like a json file that is human readable!
    jsonData = JSON.stringify(JSON.parse(jsonData), null, 4);

    $.ajax({
        type: 'POST'
        , cache: false
        , url: dataUrl
        , data: jsonData
        , contentType: 'application/json'
        , success: function (result) {
            // 'alert('changes saved!');
            location.reload();
        }
        , error: function (xhr, ajaxOptions, thrownError) {
            // $("#output").html(xhr.responseText);
            // alert(xhr.responseText);
        }
    });

  }
  // reset();

  S4() {
    const z = ((1 + Math.random()) * 0x10000);
    let s = '';
    if (z < 0) {
        s = (0).toString(16).substring(1);
    } else {
        s = (z).toString(16).substring(1);
    }
    return s;
  }

  ngOnDestroy(): void {
    if (this.sub != null) {
        this.sub.unsubscribe();
    }
    // $('.slick').slick('unslick');
  }

}


