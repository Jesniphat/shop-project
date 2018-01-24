import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedPipeModule } from './shared-pipe.module';

import { TableElementComponent } from '../element/table-element/table-element.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedPipeModule
  ],
  declarations: [ TableElementComponent ],
  exports: [
    TableElementComponent
  ]
})
export class SharedComponentModule { }
