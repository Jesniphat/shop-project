import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';

import { RootscopeService } from '../../../service/rootscope.service';
import { AlertsService } from '../../../service/alerts.service';
import { ApiService } from '../../../service/api.service';
import { AccessService } from '../../../service/access.service';
import { OrderService } from '../../../service/order.service';

import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {
  /**
	 * Set view child from product manage
	 */
  @ViewChild(AddEditProductComponent) public addEditProductComponent: AddEditProductComponent;
  public productId: any = 'create';

  /** var */
  public accesses = { create: 0, edit: 0, delete: 0 };
  public ucaccess;

  public imgLink: any = '';
  public productLists: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _alertsService: AlertsService,
    private _rootScope: RootscopeService,
    private _api: ApiService,
    private _access: AccessService,
    private _order: OrderService
  ) { }

  /**
   * Start function
   * @access public
   * @return void
   */
  public ngOnInit(): void {
    this.ucaccess = this._rootScope.accessPage$.subscribe(accesses => this.accesses = accesses);
    this._access.access();
    this.imgLink = this._api.img;
    this._getProductFirst();
  }


/**
 * Set category id for product lists page
 * @param int categoryId
 * @access public
 * @return void
 */
  public setCategoryId(categoryId: any): void {
    this._rootScope.setCategoryId(categoryId);
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
    this.productLists = response.data.data;
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
      this._getProductFirst();
      if (isPlatformBrowser(this.platformId)) {
        document.getElementById('addproductmodel').style.display = 'none';
      }
    } else {
      if (isPlatformBrowser(this.platformId)) {
        console.log('can\'t save');
      }
    }
  }

  /**
   * Add Product to cart
   * @param id
   * @param product_name
   * @param product_price
   * @access public
   * @return void
   */
  public addToCart(id: number, product_name: string, product_price: number): void {
    const product = {
      id: id,
      name: product_name,
      price: product_price
    };

    this._order.addTocart(product);
  }

  /**
   * ng on destroy for destroy subscribe
   * @access public
   * @returns void
   */
  public ngOnDestroy(): void {
    let destroy: any;
    destroy = this.ucaccess != null ? this.ucaccess.unsubscribe() : null;
  }

}
