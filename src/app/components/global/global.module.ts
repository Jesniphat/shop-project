import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Uploader } from 'angular2-http-file-upload';

import { GlobalRouting } from './global.routing';
import { SharedComponentModule } from '../../shared/shared-component.module';

import { GlobalComponent } from './global.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedComponentModule,
    GlobalRouting
  ],
  declarations: [
  	GlobalComponent
  ],
  providers: [
    Uploader
  ],
  bootstrap: [
    GlobalComponent
  ]
})
export class GlobalModule { }
