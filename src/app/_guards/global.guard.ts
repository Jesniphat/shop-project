import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../service/api.service';

@Injectable()
export class GlobalGuard implements CanActivate {

  constructor(private router: Router, public apiService: ApiService) { }

  public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      await this._checkLogin();

      // logged in so return true
      return true;
    } catch (error) {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/global']); // { queryParams: { returnUrl: state.url }} ** บางอย่างที่เค้าใช้กัน
      return false;
    }
  }

  private _checkLogin() {
    return new Promise((resolve, reject) => {
      this.apiService
      .get('/api/authen/access')
      .subscribe(
        reaponse => {
          if (reaponse.data.create && reaponse.data.edit && reaponse.data.delete) {
            resolve(true);
          } else {
            reject(false);
          }
        },
        error => reject(false)
      );
    });
  }
}
