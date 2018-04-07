import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListResolverService } from '../../service/product-list-resolver.service';

import { GlobalComponent } from './global.component';

import { IndexComponent } from './index/index.component';
import { ProductListComponent } from './product-list/product-list.component';

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
    }
  ]}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class GlobalRoutingModule { }
