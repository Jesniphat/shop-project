import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListResolverService } from '../../service/product-list-resolver.service';

import { GlobalGuard } from '../../_guards/global.guard';

import { GlobalComponent } from './global.component';

import { IndexComponent } from './index/index.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductStockComponent } from './product-stock/product-stock.component';
import { CartListComponent } from './cart-list/cart-list.component';
import { ConfirmOrderComponent } from './confirm-order/confirm-order.component';

const routes: Routes = [
  { path: '', redirectTo: 'page', pathMatch: 'full'},
  { path: 'page', component: GlobalComponent, children: [
    { path: '', redirectTo: '/global/page/(g:index)', pathMatch: 'full' },
    { path: 'index', component: IndexComponent, outlet: 'g' },
    { path: 'product-list',
      component: ProductListComponent,
      outlet: 'g',
      resolve: {
        categoryId: ProductListResolverService
      }
    },
    { path: 'product-stock', component: ProductStockComponent, outlet: 'g', canActivate: [GlobalGuard]},
    { path: 'cart-list', component: CartListComponent, outlet: 'g' },
    { path: 'confirm-order', component: ConfirmOrderComponent, outlet: 'g'}
  ]}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class GlobalRoutingModule { }
