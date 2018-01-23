import { NgModule , ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableFilterPipe } from '../pipes/table-filter.pipe';
import { PageNumberPipe } from '../pipes/page-number.pipe';
import { PageListPipe } from '../pipes/page-list.pipe';
import { TableSortPipe } from '../pipes/table-sort.pipe';


@NgModule({
  imports:      [ CommonModule ],
  declarations: [ TableSortPipe, TableFilterPipe, PageNumberPipe, PageListPipe ],
  exports:      [ TableSortPipe, TableFilterPipe, PageNumberPipe, PageListPipe ],
  providers:    [ ]
})

export class SharedPipeModule {}
