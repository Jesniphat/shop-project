import { Component, OnInit, OnDestroy, Input, ElementRef, Inject, PLATFORM_ID, AfterViewInit, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';

import { ApiService } from '../../../service/api.service';
import { AlertsService } from '../../../service/alerts.service';
import { RootscopeService } from '../../../service/rootscope.service';

import { AddEditCategoryComponent } from '../add-edit-category/add-edit-category.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public accessSitebars = { create: 0, edit: 0, delete: 0 };
  public categoryLists;
  public unsubaccesses;
  public categoryId: any = 'create';

  private _deleteCategoryId: any = 0;
  public cateName: any = '';

/**
 * Set view child from category manage
 */
  @ViewChild(AddEditCategoryComponent) private addEditCategoryComponent: AddEditCategoryComponent;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private _apiService: ApiService,
    private _alertsService: AlertsService,
    private _rootScope: RootscopeService
  ) { }

  ngOnInit() {
    this.unsubaccesses = this._rootScope.accessSitdBar$.subscribe(accesses => this.accessSitebars = accesses);
    this._getCategoryList();
  }

/**
 * Set category id for product lists page
 * @param int categoryId
 * @access public
 * @return void
 */
  public setCategoryId(categoryId: any): void {
    this._rootScope.setCategoryId(categoryId);
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
      this._rootScope.setScrollBar('auto');
    }
  }

/**
 * confirm delete category
 * @param id
 * @param string cateName
 * @access public
 */
 public confirmDelete(id: any, cateName: string) {
   this._deleteCategoryId = id;
   this.cateName = cateName;
   if (isPlatformBrowser(this.platformId)) {
     document.getElementById('confirmDeleteCategory').style.display = 'block';
   }
 }



/**
 * Delete category
 * @access public
 */
 public deleteCategory() {
   this._rootScope.setBlock(true, 'Deleting...');
   this._apiService.delete('/api/category/' + this._deleteCategoryId).subscribe(
     response => this._deleteCategoryDone(response),
     error => this._alertsService.warning('Can not detet category ' + error)
   );
 }


/**
 * Delete category done
 * @param response
 * @access private
 */
 private _deleteCategoryDone(response: any) {
   this._rootScope.setBlock(false);
   this._alertsService.success('Delete category success');
   this._getCategoryList();
   this.closeModel();
 }


/**
 * Delete category done
 * @param response
 * @access private
 */
 private _deleteCategoryError(error: any) {
   this._rootScope.setBlock(false);
   this._alertsService.warning('Can not detet category ' + error);
 }


/**
 * close model delete
 * @access public
 */
 public closeModel() {
   if (isPlatformBrowser(this.platformId)) {
     document.getElementById('confirmDeleteCategory').style.display = 'none';
   }
 }

/**
 * Close side bar
 * @access public
 * @return void
 */
  public w3_close(): void {
    this._rootScope.setMenu('none');
  }


/** ng on destroy for destroy subscribe
 * @access public
 */
 public ngOnDestroy() {
  let destroy: any;
  destroy = this.unsubaccesses != null ? this.unsubaccesses.unsubscribe() : null;
 }

}
