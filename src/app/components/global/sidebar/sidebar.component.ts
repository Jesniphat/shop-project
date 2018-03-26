import { Component, OnInit, Input, ElementRef, Inject, PLATFORM_ID, AfterViewInit, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';

import { ApiService } from '../../../service/api.service';
import { AlertsService } from '../../../service/alerts.service';
import { AccessService } from '../../../service/access.service';
import { RootscopeService } from '../../../service/rootscope.service';

import { AddEditCategoryComponent } from '../add-edit-category/add-edit-category.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
	public accessSitebars = { create: 0, edit: 0, delete: 0 };
	public categoryLists;
	public unsubaccesses;
	public categoryId: any = 'create';

	/**
	 * Set view child from category manage
	 */
  @ViewChild(AddEditCategoryComponent) private addEditCategoryComponent: AddEditCategoryComponent;

  constructor(
  	@Inject(PLATFORM_ID) private platformId: object,
  	private _apiService: ApiService, 
  	private _alertsService: AlertsService,
  	private _access: AccessService,
  	private _rootScope: RootscopeService
  ) { }

  ngOnInit() {
  	this.unsubaccesses = this._access.accessSitdBar$.subscribe(accesses => this.accessSitebars = accesses);
  	this._getCategoryList();
  }

/**
 * Get category list datas
 * @access private
 */
 private _getCategoryList() {
 	this._apiService.get('/api/category').subscribe(
 		response => this.categoryLists = response.data,
 		error => this._alertsService.success(error)
 	);
 }

/**
 * Add category function
 *
 * @access public
 * @param data
 * @return void
 */
  public add_new_category(id: any) {
  	this._rootScope.setScrollBar('hidden');
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('addcatemodel').style.display = 'block';
    }
    
    if (id === 'create') {
      this.categoryId = id;
      this.addEditCategoryComponent.reset();
    }else {
      this.categoryId = id;
      this.addEditCategoryComponent.getCategoryByid(id);
    }
  }

/**
 * Create category result for child
 * @param result
 * @access public
 * @returns void
 */
  public createCateResult(result: any) {
    if (result) {
      if (isPlatformBrowser(this.platformId)) {
        document.getElementById('addcatemodel').style.display = 'none';
      }
      this._getCategoryList();
      this._rootScope.setScrollBar('scroll');
    }
  }

/** ng on destroy for destroy subscribe
 * @access public
 */
 public ngOnDestroy() {
	this.unsubaccesses.unsubscribe();
 }

}
