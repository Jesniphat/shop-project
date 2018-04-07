import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

import { RootscopeService } from '../../../service/rootscope.service';
import { AlertsService } from '../../../service/alerts.service';
import { ApiService } from '../../../service/api.service';
import { AccessService } from '../../../service/access.service';

import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  /**
	 * Set view child from product manage
	 */
  @ViewChild(AddEditProductComponent) public addEditProductComponent: AddEditProductComponent;
  public productId: any = 'create';

  public filterText = '';
  public imgLink: any = '';
  public sort: any = 'id';
  public pageNo: any = 1;
  public categoryId: any;
  public productLists: Array<any> = [];
  public access: any = { create: 0, edit: 0, delete: 0 };

  public unsubAccess: any;
  public unsuCategoryId: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public meta: Meta,
    public title: Title,
    public router: Router,
    public route: ActivatedRoute,
    private _access: AccessService,
    private _api: ApiService,
    private _rootScope: RootscopeService,
    private _alert: AlertsService
  ) { }

  public ngOnInit() {
    this.unsubAccess = this._rootScope.accessPage$.subscribe(data => this.access = data);
    this._access.access();
    this.imgLink = this._api.img;
    // this.categoryId = this.route.snapshot.paramMap.get('id');
    this.route.data
    .subscribe((data: any) => {
      this.categoryId = data.categoryId;
      this._getProduct();
    });
  }

  /**
   * Get product by category id
   * @access private
   * @return void
   */
  private _getProduct() {
    this._api.get('/api/product/category/' + this.categoryId + '?filtertext=' + this.filterText
    + '&filtercolumn=' + 'product_name' + '&sortby=' + this.sort + '&sortType=' + 'desc'
    + '&page=' + this.pageNo + '&limit=' + '10')
    .subscribe(
      response => this.productLists = response.data.data,
      error => this._alert.warning('Can not get data ' + error)
    );
  }

  /**
   * Add new Product by dialog
   * @param data
   * @access public
   * @returns void
   */
  public add_new_product(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('addproductmodel').style.display = 'block';
    }
    if (data === 'create') {
      this.productId = data;
      this.addEditProductComponent.reset();
    } else {
      this.productId = data.id;
      this.addEditProductComponent.getProductByid(data);
    }
  }


  /**
   * Return result from child
   * @param result
   * @access public
   * @returns void
   */
  public createProductResult(result) {
    if (result) {
      this._getProduct();
      if (isPlatformBrowser(this.platformId)) {
        document.getElementById('addproductmodel').style.display = 'none';
      }
    } else {
      if (isPlatformBrowser(this.platformId)) {
        console.log('can\'t save');
      }
    }
  }

  public ngOnDestroy() {
    this.unsubAccess = this.unsubAccess != null ? this.unsubAccess.unsubscribe() : null;
  }

}
