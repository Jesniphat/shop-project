import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GlobalRouting } from './global.routing';

import { GlobalComponent } from './global.component';

@NgModule({
  imports: [
    CommonModule,
    GlobalRouting
  ],
  declarations: [GlobalComponent]
})
export class GlobalModule { }
