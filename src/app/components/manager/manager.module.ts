import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// import { BlockUIModule } from 'ng-block-ui';
import { Uploader } from 'angular2-http-file-upload';

import { SharedModule } from '../../shared/shared.module';
import { Routing } from './manager.routing';
import { ManagerComponent } from './manager.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    // BlockUIModule,
    SharedModule,
    Routing
  ],
  declarations: [
    ManagerComponent
  ],
  providers: [
    Uploader
  ],
  bootstrap: [
    ManagerComponent
  ]
})
export class ManagerModule { }
