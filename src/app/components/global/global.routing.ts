import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GlobalComponent } from './global.component';

import { IndexComponent } from './index/index.component';
import { ProductListComponent } from './product-list/product-list.component';
// import { CategoryListComponent } from './category/category-list/category-list.component';
// import { CategoryManagerComponent } from './category/category-manager/category-manager.component';
// import { ProductListComponent } from './product/product-list/product-list.component';
// import { ProductManagerComponent } from './product/product-manager/product-manager.component';
// import { StaffCreateComponent } from './setting/staff-create/staff-create.component';
// import { StaffEditComponent } from './setting/staff-edit/staff-edit.component';
// import { StockInComponent } from './stock-in/stock-in.component';

const routes: Routes = [
  { path: '', redirectTo: 'g', pathMatch: 'full'},
  { path: 'g', component: GlobalComponent, children: [
    { path: '', redirectTo: '/global/g/(g:index)', pathMatch: 'full' },
    { path: 'index', component: IndexComponent, outlet: 'g' },
    { path: 'product-list', component: ProductListComponent, outlet: 'g'}
  ]}
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class GlobalRouting { }
