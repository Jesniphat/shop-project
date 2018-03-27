import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RootscopeService } from './rootscope.service';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AccessService {

  constructor(private api: ApiService, private _rootScope: RootscopeService) { }

/**
 * Get access from server eg. { create: 1, edit: 1, delete: 1}
 * @access public
 */
  public access() {
  	this.api
  	.get('/api/authen/access')
  	.subscribe(
  		response => this._rootScope.setAccessData(response.data),
  		error => this._accessError(error)
  	)
  }

/**
 * If can't get access data console the error
 * @param error
 * @access private
 */
  private _accessError(error: any) {
  	console.log(error);
  }

}
