import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';
import { CookieService } from './cookie.service';
import { AlertsService } from './alerts.service';

@Injectable()
export class OrderService {
  public cartToken: any;
  public cartData: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public apiService: ApiService,
    public cookieService: CookieService,
    private _alert: AlertsService
  ) { }

  /**
   * Get cart data
   * @access public
   * @return void
   */
  public getProductFromCookie(): void {
    this.apiService.get('/api/order/get-cart').subscribe(
      response => this._getCartData(response.data),
      error => this._getCartError(error)
    );
  }

  /**
   * Get cart done action
   * @param cart
   * @access private
   * @return void
   */
  private _getCartData(cart: any): void {

  }

  /**
   * Can't get cart data
   * @param error
   * @access private
   * @return void
   */
  private _getCartError(error: any): void {

  }

  /**
   * Add product to cookie
   * @param product
   * @access public
   * @return void
   */
  public addTocart(product: any): void {
    this.apiService.post('/api/order/addcart', product).subscribe(
      response => this._addTocartDoneAction(response.data),
      error => this._addTocartErrorAction(error)
    );
  }

  /**
   * Add to cart done action
   * @param res
   * @access private
   * @return void
   */
  private _addTocartDoneAction(res: any): void {
    if (res.cart.length > 0) {
      this._alert.success('Add product to cart.');
    }
  }

  /**
   * Add to cart error action
   * @param error
   * @access private
   * @return void
   */
  private _addTocartErrorAction(error: any): void {
    this._alert.warning('Can\'t add product to cart.');
  }

}
