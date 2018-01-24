import { NgModule , ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../service/api.service';
import { RootscopeService } from '../service/rootscope.service';
import { CookieService } from '../service/cookie.service';
import { ProductStorageService } from '../service/product-storage.service';
import { MenuListService } from '../service/menu-list.service';
import { AlertsService } from '../service/alerts.service';
import { SocketService } from '../service/socket.service';

/**
 * This module mush be in app.module only.
 */
@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ApiService,
    RootscopeService,
    CookieService,
    ProductStorageService,
    MenuListService,
    AlertsService,
    SocketService
  ]
})

export class SharedServiceModule {}
