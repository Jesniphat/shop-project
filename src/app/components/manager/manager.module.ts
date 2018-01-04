import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { Uploader } from 'angular2-http-file-upload';

import { SharedModule } from '../../shared/shared.module';
import { Routing } from './manager.routing';
import { ManagerComponent } from './manager.component';
import { TableElementComponent } from './table-element/table-element.component';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard/manager-dashboard.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { CategoryManagerComponent } from './category/category-manager/category-manager.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductManagerComponent } from './product/product-manager/product-manager.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    SharedModule,
    Routing
  ],
  declarations: [
    ManagerComponent,
    TableElementComponent,
    ManagerDashboardComponent,
    CategoryListComponent,
    CategoryManagerComponent,
    ProductListComponent,
    ProductManagerComponent
  ],
  providers: [
    Uploader
  ],
  bootstrap: [
    ManagerComponent
  ]
})
export class ManagerModule { }
