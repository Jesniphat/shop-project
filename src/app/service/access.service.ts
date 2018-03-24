import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { RootscopeService } from './rootscope.service';

@Injectable()
export class AccessService {
  // public access;

  constructor(private api: ApiService, private rootscope: RootscopeService) { }

  public access() {
  	this.api
  	.get('/api/authen/access')
  	.subscribe(
  		response => this.rootscope.setAccess(response.data),
  		error => this._accessError(error)
  	)
  }

  private _accessError(error: any) {
  	console.log(error);
  }

}
