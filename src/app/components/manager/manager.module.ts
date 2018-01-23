import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Uploader } from 'angular2-http-file-upload';

import { ManagerRouting } from './manager.routing';
import { TableElementModule } from '../../element/table-element/table-element.module';

import { ManagerComponent } from './manager.component';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard/manager-dashboard.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { CategoryManagerComponent } from './category/category-manager/category-manager.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductManagerComponent } from './product/product-manager/product-manager.component';
import { StaffCreateComponent } from './setting/staff-create/staff-create.component';
import { StaffEditComponent } from './setting/staff-edit/staff-edit.component';
import { StockInComponent } from './stock-in/stock-in.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableElementModule,
    ManagerRouting
  ],
  declarations: [
    ManagerComponent,
    ManagerDashboardComponent,
    CategoryListComponent,
    CategoryManagerComponent,
    ProductListComponent,
    ProductManagerComponent,
    StaffCreateComponent,
    StaffEditComponent,
    StockInComponent
  ],
  providers: [
    Uploader
  ],
  bootstrap: [
    ManagerComponent
  ]
})
export class ManagerModule { }
