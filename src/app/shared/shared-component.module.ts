import { NgModule, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SharedPipeModule } from './shared-pipe.module';

import { TableElementComponent } from '../element/table-element/table-element.component';
import { AutocompleteComponent } from '../element/autocomplete/autocomplete.component';

/**
 * This module mush be at module's want to use it.
 *
 * Service use it from app.module don't need to import in here.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedPipeModule
  ],
  declarations: [ TableElementComponent, AutocompleteComponent ],
  exports: [
    TableElementComponent,
    AutocompleteComponent
  ],
  providers: [

  ]
})
export class SharedComponentModule { }
