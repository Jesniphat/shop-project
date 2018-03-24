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
  public access$: Observable<any>;

  private _blockUI: any;
  private _showNav: any;
  private _headerText: any;
  private _access: any;

  constructor() {
    this.doBlock$ = new Observable(observer => this._blockUI = observer);
    this.showNav$ = new Observable(observer => this._showNav = observer);
    this.headerText$ = new Observable(observer => this._headerText = observer);
    this.access$ = new Observable(observer => this._access = observer);
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

  public setAccess(access: any) {
    this._access.next(access);
  }
}
