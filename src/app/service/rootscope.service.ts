import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RootscopeService {
/**
 * var for subscripe
 */
  public doBlock$: Observable<any>;
  public showNav$: Observable<any>;
  public headerText$: Observable<any>;
  public scrollBar$: Observable<any>;
  public accessSitdBar$: Observable<any>;
  public accessPage$: Observable<any>;
  public accessIndex$: Observable<any>;
  public menu$: Observable<any>;
  public setCategoryId$: Observable<any>;
  public badge$: Observable<any>;

/**
 * var for observer
 */
  private _blockUI: any;
  private _showNav: any;
  private _headerText: any;
  private _scrollBar: any;
  private _accessSitdBar: any;
  private _accessPage: any;
  private _accessIndex: any;
  private _menu: any;
  private _setCategoryId: any;
  private _badge: any;

  constructor() {
    this.doBlock$ = new Observable(observer => this._blockUI = observer);
    this.showNav$ = new Observable(observer => this._showNav = observer);
    this.headerText$ = new Observable(observer => this._headerText = observer);
    this.scrollBar$ = new Observable(observer => this._scrollBar = observer);
    this.accessSitdBar$ = new Observable(observer => this._accessSitdBar = observer);
    this.accessPage$ = new Observable(observer => this._accessPage = observer);
    this.accessIndex$ = new Observable(observer => this._accessIndex = observer);
    this.menu$ = new Observable(observer => this._menu = observer);
    this.setCategoryId$ = new Observable(observer => this._setCategoryId = observer);
    this.badge$ = new Observable(observer => this._badge = observer);
  }

/**
 * Login show nev
 * @param ant someObj
 * @access public
 */
  public loginShow(someObj: any) {
    this._showNav.next(someObj);
  }

/**
 * Set block UI
 * @param boolean data
 * @param string text
 * @access public
 */
  public setBlock(data: boolean, text: string = '') {
    this._blockUI.next({
      block: data,
      text: text
    });
  }

/**
 * Set header text
 * @param string text
 * @access public
 */
  public changeHeaderText(text: string) {
    this._headerText.next(text);
  }

/**
 * Try to set scroll bar hidden
 * @access public
 */
 public setScrollBar(set: string) {
   this._scrollBar.next(set);
 }

/**
 * Set access data to shows
 * @param response
 * @access private
 */
  public setAccessData(response) {
    this._accessSitdBar.next(response);
    if (this._accessPage != null) {
      this._accessPage.next(response);
    }
    if (this._accessIndex != null) {
      this._accessIndex.next(response);
    }
  }

/**
 * Hide or show index menu
 * @param string param
 * @access public
 * @return void
 */
  public setMenu(param: string): void {
    this._menu.next(param);
  }


/**
 * Set category id for product lists page
 * @param int categoryId
 * @access public
 * @return void
 */
  public setCategoryId(id: any): void {
    if (this._setCategoryId != null) {
      this._setCategoryId.next(id);
    }
  }

/**
 * Set number of cart product
 * @param int cartNumber
 * @access public
 * @return void
 */
  public setCartNumber(qty: number = null): void {
    if (qty && this._badge != null) {
      this._badge.next(qty);
    }
  }
}
