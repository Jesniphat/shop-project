import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { MenuListService } from '../../service/menu-list.service';
import { SocketService } from '../../service/socket.service';
import { AlertsService } from '../../service/alerts.service';
import { RootscopeService } from '../../service/rootscope.service';

declare const $: any;

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {
  /**
   * public variable
   */
  public menuLists = [];
  public headerText: any = '';

  /**
   * Constructor
   *
   * @param apiService
   * @param menuListService
   * @param router
   * @param socketService
   * @param alertsService
   */
  constructor(
    @Inject(PLATFORM_ID) private platformId: object, // Get platform is cliend and server
    private apiService: ApiService,
    private menuListService: MenuListService,
    private router: Router,
    public socketService: SocketService,
    public alertsService: AlertsService,
    public $rootScope: RootscopeService
  ) { }

  /**
   * Init
   *
   * @access public
   * @returns void
   */
  public ngOnInit() {
    // console.log('ManagerSite');
    this.$rootScope.doBlock$.subscribe(data => this.block(data));
    this.$rootScope.headerText$.subscribe(text => this.headerText = text || '');
    this.menuListService.menuList$.subscribe(data => this.menu(data));

    this.menuListService.getMenuList(true, 'system');
  }

  /**
   * Ping
   *
   * @param data
   * @access public
   */
  public pingDoneAction(data: any) {
    // console.log("OK");
  }

  /**
   * Ping Error
   *
   * @param error
   * @access public
   */
  public pingErrorAction(error: any) {
    if (isPlatformBrowser(this.platformId)) {
      // console.log(error);
    }
  }

  /**
   * Toggle between showing and hiding the sidebar, and add overlay effect
   * @access public
   * @returns void
   */
  public w3_open() {
    if (isPlatformBrowser(this.platformId)) {
      if (document.getElementById('mySidebar').style.display === 'block') {
        document.getElementById('mySidebar').style.display = 'none';
        document.getElementById('myOverlay').style.display = 'none';
      } else {
        document.getElementById('mySidebar').style.display = 'block';
        document.getElementById('myOverlay').style.display = 'block';
      }
    }
  }

  /**
   * Close the sidebar with the close button
   * @access public
   * @returns void
   */
  public w3_close() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('mySidebar').style.display = 'none';
      document.getElementById('myOverlay').style.display = 'none';
    }
  }

  // /**
  //  * Scroll
  //  * @access public
  //  * @returns void
  //  */
  // public scrollFunction() {
  //   if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
  //     document.getElementById('myTop').classList.add('w3-card-4', 'w3-animate-opacity');
  //     document.getElementById('myIntro').classList.add('w3-show-inline-block');
  //   } else {
  //     document.getElementById('myIntro').classList.remove('w3-show-inline-block');
  //     document.getElementById('myTop').classList.remove('w3-card-4', 'w3-animate-opacity');
  //   }
  // }

  /**
   * Map menu data
   * @param data
   * @access public
   * @returns void
   */
  public menu(data) {
    this.menuLists = data;
  }

/**
 * Block Ui action
 *
 * @param obj
 * @access public
 */
  public block(obj: any) {
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

}
