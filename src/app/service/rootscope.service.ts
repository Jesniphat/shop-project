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

/**
 * var for observer
 */
  private _blockUI: any;
  private _showNav: any;
  private _headerText: any;
  private _scrollBar:any;

  constructor() {
    this.doBlock$ = new Observable(observer => this._blockUI = observer);
    this.showNav$ = new Observable(observer => this._showNav = observer);
    this.headerText$ = new Observable(observer => this._headerText = observer);
    this.scrollBar$ = new Observable(observer => this._scrollBar = observer);
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
}
