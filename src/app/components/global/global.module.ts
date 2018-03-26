import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Uploader } from 'angular2-http-file-upload';

import { GlobalRouting } from './global.routing';
import { SharedComponentModule } from '../../shared/shared-component.module';

import { GlobalComponent } from './global.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IndexComponent } from './index/index.component';
import { AddEditCategoryComponent } from './add-edit-category/add-edit-category.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentModule,
    GlobalRouting
  ],
  declarations: [
  	GlobalComponent,
  	SidebarComponent,
  	IndexComponent,
  	AddEditCategoryComponent
  ],
  providers: [
    Uploader
  ],
  bootstrap: [
    GlobalComponent
  ]
})
export class GlobalModule { }
