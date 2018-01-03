import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class RootscopeService {
  // Observable navItem source
  // public data:any;
  public doBlock$: Observable<any>;
  public showNav$: Observable<any>;
  public headerText$: Observable<any>;

  private _blockUI: any;
  private _showNav: any;
  private _headerText: any;

  constructor() {
    this.doBlock$ = new Observable(observer => this._blockUI = observer);
    this.showNav$ = new Observable(observer => this._showNav = observer);
    this.headerText$ = new Observable(observer => this._headerText = observer);
  }

  // service command
  public loginShow(someObj: any) {
    this._showNav.next(someObj);
  }

  public setBlock(data: boolean, text: string = '') {
    this._blockUI.next({
      block: data,
      text: text
    });
  }

  public changeHeaderText(text: string) {
    this._headerText.next(text);
  }
}
