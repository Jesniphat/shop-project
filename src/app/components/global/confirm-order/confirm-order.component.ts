import { Component, OnInit, Input, ElementRef, Inject, PLATFORM_ID, AfterViewInit, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { RootscopeService } from '../../../service/rootscope.service';
import { OrderService } from '../../../service/order.service';
import { AlertsService } from '../../../service/alerts.service';
import { AccessService } from '../../../service/access.service';

import { TableElementComponent } from '../../../element/table-element/table-element.component';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent implements OnInit {
  /**
   * Set view child from category manage
   */
  @ViewChild(TableElementComponent) private tableElementComponent: TableElementComponent;

  public cartList: any = [];
  public sumPrice: any = 0;
  public users: any [];
  public login: any = {
    id: 0
  };
  public clear: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public meta: Meta,
    public title: Title,
    public router: Router,
    private _api: ApiService,
    private _root: RootscopeService,
    private _order: OrderService,
    private _alert: AlertsService,
    private _access: AccessService
  ) {
    title.setTitle('Category');
    meta.addTags([
      { name: 'cart',   content: 'Product cart, ตระกร้าสินค้า'},
      { name: 'keywords', content: 'Product cart list, รายการสินค้าในตะกร้าสินค้า'},
      { name: 'description', content: 'Product cart list data, รายการสินค้าในตะกร้าสินค้า' }
    ]);
  }

  public ngOnInit() {
    this._getCartList();
    this.clear = this._root.accessPage$.subscribe(accesses => this.login = accesses);
    this._getUserData();
  }

  /**
   * Get cart list
   * @access private
   * @return void
   */
  private _getCartList(): void {
    this._root.setBlock(true);
    this._api.get('/api/order/cart').subscribe(
      response => this._showCartList(response.data),
      error => this._showCartListError(error)
    );
  }

  /**
   * Show cart List
   * @param data: any
   * @access private
   * @return void
   */
  private _showCartList(data): void {
    this.cartList = data.cart;
    const cartColumn = [
      {'name': 'Name', 'column': 'name'},
      {'name': 'Qty', 'column': 'qty'},
      {'name': 'Price', 'column': 'price'}
    ];
    const action = {
      status: false,
      edit: false,
      delete: false
    };

    if (this.cartList.length === 0) {
      this._alert.warning('Not have product in your cart.');
    }

    for (let i = 0; i < this.cartList.length; i++) {
      this.sumPrice += this.cartList[i].price;
    }

    this._root.setBlock(false);
  }


  /**
   * Show cart list error
   * @param error
   * @access private
   * @return void
   */
  private _showCartListError(error: any): void {
    console.log(error);
    this._root.setBlock(false);
  }


  /**
   * Get user login
   * @access private
   * @return void
   */
  private _getUserData(): void {
    this._api.get('/api/user').subscribe(
      response => this._getUserDoneAction(response),
      error => this._getUserErrorAction(error)
    );
  }

  private _getUserDoneAction(response): void {
    if (response.data.status !== 0) {
      this.login = true;
    }
  }


  private _getUserErrorAction(error): void {
    console.log(error);
  }

}
