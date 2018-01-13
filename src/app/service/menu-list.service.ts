import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ApiService } from './api.service';

@Injectable()
export class MenuListService {

  /**
   *
   * Observable varaible // use it!!
   */
  public menuList$: Observable<any>;

  /**
   *
   * Oberver data // tep data
   */
  public _menuList: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    public apiService: ApiService
  ) {
    this.menuList$ = new Observable(observer => this._menuList = observer);
  }

  public getMenuList(hasmenu: boolean, page: string) {
    if (!hasmenu) {
      this._menuList.next([]);
      return;
    }
    const param = {
      page: page
    };

    if (isPlatformBrowser(this.platformId)) {
      this.apiService
      .post('/api/menu/menulist', param)
      .subscribe(
        (response) => {
          // console.log(response);
          if (response) {
            this._menuList.next(response.data);
          }else {
            this._menuList.next([]);
          }
        },
        (error) => {
          this._menuList.next([]);
        }
      );
    }
  }

}
