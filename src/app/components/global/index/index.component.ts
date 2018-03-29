import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';

import { RootscopeService } from '../../../service/rootscope.service';
import { AlertsService } from '../../../service/alerts.service';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  /** var */
  public accesses = { create: 0, edit: 0, delete: 0 };
  public ucaccess;

  public imgLink: any = '';
  public productLists: any[];

  constructor(
    private _alertsService: AlertsService,
    private _rootScope: RootscopeService,
    private _api: ApiService
  ) { }

  /**
   * Start function
   * @access public
   * @return void
   */
  public ngOnInit(): void {
    this.ucaccess = this._rootScope.accessIndex$.subscribe(accesses => this.accesses = accesses);
    this.imgLink = this._api.img;
    this._getProductFirst();
  }


  /**
   * Get product for show at index page
   * @access private
   * @return void
   */
  private _getProductFirst(): void {
    this._api.get('/api/product?page=1&limit=12&sort=id desc')
    .subscribe(
      response => this._getProductDone(response),
      error => this._getProductError(error)
    );
  }

  /**
   * Can get data
   * @param response
   * @access private
   * @return void
   */
  private _getProductDone(response: any): void {
    this.productLists = response.data;
  }

  /**
   * Show error when get product lists
   * @param error
   * @access private
   * @return void
   */
  private _getProductError(error: any): void {
    console.log(error);
    this._alertsService.warning('Can \'t get data list.');
  }

  /**
   * ng on destroy for destroy subscribe
   * @access public
   * @returns void
   */
  public ngOnDestroy(): void {
    this.ucaccess.unsubscribe();
  }

}
