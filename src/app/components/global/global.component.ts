import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';

import { ApiService } from '../../service/api.service';
import { AlertsService } from '../../service/alerts.service';
import { AccessService } from '../../service/access.service';
import { SocketService } from '../../service/socket.service';
import { RootscopeService } from '../../service/rootscope.service';

declare const $: any;

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss']
})
export class GlobalComponent implements OnInit, OnDestroy {
  public unsubRootScopeBlogUi: any;
  public unsubScrollBar: any;
  public unsubMenu: any;
  public scroll: any = 'auto';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    private _apiService: ApiService,
    private _alertsService: AlertsService,
    private _accessService: AccessService,
    private _rootScope: RootscopeService
  ) { }

/**
 * ngOnInit
 * @access public
 */
  public ngOnInit() {
    this.unsubRootScopeBlogUi = this._rootScope.doBlock$.subscribe(data => this.block(data));
    this.unsubScrollBar = this._rootScope.scrollBar$.subscribe(data => this.scroll = data);
    this.unsubMenu = this._rootScope.menu$.subscribe(data => this._showMenu(data));
    this._accessService.access();
  }


/**
 * Block Ui action
 * @param obj
 * @access public
 * @return void
 */
  public block(obj: any): void {
    if (isPlatformBrowser(this.platformId)) {
      if (obj.block === true && obj.block !== undefined) {
        if (obj.text) {
          $.blockUI({
            css: { backgroundColor: 'none', border: '0px' },
            message: '<h3><i class="fa fa-spinner"></i> ' + obj.text + '</h3>'
          });
        } else {
          $.blockUI({
            css: { backgroundColor: 'none', border: '0px' },
            message: '<h3><i class="fa fa-spinner"></i> Loading...</h3>'
          });
        }
      } else {
        $.unblockUI();
      }
    }
  }

/**
 * Error thing
 * @param string error
 * @access private
 * @return void
 */
  private _showError(error): void {
    this._alertsService.warning(error);
  }

/**
 * Set show or hide side bar
 * @param string data
 * @access private
 * @return void
 */
  private _showMenu(data: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('mySidebar').style.display = data;
      document.getElementById('myOverlay').style.display = data;
    }
  }

/**
 * Open side bar
 * @access public
 * @return void
 */
  public w3_open(): void {
    this._rootScope.setMenu('block');
  }

/**
 * Close side bar
 * @access public
 * @return void
 */
  public w3_close(): void {
    this._rootScope.setMenu('none');
  }

/**
 * Unsub
 * @access public
 * @return void
 */
  public ngOnDestroy(): void {
    this.unsubRootScopeBlogUi.unsubscribe();
    this.unsubScrollBar.unsubscribe();
  }

}
