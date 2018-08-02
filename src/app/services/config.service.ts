import { Inject, Injectable } from '@angular/core';
import { Http, Jsonp, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { DomSanitizer, SafeResourceUrl, SafeHtml, SafeUrl, SafeStyle} from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
// Too many files inside Rx folder. So I did this to improve loading time.
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
// import { Config } from '../services/config.static';

@Injectable()
export class ConfigService {

    // Load configuration data so they will be available to all views
    private static _config: Object = null;
    // Load products so they will be available to all views
    // We can read from _configPromise value of DATA_SOURCE
    // to see whether to get Products from local or remote source
    private static _products: Object = null;
    // private static _slides: Object = null;
    // We could make 2 calls but one works fine!
    // private static _productsPromise: Promise<any> = null;
    private static _promise: Promise<any> = null;
    private retryCount = 2;
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http,
                private _jsonp: Jsonp,
                private sanitizer: DomSanitizer) {
        this.headers = new Headers(
            {
                'Content-Type': 'application/json',
                'Accept': 'q=0.8;application/json;q=0.9',
                'async': true,
                'dataType': 'jsonp'
            });
        this.options = new RequestOptions({ headers: this.headers });
        ConfigService._promise = this.load();
    }

    public config(): any {
        return ConfigService._config;
    }

    public getProducts(): any {
        return ConfigService._products;
    }

    public configKey(key: any) {
        return ConfigService._config[key];
    }

    generateArray(obj) {
        return Object.keys(obj).map((key) => {
        return obj[key];
        });
    }

    // We are using key = 'sku' instead of productid
    public productsKey(key: any) {
        const z = this.generateArray(ConfigService._products);
        let item: any;
        let notFound = true;
        z.forEach((data) => {
            if ((notFound) && (key === null || data.sku === key.toString)) {
                item = data;
                notFound = false;
            }
        });
        return item;
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    load() {
        localStorage['did'] = '';
        let local_base = './assets/data/' + 'config' + '.json?';
        // we add a random value to prevent caching - this trick works nicely!
        let local_rnd = 'rnd=' + this.getRandomInt(1, 500);
        let local_url = local_base + local_rnd;
        return new Promise((resolve, reject) => {
            this.http.get(local_url)
                .map((response: Response) => response.json())
                .catch((error: any) => {
                    // console.error(error);
                    return Observable.throw(error.json().error || 'Server error');
                })
                .subscribe((data) => {
                    ConfigService._config = data;
                    // resolve(true); // UNSLASH THIS IF YOU ONLY WANT CONFIG DATA !!!
                    // INCLUDE THIS IF YOU WANT TO RETRIEVE PRODUCTS HERE ////
                    let request: any = null;
                    switch (data.DATA_SOURCE) {
                        case 'local': {
                            local_base = './assets/data/products.json?';
                            local_rnd = 'rnd=' + this.getRandomInt(1, 500);
                            local_url = local_base + local_rnd;
                            request = this.http.get(local_url);
                        } break;

                        case 'remote': {
                            // THIS IS NOT WORKING CODE
                            // THIS IS AN EXAMPLE OF HOW TO USE A JSONP SERVER
                            const _store = '';
                            const _userid = '';
                            const jsonp_base = data.JSONP_DOMAIN1;
                            let jsonp_param = 'store=' + _store +  '&userid=' + _userid;
                            jsonp_param = jsonp_param + '&methodName=Feeds&jsonp=JSONP_CALLBACK';
                            const jsonp_rnd = '&rnd=' + this.getRandomInt(1, 500);
                            const jsonp_url = jsonp_base + jsonp_param + jsonp_rnd;
                            request = this._jsonp.get(jsonp_url, this.options);
                        } break;

                        case 'default': {
                            // console.error('Environment file is not set or invalid');
                            resolve(true);
                        } break;
                    }
                    if (request) {
                        request
                            // .map( res => res.json() )
                            .map( (res) => {
                                const products = res.json();
                                this.checkProducts(products);
                                return products;
                            })
                            // // next transform - each element in the
                            // // array to a Product class instance
                            // .map((items: Array<any>) => {
                            //     let result: Array<Products>;
                            //     items.forEach((item) => {
                            //         alert(item.duration);
                            //     });
                            //     return result;
                            // })
                            // .catch(this.handleError);
                            .catch((error: any) => {
                                console.error('Error reading ' + data.DATA_SOURCE + ' configuration file');
                                // resolve(error);
                                // return Observable.throw(error.json().error || 'Server error');
                            })
                            .subscribe((responseData) => {
                                ConfigService._products = responseData;
                                // To add slider add private static _slides: Object = null;
                                // ConfigService._products.forEach((data) => {
                                //   if (data.carousel) {
                                //       ConfigService._slides.push(data);
                                //    }
                                // });
                                resolve(true);
                            });
                            // },
                            // (err) => {console.log('error!', err)}
                            // resolve(true);
                            // );
                    } else {
                        console.error('Env config file "env.json" is not valid');
                        resolve(true);
                    }
                });
        });
    }

    private extractData(res: Response) {
        const body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    checkProducts(prods: any) {
        if (prods) {
            prods.forEach((data) => {
                // Get embed format for given tube servers like youtube, vimeo, youku, etc.
                data.link  = this.getVideoEmbed(data.tube, data.videoid);
                data.videopage = this.sanitizer.bypassSecurityTrustResourceUrl(data.link);
            });
        }
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
        let embedUrl = '';
        // if ( (tube.length < 1) || (videoidVal.length < 1) ||
        //     (tube.length === 'undefined') ||  (tube.length === 'undefined')
        // ) {
        //     embedUrl = 'http://www.youtube.com/embed?listType=search&amp;list=HppJHKwCGCo&format=5';
        // }
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
}

// You can use the code below to load different stores OR
// To setup dev & production environments firt load "config.env"
// to read "envResponse.env" then run switch statement below.
// Loads "env.json" to get current working environment
// (i.e.: 'production', 'development')
// Loads "config.[env].json" to get all env's variables
// (i.e.: 'config.development.json')
///////////////////////////////////////////////////////////////
// .subscribe((envResponse) => {
    // ConfigService._config = envResponse;
    // resolve(true);
    // let request: any = null;
    // switch (envResponse.env) {
    //     case 'production': {
    //         request = this.http.get('config.' + envResponse.env + '.json');
    //     } break;

    //     case 'development': {
    //         request = this.http.get('config.' + envResponse.env + '.json');
    //     } break;

    //     case 'default': {
    //         console.error('Environment file is not set or invalid');
    //         resolve(true);
    //     } break;
    // }
    // if (request) {
    //     request
    //         .map( res => res.json() )
    //         .catch((error: any) => {
    //             console.error('Error reading ' + envResponse.env + ' configuration file');
    //             // resolve(error);
    //             // return Observable.throw(error.json().error || 'Server error');
    //         })
    //         .subscribe((responseData) => {
    //             // ConfigService._config = responseData;
    //             this.config = responseData;
    //             resolve(true);
    //         });
    // } else {
    //     console.error('Env config file "env.json" is not valid');
    //     resolve(true);
    // }
