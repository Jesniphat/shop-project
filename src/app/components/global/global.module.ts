import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Uploader } from 'angular2-http-file-upload';

import { GlobalRoutingModule } from './global.routing';
import { SharedComponentModule } from '../../shared/shared-component.module';

import { GlobalComponent } from './global.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IndexComponent } from './index/index.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';
import { AddEditProductComponent } from './add-edit-product/add-edit-product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductStockComponent } from './product-stock/product-stock.component';
import { CartListComponent } from './cart-list/cart-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GlobalRoutingModule,
    SharedComponentModule
  ],
  declarations: [
    GlobalComponent,
    SidebarComponent,
    IndexComponent,
    AddEditCategoryComponent,
    AddEditProductComponent,
    ProductListComponent,
    ProductStockComponent,
    CartListComponent
  ],
  providers: [
    Uploader
  ],
  bootstrap: [
    GlobalComponent
  ]
})
export class GlobalModule { }
