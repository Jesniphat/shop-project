import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListResolverService } from '../../service/product-list-resolver.service';

import { GlobalComponent } from './global.component';

import { IndexComponent } from './index/index.component';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'g', pathMatch: 'full'},
  { path: 'g', component: GlobalComponent, children: [
    { path: '', redirectTo: '/global/g/(g:index)', pathMatch: 'full' },
    { path: 'index', component: IndexComponent, outlet: 'g' },
    { path: 'product-list/:id',
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
export class GlobalRouting { }
