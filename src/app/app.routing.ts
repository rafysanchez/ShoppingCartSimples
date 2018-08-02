import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { BlankComponent } from './components/blank/blank.component';
import { StoreComponent } from './components/store/store.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductComponent } from './components/product/product.component';
import { AdminComponent } from './components/admin/admin.component';

const routes: Routes = [
    { path: '', component: StoreComponent },
    { path: 'store', component: StoreComponent },
    { path: 'cart', component: CartComponent },
    { path: 'product/:id', component: ProductComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'blank', component: BlankComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})


export class AppRoutingModule {

}

export const routingComponents = [
    AppComponent,
    BlankComponent,
    StoreComponent,
    CartComponent,
    ProductComponent,
    AdminComponent
];

