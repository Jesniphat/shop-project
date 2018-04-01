import { NgModule , ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from '../service/api.service';
import { RootscopeService } from '../service/rootscope.service';
import { CookieService } from '../service/cookie.service';
import { ProductStorageService } from '../service/product-storage.service';
import { MenuListService } from '../service/menu-list.service';
import { AlertsService } from '../service/alerts.service';
import { SocketService } from '../service/socket.service';
import { AccessService } from '../service/access.service';
import { ProductListResolverService } from '../service/product-list-resolver.service';

import { ManagerGuard } from '../_guards/manager.guard';

/**
 * This module mush be in app.module only.
 */
@NgModule({
  imports:      [ CommonModule ],
  declarations: [ ],
  exports:      [ ],
  providers:    [
    ManagerGuard,
    ApiService,
    RootscopeService,
    CookieService,
    ProductStorageService,
    MenuListService,
    AlertsService,
    SocketService,
    AccessService,
    ProductListResolverService
  ]
})

export class SharedServiceModule {}
