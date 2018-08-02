import { NgModule, ApplicationRef } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app.routing';
import { HttpModule } from '@angular/http';
import { JsonpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
// Too many files inside Rx folder. So I did this to improve loading time.
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ConfigService} from './services/config.service';
import { DataObservableService } from './services/data-observable.service';
import { LocalStorageService } from './services/local-storage.service';
import { PagerService } from './services/pager-service';
import { MessageService } from './services/message.service';

import { CapitalizePipe } from './shared/capitalize.pipe';
import { SafeHtmlPipe } from './shared/pipes/string/safe-html.pipe';
import { UniquePipe } from './shared/pipes/array/unique.pipe';
import { FilterByPipe } from './shared/pipes/array/filter-by.pipe';
import { OrderByPipe } from './shared/pipes/array/order-by.pipe';

import { NavbarComponent } from './components/navbar/navbar.component';
import { BlankComponent } from './components/blank/blank.component';
import { StoreComponent } from './components/store/store.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { SlickSliderComponent } from './components/slick-slider/slick-slider.component';
import { AdminComponent } from './components/admin/admin.component';
import { TruncatePipe } from './shared/pipes/string/truncate.pipe';
import { Html2TextPipe } from './shared/pipes/string/html2-text.pipe';

// We are Using AOT, So useFactory Can't be a Dynamic Function.
// We MUST Use An EXPORTED function as shown below.
export function initConfig(config: ConfigService) {
    return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    NavbarComponent,
    BlankComponent,
    StoreComponent,
    CartComponent,
    ProductComponent,
    CapitalizePipe,
    SafeHtmlPipe,
    UniquePipe,
    FilterByPipe,
    OrderByPipe,
    SlickSliderComponent,
    AdminComponent,
    TruncatePipe,
    Html2TextPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    AppRoutingModule
  ],
  providers: [
    LocalStorageService,
    DataObservableService,
    PagerService,
    MessageService,
    ConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: initConfig,
        // deps: [ConfigService, HttpModule, JsonpModule],
        deps: [ConfigService],
        multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

