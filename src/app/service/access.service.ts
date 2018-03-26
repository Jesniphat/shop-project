import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AccessService {
/**
 * var for subscripe
 */
  public accessSitdBar$: Observable<any>;
  public accessIndex$: Observable<any>;

/**
 * var for observer
 */
  private _accessSitdBar: any;
  private _accessIndex: any;

  constructor(private api: ApiService) {
    this.accessSitdBar$ = new Observable(observer => this._accessSitdBar = observer);
    this.accessIndex$ = new Observable(observer => this._accessIndex = observer);
  }

/**
 * Get access from server eg. { create: 1, edit: 1, delete: 1}
 *
 * @access public
 */
  public access() {
  	this.api
  	.get('/api/authen/access')
  	.subscribe(
  		response => this._setData(response.data),
  		error => this._accessError(error)
  	)
  }

/**
 * Setdata to shows
 * @param response
 * @access private
 */
 private _setData(response) {
   this._accessSitdBar.next(response);
   this._accessIndex.next(response);
 }

/**
 * If can't get access data console the error
 * 
 * @param error
 * @access private
 */
  private _accessError(error: any) {
  	console.log(error);
  }

}
