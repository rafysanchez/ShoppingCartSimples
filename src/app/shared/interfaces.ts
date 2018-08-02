import { ModuleWithProviders } from '@angular/core';
import { Routes } from '@angular/router';

// export class CartItem {
//     sku: string;
//     constructor(sku: string) {
//     this.sku = sku;
//     }
// }

    // update the dataLoaded flag after the data has been loaded
    // i dont know why but its important that the flag doesnt get initialized in an previous step like $scope.dataLoaded = false;
//     $scope.dataLoaded = true;

export class ICartItem {
    productid: string;
    sku: string;
    productname: string;
    storeid: string;
    unitprice: any;
    saleprice: any;
    showsale: Boolean;
    sh: any;
    notes: string;
    faux: Boolean;

    constructor(productid: string,
                sku: string,
                productname: string,
                storeid: string,
                unitprice: any,
                saleprice: any,
                showsale: Boolean,
                sh: any,
                notes: string,
                faux: Boolean) {

    this.productid = productid;
    this.sku = sku;
    this.productname = productname;
    this.storeid = storeid;
    this.unitprice = unitprice;
    this.saleprice = saleprice;
    this.showsale = showsale;
    this.sh = sh;
    this.notes = notes;
    this.faux = faux;
    }
}

export class Product {
    productid: string;
    sku: string;
    productname: string;
    storeid: string;
    categoryname: string;
    header: string;
    shortdesc: string;
    description: string;
    link: string;
    linktext: string;
    imageurl: string;
    imagename: string;
    carousel: Boolean;
    carousel_caption: string;
    tube: string;
    videoid: string;
    videopage: any;
    showvideo: Boolean;
    unitprice: any;
    saleprice: any;
    showsale: Boolean;
    sh: any;
    unitsinstock: any;
    unitsonorder: any;
    reorderlevel: any;
    expecteddate: string;
    discontinued: Boolean;
    notes: string;
    faux: Boolean;
    sortorder: any;


    constructor(productid: string,
                sku: string,
                productname: string,
                storeid: string,
                categoryname: string,
                header: string,
                shortdesc: string,
                description: string,
                link: string,
                linktext: string,
                imageurl: string,
                imagename: string,
                carousel: Boolean,
                carousel_caption: string,
                tube: string,
                videoid: string,
                videopage: any,
                showvideo: Boolean,
                unitprice: any,
                saleprice: any,
                showsale: Boolean,
                sh: any,
                unitsinstock: any,
                unitsonorder: any,
                reorderlevel: any,
                expecteddate: string,
                discontinued: Boolean,
                notes: string,
                faux: Boolean,
                sortorder: any) {

    this.productid = productid;
    this.sku = sku;
    this.productname = productname;
    this.storeid = storeid;
    this.categoryname = categoryname;
    this.header = header;
    this.shortdesc = shortdesc;
    this.description = description;
    this.link = link;
    this.linktext = linktext;
    this.imageurl = imageurl;
    this.imagename = productid;
    this.carousel = carousel;
    this.carousel_caption = carousel_caption;
    this.tube = tube;
    this.videoid = videoid;
    this.videopage = videopage;
    this.showvideo = showvideo;
    this.unitprice = unitprice;
    this.saleprice = saleprice;
    this.showsale = showsale;
    this.sh = sh;
    this.unitsinstock = unitsinstock;
    this.unitsonorder = unitsonorder;
    this.reorderlevel = reorderlevel;
    this.expecteddate = expecteddate;
    this.discontinued = discontinued;
    this.notes = notes;
    this.faux = faux;
    this.sortorder = sortorder;
    }
}

export class Feed {
    FeedId: string;
    category: string;
    title: string;
    author: string;
    shortDescription: string;
    description: string;
    link: any;
    linkType: string;
    linkValue: string;
    image: string;
    rank: number;
    showvideo: boolean;
    moviecategory: string;
    duration: string;
    warnings: string;
    sideeffects: string;
    dosage: string;
    anticoagulant: boolean;
    carcinogenic: boolean;
    hypoglycemic: boolean;
    liverdamage: boolean;
    kidneydamage: boolean;

    constructor(FeedId: string,
                category: string,
                title: string,
                author: string,
                shortDescription: string,
                description: string,
                link: any,
                linkType: string,
                linkValue: string,
                image: string,
                rank: number,
                showvideo: boolean,
                moviecategory: string,
                duration: string,
                warnings: string,
                sideeffects: string,
                dosage: string,
                anticoagulant: boolean,
                carcinogenic: boolean,
                hypoglycemic: boolean,
                liverdamage: boolean,
                kidneydamage: boolean) {

    this.FeedId = FeedId;
    this.category = category;
    this.title = title;
    this.author = author;
    this.shortDescription = shortDescription;
    this.description = description;
    this.link = link;
    this.linkType = linkType;
    this.linkValue = linkValue;
    this.image = image;
    this.rank = rank;
    this.showvideo = showvideo;
    this.moviecategory = moviecategory;
    this.duration = duration;
    this.warnings = warnings;
    this.sideeffects = sideeffects;
    this.dosage = dosage;
    this.anticoagulant = anticoagulant;
    this.carcinogenic = carcinogenic;
    this.hypoglycemic = hypoglycemic;
    this.liverdamage = liverdamage;
    this.kidneydamage = kidneydamage;
    }

    setComplete() {
        this.FeedId = '';
        this.category = '';
        this.title = '';
        this.author = '';
        this.shortDescription = '';
        this.description = '';
        this.link = '';
        this.linkType = '';
        this.linkValue = '';
        this.image = '';
        this.rank = 100;
        this.showvideo = false;
        this.moviecategory = '';
        this.duration = '';
        this.warnings = '';
        this.sideeffects = '';
        this.dosage = '';
        this.anticoagulant = false;
        this.carcinogenic = false;
        this.hypoglycemic = false;
        this.liverdamage = false;
        this.kidneydamage = false;
    }

  }

// state: IState;
// orders?: IOrder[];
// orderTotal?: number;
// latitude?: number,
// longitude?: number

// export class Feed {
//     FeedId: string;
//     category: string;
//     title: string;
//     author: string;
//     shortDescription: string;
//     description: string;
//     // bodyLinks: string;
//     link: string;
//     linkType: string;
//     linkValue: string;
//     image: string;
//     rank: number;
//     // publishedDate: Date;
//     // beginDate: Date;
//     // endDate: Date;
//     // warnings: string;
//     // sideeffects: string;
//     // dosage: string;
//     // anticoagulant: boolean;
//     // carcinogenic: boolean;
//     // hypoglycemic: boolean;
//     // liverdamage: boolean;
//     // kidneydamage: boolean;
//     // city: string;
//     // state: string;
//     // postalCode: string;
//     // country: string;
//     // areaCode: string;
//     // closed: boolean;
//     // carousel: boolean;
//     // carousel_caption: string;
//     showvideo: boolean;
//     moviecategory: string;
//     duration: string;

//     constructor(FeedId: string,
//                 category: string,
//                 title: string,
//                 author: string,
//                 shortDescription: string,
//                 description: string,
//                 // bodyLinks: string,
//                 link: string,
//                 linkType: string,
//                 linkValue: string,
//                 image: string,
//                 rank: number,
//                 // publishedDate: Date,
//                 // beginDate: Date,
//                 // endDate: Date,
//                 // warnings: string,
//                 // sideeffects: string,
//                 // dosage: string,
//                 // anticoagulant: boolean,
//                 // carcinogenic: boolean,
//                 // hypoglycemic: boolean,
//                 // liverdamage: boolean,
//                 // kidneydamage: boolean,
//                 // city: string,
//                 // state: string,
//                 // postalCode: string,
//                 // country: string,
//                 // areaCode: string,
//                 // closed: boolean,
//                 // carousel: boolean,
//                 // carousel_caption: string,
//                 showvideo: boolean,
//                 moviecategory: string,
//                 duration: string) {

//     this.FeedId = FeedId;
//     this.category = category;
//     this.title = title;
//     this.author = author;
//     this.shortDescription = shortDescription;
//     this.description = description;
//     // this.bodyLinks = bodyLinks;
//     this.link = link;
//     this.linkType = linkType;
//     this.linkValue = linkValue;
//     this.image = image;
//     this.rank = rank;
//     // this.publishedDate = _publishedDate;
//     // this.beginDate = _beginDate;
//     // this.endDate = _endDate;
//     // this.warnings = _warnings;
//     // this.sideeffects = _sideeffects;
//     // this.dosage = _dosage;
//     // this.anticoagulant = _anticoagulant;
//     // this.carcinogenic = _carcinogenic;
//     // this.hypoglycemic = _hypoglycemic;
//     // this.liverdamage = _liverdamage;
//     // this.kidneydamage = _kidneydamage;
//     // this.city = _city;
//     // this.state = _state;
//     // this.postalCode = _postalCode;
//     // this.country = _country;
//     // this.areaCode = _areaCode;
//     // this.closed = _closed;
//     // this.carousel = _carousel;
//     // this.carousel_caption = _carousel_caption;
//     this.showvideo = showvideo;
//     this.moviecategory = moviecategory;
//     this.duration = duration;
//     }
//     setComplete() {
//         this.FeedId = '';
//         this.category = '';
//         this.title = '';
//         this.author = '';
//         this.shortDescription = '';
//         this.description = '';
//         // this.bodyLinks = '';
//         this.link = '';
//         this.linkType = '';
//         this.linkValue = '';
//         this.image = '';
//         this.rank = 100;
//         // this.publishedDate = new Date();
//         // this.beginDate = new Date();
//         // this.endDate = new Date();
//         // this.warnings = '';
//         // this.sideeffects = '';
//         // this.dosage = '';
//         // this.anticoagulant = false;
//         // this.carcinogenic = false;
//         // this.hypoglycemic = false;
//         // this.liverdamage = false;
//         // this.kidneydamage = false;
//         // this.city = '';
//         // this.state = '';
//         // this.postalCode = '';
//         // this.country = '';
//         // this.areaCode = '';
//         // this.closed = false;
//         // this.carousel = false;
//         // this.carousel_caption = '';
//         this.showvideo = false;
//         this.moviecategory = '';
//         this.duration = '';
//     }
//   }
