import { Component, OnInit, Input, ElementRef, Inject, PLATFORM_ID, AfterViewInit, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../../../service/api.service';
import { RootscopeService } from '../../../service/rootscope.service';
import { OrderService } from '../../../service/order.service';

import { TableElementComponent } from '../../../element/table-element/table-element.component';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {
  /**
	 * Set view child from category manage
	 */
  @ViewChild(TableElementComponent) private tableElementComponent: TableElementComponent;

  public cartList: any = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public meta: Meta,
    public title: Title,
    public router: Router,
    private _api: ApiService,
    private _root: RootscopeService,
    private _order: OrderService
  ) {
    title.setTitle('Category');
    meta.addTags([
      { name: 'cart',   content: 'Product cart, ตระกร้าสินค้า'},
      { name: 'keywords', content: 'Product cart list, รายการสินค้าในตะกร้าสินค้า'},
      { name: 'description', content: 'Product cart list data, รายการสินค้าในตะกร้าสินค้า' }
    ]);
  }

  ngOnInit() {
    this._getCartList();
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
      status: true,
      edit: false,
      delete: true
    };
    this.tableElementComponent.getTableDataLists(
      {
        list: this.cartList,
        column: cartColumn,
        action: action
      }
    );
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
   * When click delete from element table
   * @param data: any
   * @access public
   * @return void
   */
  public getDataDelete(data: any): void {
    this._removeProductFromCart(data);
  }


  /**
   * Remove product to cart
   * @param data
   * @access private
   * @return void
   */
  private _removeProductFromCart(data: any): void {
    this._api.put('/api/order/remove/' + data.id, {})
    .subscribe(
      response => {
        this._getCartList();
        this._root.setCartNumber(response.data.cart.length);
      },
      error => { console.log(error); }
    );
  }


  /**
   * Save order
   * @access public
   * @return void
   */
  public confirmOrder(): void {
    this.router.navigate(['/global/page', {outlets: {'g': ['confirm-order']}}]);
  }

}
