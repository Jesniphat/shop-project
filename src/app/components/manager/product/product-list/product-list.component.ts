import { Component, OnInit, Input, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BrowserModule, Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ApiService } from '../../../../service/api.service';
import { RootscopeService } from '../../../../service/rootscope.service';
import { AlertsService } from '../../../../service/alerts.service';

import { ProductStorageService } from '../../../../service/product-storage.service';

import { ProductManagerComponent } from '../product-manager/product-manager.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  /**
	 * Set view child from product manage
	 */
  @ViewChild(ProductManagerComponent) public productManagerComponent: ProductManagerComponent;

  public error: any;
  public categoryLists = [];
  public productLists: any = [];
  public productList: any = [];
  public products: any = [];
  public filterText: any = '';
  public sort: any = 'id';
  public pageNo: any = 1;
  public allPage: number[] = [];
  public uploadUrl: any = '/api/upload/product';
  public imgLink: any = '';
  public cols = ['product_name', 'product_description', 'product_qty', 'product_price'];
  public delete_id: any = '';
  public productId: any = 'create';

  public request: any = null;

  public delayID = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    public meta: Meta,
    public title: Title,
    public router: Router,
    public apiService: ApiService,
    public $rootscope: RootscopeService,
    public _elRef: ElementRef,
    public productStoreService: ProductStorageService,
    public alerts: AlertsService
  ) {
    title.setTitle('Product');
    meta.addTags([
      { name: 'author', content: 'Coursetro.com' },
      { name: 'keywords', content: 'product page list manager' },
      { name: 'description', content: 'Show all product list and edit' }
    ]);
  }

  ngOnInit() {
    this.$rootscope.changeHeaderText('product list');
    this.uploadUrl = this.apiService.upl + this.uploadUrl;
    this.imgLink = this.apiService.img;
    this.getCategoryList();
    this.getAllProduct();
    // this._getAllProduct();
  }

  public search(event, action) {
    if (action === 'filter') {
      this.pageNo = 1;
      if (isPlatformBrowser(this.platformId)) {
        if (this.delayID === null) {
          this.delayID = setTimeout(() => {
            const input_data = event;
            this.getAllProduct();
            this.delayID = null;
          }, 1000);
        } else {
          if (this.delayID) {
            clearTimeout(this.delayID);
            this.delayID = setTimeout(() => {
              const input_data = event;
              this.getAllProduct();
              this.delayID = null;
            }, 1000);
          }
        }
      }
    } else if (action === 'sort') {
      this.pageNo = 1;
      this.getAllProduct();
    } else if (action === 'page') {
      this.getAllProduct();
    }
  }

  /**
   * Get category list
   *
   * @access private
   * @returns void
   */
  private getCategoryList(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.apiService
        .get('/api/category')
        .subscribe(
        (data) => {
          if (data.status === true) {
            for (let i = 0; i < data.data.length; i++) {
              this.categoryLists.push({ label: data.data[i].cate_name, value: data.data[i].id });
            }
          } else {
            if (isPlatformBrowser(this.platformId)) {
              console.log('error = ', data.error);
            }
          }
        },
        (error) => {
          if (isPlatformBrowser(this.platformId)) {
            console.log('error = ', error);
          }
        }
        );
    });
  }

  /**
   * Get all Product
   * @access private
   */
  private getAllProduct() {
    this.$rootscope.setBlock(true);
    // if http pedding cancel when have new request.
    if (this.request) {
      this.request.unsubscribe();
    }

    this.request = this.apiService
      .get('/api/product' + '?filtertext=' + this.filterText + '&filtercolumn=' + 'product_name'
      + '&sortby=' + this.sort + '&sortType=' + 'asc' + '&page=' + this.pageNo + '&limit=' + '10')
      .subscribe(
        data => this.getAllProductDoneAction(data), // this.productLists = data.data,
        error => this.getAllProductErrorAction(error)
      );
  }

  /**
   * Get All pruduct done
   * @param data
   * @access private
   */
  private getAllProductDoneAction(res: any) {
    this.productLists = res.data.data;
    this.allPage = [];
    for (let i = 0; i < res.data.row; i++) {
      this.allPage.push(i + 1);
    }
    this.request = null;
    this.$rootscope.setBlock(false);
  }

  /**
   * Get All product error
   * @param error
   * @access private
   * @returns void
   */
  private getAllProductErrorAction(error: any) {
    this.error = error.message;
    this.request = null;
    this.$rootscope.setBlock(false);
  }

  /**
   * Add new Product by dialog
   * @param data
   * @access public
   * @returns void
   */
  public add_new_product(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('addproductmodel').style.display = 'block';
    }
    if (data === 'create') {
      this.productId = data;
      this.productManagerComponent.reset();
    } else {
      this.productId = data.id;
      this.productManagerComponent.getProductByid(data.id);
    }
  }

  /**
   * When click filter box goto 1 page
   * @access public
   * @returns void
   */
  public focusFilter() {
    this.pageNo = 1;
  }

  /**
   * Delete Product dialog
   * @param data
   * @access public
   * @returns void
   */
  public delete_product(data: any) {
    this.delete_id = data.id;
  }

  /**
   * Delete Product
   * @access private
   * @return void
   */
  private removeProduct() {
    const param = { 'id': this.delete_id };
    this.apiService
      .post('/api/product/delete_product', param)
      .subscribe(
      (data) => {
        this.alerts.success('ลบข้อมูลสำเร็จ');
        this.getAllProduct();
        this.productStoreService.deleteProductStore(param);
      },
      (error) => {
        if (isPlatformBrowser(this.platformId)) {
          console.log(error);
        }
        this.alerts.warning('ลบข้อมูลไม่สำเร็จ');
      }
      );
  }

  /**
   * Return result from child
   * @param result
   * @access public
   * @returns void
   */
  public createProductResult(result) {
    if (result) {
      this.getAllProduct();
      if (isPlatformBrowser(this.platformId)) {
        document.getElementById('addproductmodel').style.display = 'none';
      }
    } else {
      if (isPlatformBrowser(this.platformId)) {
        console.log('can\'t save');
      }
    }
  }

}
