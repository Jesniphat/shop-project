import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../service/api.service';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private router: Router, public apiService: ApiService) { }
  public async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    try {
      await this._checkLogin();

      // logged in so return true
      return true;
    } catch (error) {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/system-login']); // { queryParams: { returnUrl: state.url }} ** บางอย่างที่เค้าใช้กัน
      return false;
    }
  }

  private _checkLogin() {
    return new Promise((resolve, reject) => {
      this.apiService
      .get('/api/authen')
      .subscribe(
        data => {
          if (data.data) {
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
