import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { RootscopeService } from '../../../service/rootscope.service';
import { AlertsService } from '../../../service/alerts.service';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  public filterText = '';
  public sort: any = 'id';
  public pageNo: any = 1;
  public categoryId: any;
  public productLists: Array<any> = [];
  public access: any;

  public unsubAccess: any;

  constructor(
    public meta: Meta,
    public title: Title,
    public router: Router,
    public route: ActivatedRoute,
    private _api: ApiService,
    private _rootScope: RootscopeService,
    private _alert: AlertsService
  ) { }

  public ngOnInit() {
    this.unsubAccess = this._rootScope.accessPage$.subscribe(data => this.access);
    this.categoryId = this.route.snapshot.queryParamMap.get('category');
    console.log(this.categoryId);
    this._getProduct();
  }

  /**
   * Get product by category id
   * @access private
   * @return void
   */
  private _getProduct() {
    this._api.get('/api/product/category/' + this.categoryId + '?filtertext=' + this.filterText
    + '&filtercolumn=' + 'product_name' + '&sortby=' + this.sort + '&sortType=' + 'asc'
    + '&page=' + this.pageNo + '&limit=' + '10')
    .subscribe(
      response => this.productLists = response.data,
      error => this._alert.warning('Can not get data ' + error)
    );
  }

  public ngOnDestroy() {
    this.unsubAccess.unsubscribe();
  }

}
