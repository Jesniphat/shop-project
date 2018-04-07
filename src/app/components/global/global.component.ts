import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';

import { ApiService } from '../../service/api.service';
import { AlertsService } from '../../service/alerts.service';
import { AccessService } from '../../service/access.service';
import { SocketService } from '../../service/socket.service';
import { RootscopeService } from '../../service/rootscope.service';

declare const $: any;

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.scss']
})
export class GlobalComponent implements OnInit, OnDestroy {
  public storage: any;
  public password: any;
  public username: any;
  public staff = {
    staffName: '',
    staffLastName: '',
    staffUserName: '',
    staffId: '',
    staffPic: ''
  };
  public accesses: any = { create: 0, edit: 0, delete: 0 };
  public unsubRootScopeBlogUi: any;
  public unsubScrollBar: any;
  public unsubMenu: any;
  public unsubAccess: any;
  public scroll: any = 'auto';

  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    private _apiService: ApiService,
    private _alertsService: AlertsService,
    private _accessService: AccessService,
    private _rootScope: RootscopeService
  ) { }

/**
 * ngOnInit
 * @access public
 */
  public ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.storage = localStorage;
      this.getStaffFromStorage();
    }

    this.unsubRootScopeBlogUi = this._rootScope.doBlock$.subscribe(data => this.block(data));
    this.unsubScrollBar = this._rootScope.scrollBar$.subscribe(data => this.scroll = data);
    this.unsubMenu = this._rootScope.menu$.subscribe(data => this._showMenu(data));
    this.unsubAccess = this._rootScope.accessIndex$.subscribe(data => this.accesses = data);
    this._accessService.access();
  }

/**
 * Get staff data from local storage
 * @access public
 */
  public getStaffFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.storage.getItem('logindata')) {
        const logindata = JSON.parse(this.storage.getItem('logindata'));
        const staffData = logindata;
        this.staff.staffName = staffData.display_name;
        this.staff.staffLastName = staffData.last_name;
        this.staff.staffUserName = staffData.login_name;
        this.staff.staffId = staffData.id;
        this.staff.staffPic = staffData.pic || 'public/images/empty-image.png';
      }
    }
  }


/**
 * Block Ui action
 * @param obj
 * @access public
 * @return void
 */
  public block(obj: any): void {
    if (isPlatformBrowser(this.platformId)) {
      if (obj.block === true && obj.block !== undefined) {
        if (obj.text) {
          $.blockUI({
            css: { backgroundColor: 'none', border: '0px' },
            message: '<h3><i class="fa fa-spinner"></i> ' + obj.text + '</h3>'
          });
        } else {
          $.blockUI({
            css: { backgroundColor: 'none', border: '0px' },
            message: '<h3><i class="fa fa-spinner"></i> Loading...</h3>'
          });
        }
      } else {
        $.unblockUI();
      }
    }
  }

/**
 * Error thing
 * @param string error
 * @access private
 * @return void
 */
  private _showError(error): void {
    this._alertsService.warning(error);
  }

/**
 * Set show or hide side bar
 * @param string data
 * @access private
 * @return void
 */
  private _showMenu(data: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('mySidebar').style.display = data;
      document.getElementById('myOverlay').style.display = data;
    }
  }

/**
 * Open side bar
 * @access public
 * @return void
 */
  public w3_open(): void {
    this._rootScope.setMenu('block');
  }

/**
 * Close side bar
 * @access public
 * @return void
 */
  public w3_close(): void {
    this._rootScope.setMenu('none');
  }


/**
 * Show login
 * @access public
 * @return void
 */
  public showLogin(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('login').style.display = 'block';
    }
  }

/**
 * Login
 * @access public
 * @return void
 */
  public login(): void {
    this._rootScope.setBlock(true, 'Logining...');
    const param = {
      user: this.username,
      password: this.password
    };
    this._apiService
      .post('/api/authen/login', param)
      .subscribe(
          (res) => this._loginDoneAction(res),
          (error) => this._loginErrorAction(error)
      );
  }


/**
 * Login done action
 * @param res
 * @access private
 * @return void
 */
  private _loginDoneAction(res: any): void {
    this._rootScope.setBlock(false);
    if ( res.status === true) {
      if (isPlatformBrowser(this.platformId)) {
        const loginData = JSON.stringify(res.data);
        this.storage.setItem('logindata', loginData);
      }
      this._accessService.access();
      this.cancelLogin();
    } else {
      this._alertsService.warning('Can not login.');
    }
  }


/**
 * Login error action
 * @param res
 * @access private
 * @return void
 */
  private _loginErrorAction(error: any) {
    this._rootScope.setBlock(false);
    this._alertsService.warning('Can not login. ' + error);
    // console.log('error = ', this.error);
  }


/**
 * Cancel login
 * @access public
 * @return void
 */
  public cancelLogin(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('login').style.display = 'none';
    }
  }

/**
 * Logout
 * @access public
 * @return void
 */
  public logout(): void {
    this._rootScope.setBlock(true, 'Logouting...');
    const param = {'clear': 'login'};
    this._apiService
    .post('/api/authen/clearlogin', param)
    .subscribe(
      res => this._logoutDoneAction(res),
      error => this._logoutErrorAction(error)
    );
  }

/**
 * Logout done
 * @access private
 * @return void
 */
  private _logoutDoneAction(res): void {
    this._rootScope.setBlock(false);
    if (isPlatformBrowser(this.platformId)) {
      if (this.storage.getItem('logindata')) {
        localStorage.removeItem('logindata');
      }
    }
    this._accessService.access();
  }

/**
 * Logout error
 * @access private
 * @return void
 */
  private _logoutErrorAction(error): void {
    this._rootScope.setBlock(false);
    this._alertsService.warning('Can not logout ' + error);
  }

/**
 * Unsub
 * @access public
 * @return void
 */
  public ngOnDestroy(): void {
    this.unsubRootScopeBlogUi = this.unsubRootScopeBlogUi != null ? this.unsubRootScopeBlogUi.unsubscribe() : null;
    this.unsubScrollBar = this.unsubScrollBar != null ? this.unsubScrollBar.unsubscribe() : null;
    this.unsubMenu = this.unsubMenu != null ? this.unsubMenu.unsubscribe() : null;
    this.unsubAccess = this.unsubAccess != null ? this.unsubAccess.unsubscribe() : null;
  }

}
